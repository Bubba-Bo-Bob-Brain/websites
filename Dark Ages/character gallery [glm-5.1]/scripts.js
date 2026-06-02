const characterGrid = document.getElementById("characterGrid");
const cards = Array.from(document.querySelectorAll(".character-card"));
const modal = document.getElementById("characterModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const modalInner = document.getElementById("modalInner");
const modalClose = document.getElementById("modalClose");
const bondsChart = document.getElementById("bondsChart");
const plagueParticles = document.getElementById("plagueParticles");

const CHARACTER_DATA = {
  "sister-agata": { name: "Sister Agata", initial: "A", status: "healthy" },
  "viktor": { name: "Viktor", initial: "V", status: "exposed" },
  "elena": { name: "Elena", initial: "E", status: "healthy" },
  "sir-reinhold": { name: "Sir Reinhold", initial: "R", status: "wounded" },
  "maren": { name: "Maren", initial: "M", status: "healthy" },
  "father-dietrich": { name: "Father Dietrich", initial: "D", status: "healthy" },
  "otto": { name: "Otto", initial: "O", status: "exposed" },
  "ida": { name: "Ida", initial: "I", status: "infected" },
  "konrad": { name: "Konrad", initial: "K", status: "healthy" },
  "hildegard": { name: "Hildegard", initial: "H", status: "healthy" },
  "lukas": { name: "Lukas", initial: "L", status: "marked" },
  "greta": { name: "Greta", initial: "G", status: "exposed" },
  "tomasz": { name: "Tomasz", initial: "T", status: "infected" }
};

function createPlagueParticles() {
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("plague-particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = -(Math.random() * 20) + "%";
    particle.style.animationDuration = (8 + Math.random() * 14) + "s";
    particle.style.animationDelay = (Math.random() * 15) + "s";
    particle.style.width = (2 + Math.random() * 2) + "px";
    particle.style.height = particle.style.width;
    particle.style.opacity = 0;
    const hueShift = Math.random() * 30 - 15;
    particle.style.filter = "hue-rotate(" + hueShift + "deg)";
    plagueParticles.appendChild(particle);
  }
}

function initStatBars() {
  const statFills = document.querySelectorAll(".stat-fill");
  statFills.forEach(function(fill) {
    const value = parseInt(fill.getAttribute("data-value"), 10);
    const percentage = (value / 5) * 100;
    fill.style.width = "0%";
    fill.dataset.targetWidth = percentage + "%";
  });
}

function animateStatBarsOnScroll() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll(".stat-fill");
        fills.forEach(function(fill, index) {
          setTimeout(function() {
            fill.style.width = fill.dataset.targetWidth;
          }, index * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(function(card) {
    observer.observe(card);
  });
}

function initAlignmentMarkers() {
  const markers = document.querySelectorAll(".alignment-marker");
  markers.forEach(function(marker) {
    const position = parseInt(marker.getAttribute("data-position"), 10);
    marker.style.left = position + "%";
  });
}

function staggerCardReveal() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const card = entry.target;
        const cardIndex = cards.indexOf(card);
        const delay = (cardIndex % 4) * 120;
        card.style.animationDelay = delay + "ms";
        card.classList.add("revealed");
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function(card) {
    observer.observe(card);
  });
}

function filterCards(filterValue) {
  cards.forEach(function(card) {
    const cardClass = card.getAttribute("data-class");
    if (filterValue === "all" || cardClass === filterValue) {
      card.classList.remove("hidden");
      card.style.animation = "none";
      card.offsetHeight;
      card.style.animation = "cardReveal 0.5s ease forwards";
    } else {
      card.classList.add("hidden");
    }
  });
}

function sortCards(sortKey) {
  const grid = characterGrid;
  const sorted = cards.slice().sort(function(a, b) {
    let valA, valB;
    if (sortKey === "name") {
      valA = a.getAttribute("data-name").toLowerCase();
      valB = b.getAttribute("data-name").toLowerCase();
      return valA.localeCompare(valB);
    } else {
      valA = parseInt(a.getAttribute("data-" + sortKey), 10);
      valB = parseInt(b.getAttribute("data-" + sortKey), 10);
      return valB - valA;
    }
  });

  sorted.forEach(function(card, index) {
    card.style.animation = "none";
    card.offsetHeight;
    card.style.animation = "cardReveal 0.4s ease forwards";
    card.style.animationDelay = (index * 60) + "ms";
    grid.appendChild(card);
  });
}

function initNavFilters() {
  const filterButtons = document.querySelectorAll(".nav-filter");
  filterButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      filterButtons.forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
      filterCards(btn.getAttribute("data-filter"));
    });
  });

  const sortButtons = document.querySelectorAll(".nav-sort");
  sortButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      sortButtons.forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
      sortCards(btn.getAttribute("data-sort"));
    });
  });
}

function openModal(cardElement) {
  const name = cardElement.querySelector(".card-name").textContent;
  const title = cardElement.querySelector(".card-title").textContent;
  const age = cardElement.querySelector(".card-age").textContent;
  const statusEl = cardElement.querySelector(".card-status");
  const statusHTML = statusEl ? statusEl.outerHTML : "";
  const flavor = cardElement.querySelector(".card-flavor").textContent;
  const portraitIcon = cardElement.querySelector(".portrait-icon").textContent;
  const portraitSigil = cardElement.querySelector(".portrait-name-sigil").textContent;

  const stats = cardElement.querySelectorAll(".stat-row");
  const skills = cardElement.querySelector(".skill-tags").innerHTML;
  const alignmentMarker = cardElement.querySelector(".alignment-marker");
  const alignmentPos = alignmentMarker ? alignmentMarker.getAttribute("data-position") : "50";
  const bonds = cardElement.querySelector(".bond-list").innerHTML;

  let statsHTML = "";
  stats.forEach(function(stat) {
    statsHTML += stat.outerHTML;
  });

  modalInner.innerHTML =
    '<div style="text-align:center; margin-bottom:24px;">' +
      '<div style="width:120px; height:160px; margin:0 auto 16px; background:linear-gradient(135deg, #0a0806, #1e1a15); border:1px solid #3a3228; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden;">' +
        '<span style="font-size:48px; opacity:0.15; position:absolute;">' + portraitIcon + '</span>' +
        '<span style="font-family:UnifrakturMaguntia,cursive; font-size:60px; color:#a89478; opacity:0.12; z-index:1;">' + portraitSigil + '</span>' +
      '</div>' +
      '<h2 class="card-name" style="font-size:30px;">' + name + '</h2>' +
      '<p class="card-title" style="font-size:15px; margin-bottom:8px;">' + title + '</p>' +
      '<div style="font-size:14px; color:#706050; margin-bottom:8px;">' + age + '</div>' +
      statusHTML +
    '</div>' +
    '<p class="card-flavor" style="font-size:16px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #2a2420;">' + flavor + '</p>' +
    '<div class="card-stats" style="gap:14px; margin-bottom:20px;">' + statsHTML + '</div>' +
    '<div class="card-skills" style="margin-bottom:18px;">' +
      '<h3 class="skills-heading">Survival Skills</h3>' +
      '<div class="skill-tags">' + skills + '</div>' +
    '</div>' +
    '<div class="card-alignment" style="margin-bottom:18px;">' +
      '<h3 class="alignment-heading">Moral Alignment</h3>' +
      '<div class="alignment-bar">' +
        '<span class="alignment-end holy">☀ Holy</span>' +
        '<div class="alignment-track"><div class="alignment-marker" data-position="' + alignmentPos + '"></div></div>' +
        '<span class="alignment-end damned">⛧ Damned</span>' +
      '</div>' +
    '</div>' +
    '<div class="card-bonds" style="padding-top:14px; border-top:1px solid #2a2420;">' +
      '<h3 class="bonds-heading"> Bonds</h3>' +
      '<div class="bond-list">' + bonds + '</div>' +
    '</div>';

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  setTimeout(function() {
    const modalStatFills = modalInner.querySelectorAll(".stat-fill");
    modalStatFills.forEach(function(fill, index) {
      const value = parseInt(fill.getAttribute("data-value"), 10);
      const percentage = (value / 5) * 100;
      fill.style.width = "0%";
      setTimeout(function() {
        fill.style.width = percentage + "%";
      }, 100 + index * 150);
    });

    const modalMarker = modalInner.querySelector(".alignment-marker");
    if (modalMarker) {
      modalMarker.style.left = "50%";
      setTimeout(function() {
        modalMarker.style.left = alignmentPos + "%";
      }, 300);
    }
  }, 50);
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function initCardModals() {
  cards.forEach(function(card) {
    card.addEventListener("click", function(e) {
      if (e.target.closest(".bond-tag")) return;
      openModal(card);
    });
  });

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

function initBondTagInteractions() {
  document.addEventListener("click", function(e) {
    const bondTag = e.target.closest(".bond-tag");
    if (!bondTag) return;

    e.stopPropagation();
    const bondTo = bondTag.getAttribute("data-bond-to");
    const targetCard = document.querySelector(
      '.character-card[data-name*="' + bondTo.replace(/-/g, " ") + '" i]'
    );

    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      targetCard.style.transition = "box-shadow 0.3s ease";
      const frame = targetCard.querySelector(".card-border-frame");
      if (frame) {
        frame.style.boxShadow = "0 0 30px rgba(196, 162, 74, 0.4), 0 0 60px rgba(196, 162, 74, 0.15)";
        frame.style.borderColor = "#c4a24a";
        setTimeout(function() {
          frame.style.boxShadow = "";
          frame.style.borderColor = "";
        }, 2000);
      }
    }
  });
}

function getCardKey(cardEl) {
  const name = cardEl.getAttribute("data-name").toLowerCase();
  const keys = Object.keys(CHARACTER_DATA);
  for (let i = 0; i < keys.length; i++) {
    if (name.indexOf(keys[i].replace(/-/g, " ")) !== -1) {
      return keys[i];
    }
  }
  return null;
}

function buildBondsWeb() {
  bondsChart.innerHTML = "";

  const chartRect = bondsChart.getBoundingClientRect();
  const chartW = bondsChart.offsetWidth;
  const chartH = bondsChart.offsetHeight;
  const centerX = chartW / 2;
  const centerY = chartH / 2;
  const radius = Math.min(chartW, chartH) * 0.35;

  const nodeKeys = Object.keys(CHARACTER_DATA);
  const nodePositions = {};

  nodeKeys.forEach(function(key, i) {
    const angle = (i / nodeKeys.length) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    nodePositions[key] = { x: x, y: y };
  });

  const bondConnections = [
    { from: "sister-agata", to: "father-dietrich", type: "ally" },
    { from: "sister-agata", to: "hildegard", type: "rival" },
    { from: "father-dietrich", to: "hildegard", type: "rival" },
    { from: "viktor", to: "lukas", type: "ally" },
    { from: "viktor", to: "sir-reinhold", type: "rival" },
    { from: "elena", to: "maren", type: "ally" },
    { from: "elena", to: "otto", type: "kin" },
    { from: "sir-reinhold", to: "konrad", type: "ally" },
    { from: "maren", to: "greta", type: "kin" },
    { from: "otto", to: "sir-reinhold", type: "ally" },
    { from: "ida", to: "greta", type: "ally" },
    { from: "ida", to: "konrad", type: "rival" },
    { from: "konrad", to: "sir-reinhold", type: "ally" },
    { from: "lukas", to: "greta", type: "kin" },
    { from: "tomasz", to: "otto", type: "ally" },
    { from: "tomasz", to: "maren", type: "ally" }
  ];

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", chartW);
  svg.setAttribute("height", chartH);
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  bondsChart.appendChild(svg);

  bondConnections.forEach(function(conn) {
    const from = nodePositions[conn.from];
    const to = nodePositions[conn.to];
    if (!from || !to) return;

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y);

    if (conn.type === "ally") {
      line.setAttribute("stroke", "#8a9ab0");
      line.setAttribute("stroke-width", "1.5");
      line.setAttribute("opacity", "0.35");
    } else if (conn.type === "kin") {
      line.setAttribute("stroke", "#c4a060");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("opacity", "0.4");
    } else {
      line.setAttribute("stroke", "#b04040");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("opacity", "0.25");
      line.setAttribute("stroke-dasharray", "6 4");
    }

    svg.appendChild(line);
  });

  nodeKeys.forEach(function(key) {
    const data = CHARACTER_DATA[key];
    const pos = nodePositions[key];

    const node = document.createElement("div");
    node.classList.add("bond-node");
    if (data.status === "infected" || data.status === "marked") {
      node.classList.add("infected");
    }
    node.textContent = data.initial;
    node.style.left = (pos.x - 22) + "px";
    node.style.top = (pos.y - 22) + "px";
    node.setAttribute("title", data.name);
    node.setAttribute("data-character-key", key);

    node.addEventListener("mouseenter", function() {
      highlightBonds(key, nodePositions, svg);
    });
    node.addEventListener("mouseleave", function() {
      resetBonds(svg);
    });
    node.addEventListener("click", function() {
      const cardName = data.name;
      const targetCard = document.querySelector(
        '.character-card[data-name*="' + cardName + '"]'
      );
      if (targetCard) {
        closeModal();
        setTimeout(function() {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
          const frame = targetCard.querySelector(".card-border-frame");
          if (frame) {
            frame.style.boxShadow = "0 0 30px rgba(196, 162, 74, 0.4)";
            frame.style.borderColor = "#c4a24a";
            setTimeout(function() {
              frame.style.boxShadow = "";
              frame.style.borderColor = "";
            }, 2000);
          }
        }, 100);
      }
    });

    bondsChart.appendChild(node);

    const label = document.createElement("div");
    label.style.position = "absolute";
    label.style.left = pos.x + "px";
    label.style.top = (pos.y + 28) + "px";
    label.style.transform = "translateX(-50%)";
    label.style.fontFamily = "MedievalSharp, cursive";
    label.style.fontSize = "10px";
    label.style.color = "#706050";
    label.style.whiteSpace = "nowrap";
    label.style.letterSpacing = "0.5px";
    label.textContent = data.name;
    bondsChart.appendChild(label);
  });
}

function highlightBonds(activeKey, nodePositions, svg) {
  const lines = svg.querySelectorAll("line");
  lines.forEach(function(line) {
    line.setAttribute("opacity", "0.08");
    line.setAttribute("stroke-width", "0.5");
  });

  const bondConnections = [
    { from: "sister-agata", to: "father-dietrich", type: "ally" },
    { from: "sister-agata", to: "hildegard", type: "rival" },
    { from: "father-dietrich", to: "hildegard", type: "rival" },
    { from: "viktor", to: "lukas", type: "ally" },
    { from: "viktor", to: "sir-reinhold", type: "rival" },
    { from: "elena", to: "maren", type: "ally" },
    { from: "elena", to: "otto", type: "kin" },
    { from: "sir-reinhold", to: "konrad", type: "ally" },
    { from: "maren", to: "greta", type: "kin" },
    { from: "otto", to: "sir-reinhold", type: "ally" },
    { from: "ida", to: "greta", type: "ally" },
    { from: "ida", to: "konrad", type: "rival" },
    { from: "konrad", to: "sir-reinhold", type: "ally" },
    { from: "lukas", to: "greta", type: "kin" },
    { from: "tomasz", to: "otto", type: "ally" },
    { from: "tomasz", to: "maren", type: "ally" }
  ];

  let lineIndex = 0;
  bondConnections.forEach(function(conn, i) {
    if (conn.from === activeKey || conn.to === activeKey) {
      const line = lines[i];
      if (line) {
        if (conn.type === "ally") {
          line.setAttribute("stroke", "#8a9ab0");
          line.setAttribute("opacity", "0.8");
          line.setAttribute("stroke-width", "2.5");
        } else if (conn.type === "kin") {
          line.setAttribute("stroke", "#c4a060");
          line.setAttribute("opacity", "0.9");
          line.setAttribute("stroke-width", "3");
        } else {
          line.setAttribute("stroke", "#b04040");
          line.setAttribute("opacity", "0.7");
          line.setAttribute("stroke-width", "2");
          line.setAttribute("stroke-dasharray", "6 4");
        }
      }
    }
    lineIndex++;
  });

  const nodes = bondsChart.querySelectorAll(".bond-node");
  nodes.forEach(function(node) {
    const key = node.getAttribute("data-character-key");
    if (key !== activeKey) {
      const isConnected = bondConnections.some(function(conn) {
        return (conn.from === activeKey && conn.to === key) ||
               (conn.to === activeKey && conn.from === key);
      });
      if (!isConnected) {
        node.style.opacity = "0.25";
      } else {
        node.style.opacity = "1";
        node.style.transform = "scale(1.15)";
      }
    }
  });
}

function resetBonds(svg) {
  const lines = svg.querySelectorAll("line");
  const bondConnections = [
    { type: "ally" }, { type: "rival" }, { type: "rival" },
    { type: "ally" }, { type: "rival" }, { type: "ally" },
    { type: "kin" }, { type: "ally" }, { type: "kin" },
    { type: "ally" }, { type: "ally" }, { type: "rival" },
    { type: "ally" }, { type: "kin" }, { type: "ally" },
    { type: "ally" }
  ];

  lines.forEach(function(line, i) {
    const conn = bondConnections[i];
    if (!conn) return;
    if (conn.type === "ally") {
      line.setAttribute("stroke", "#8a9ab0");
      line.setAttribute("stroke-width", "1.5");
      line.setAttribute("opacity", "0.35");
      line.removeAttribute("stroke-dasharray");
    } else if (conn.type === "kin") {
      line.setAttribute("stroke", "#c4a060");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("opacity", "0.4");
      line.removeAttribute("stroke-dasharray");
    } else {
      line.setAttribute("stroke", "#b04040");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("opacity", "0.25");
      line.setAttribute("stroke-dasharray", "6 4");
    }
  });

  const nodes = bondsChart.querySelectorAll(".bond-node");
  nodes.forEach(function(node) {
    node.style.opacity = "1";
    node.style.transform = "";
  });
}

function animateChronicleNumbers() {
  const numbers = document.querySelectorAll(".chronicle-number");
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.textContent, 10);
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 20));
        const interval = setInterval(function() {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current;
        }, 60);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(function(num) {
    observer.observe(num);
  });
}

function initCandleFlicker() {
  const overlay = document.getElementById("candleOverlay");
  let mouseX = 50;
  let mouseY = 0;

  document.addEventListener("mousemove", function(e) {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
  });

  function updateCandleGlow() {
    overlay.style.background = "radial-gradient(ellipse at " + mouseX + "% " + mouseY + "%, rgba(196, 162, 74, 0.03) 0%, transparent 50%)";
    requestAnimationFrame(updateCandleGlow);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    updateCandleGlow();
  }
}

function initKeyboardNav() {
  document.addEventListener("keydown", function(e) {
    if (e.key === "/" && !modal.classList.contains("active")) {
      e.preventDefault();
      const firstFilter = document.querySelector(".nav-filter");
      if (firstFilter) firstFilter.focus();
    }
  });
}

function handleResize() {
  let resizeTimer;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      buildBondsWeb();
    }, 250);
  });
}

function init() {
  createPlagueParticles();
  initStatBars();
  initAlignmentMarkers();
  staggerCardReveal();
  animateStatBarsOnScroll();
  initNavFilters();
  initCardModals();
  initBondTagInteractions();
  animateChronicleNumbers();
  initCandleFlicker();
  initKeyboardNav();
  handleResize();

  setTimeout(function() {
    buildBondsWeb();
  }, 100);
}

document.addEventListener("DOMContentLoaded", init);