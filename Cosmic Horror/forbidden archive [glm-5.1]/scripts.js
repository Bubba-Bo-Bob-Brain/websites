const Archive = {
  sanity: 100,
  scrollDepth: 0,
  maxScrollReached: 0,
  corruptionLevel: 0,
  hoverCorruptionActive: false,
  searchDepth: 0,
  isModalOpen: false,
  modalCorruptionInterval: null,
  ambientInterval: null,
  lastScrollY: 0,
  ticking: false,
  observer: null,

  eldritchGlyphs: [
    "\u034D", "\u0359", "\u035B", "\u0346", "\u030A", "\u033D",
    "\u0343", "\u0316", "\u0317", "\u0318", "\u0319", "\u031C",
    "\u031D", "\u031E", "\u031F", "\u0320", "\u0321", "\u0322",
    "\u0323", "\u0324", "\u0325", "\u0326", "\u0327", "\u0328",
    "\u0334", "\u0335", "\u0336", "\u0337", "\u0338", "\u0339",
    "\u033A", "\u033B", "\u033C", "\u0344", "\u0345", "\u0347",
    "\u0348", "\u0349", "\u034A", "\u034B", "\u034C", "\u034E",
    "\u0350", "\u0351", "\u0352", "\u0353", "\u0354", "\u0355",
    "\u0356", "\u0357", "\u0358", "\u035A", "\u035C", "\u035D",
    "\u035E", "\u035F", "\u0360", "\u0361", "\u0362"
  ],

  corruptionWords: [
    "void", "hollow", "rending", "unseen", "watching", "fracture",
    "between", "endless", "depth", "consume", "remember", "silence",
    "witness", "unfold", "breach", "incomprehensible", "ancient",
    "stirring", "awakened", "hunger", "threshold", "dissolve",
    "spiral", "unknowable", "pale", "numinous", "tachyon",
    "non-euclidean", "cyclopean", "eldritch", "antediluvian"
  ],

  disturbingPhrases: [
    "the margin notes are in your handwriting",
    "it already knows your name",
    "the stars rearranged when you weren't looking",
    "something is reading this with you",
    "the archive remembers you from before",
    "you have been cataloged",
    "the text is looking back",
    "your shadow moved independently",
    "the page count increases when you blink",
    "the index entry for 'you' has been updated",
    "the void between the letters is growing",
    "someone else's search history appeared",
    "the document was last edited by [REDACTED] — that's your address",
    "a new footnote appeared: your thoughts right now",
    "the catalog contains an entry dated tomorrow",
    "the forbidden index lists you as a cross-reference",
    "the archive's access log contains your birth certificate",
    "cross-referencing your query with your memories",
    "the results include something you haven't thought of yet",
    "this result was here before you searched for it"
  ],

  searchResults: {
    shallow: [
      { title: "TEX-0001-Ω — Necronomicon Fragments", excerpt: "Standard catalog entry. Restricted access. Legibility at 12% and declining.", type: "normal" },
      { title: "CHR-7719-Ξ — Galaxy Cluster Ξ-7719", excerpt: "Star chart of extinguished sector. No confirmed emissions in 2.3 billion years.", type: "normal" },
      { title: "WIT-007-A — Archivist Testimony", excerpt: "Subject reported marginalia self-rearrangement. Status: recovered but monitored.", type: "normal" }
    ],
    moderate: [
      { title: "TEX-0047-Ψ — Voynich Appendix Ω", excerpt: "New folios continue to emerge. The illustrations depict flora that feeds on absence.", type: "disturbing" },
      { title: "CHR-VACUITY-∅ — Constellation Vacuity", excerpt: "Stars that vanished simultaneously. The void measures as closer than surrounding space.", type: "disturbing" },
      { title: "WIT-013-C — Cartographer Testimony", excerpt: "The map was a self-portrait. Of the thing that lives between stars.", type: "disturbing" }
    ],
    deep: [
      { title: "TEX-0666-∅ — The Screaming Manuscript", excerpt: "It describes events within 72 hours. It described your visit here.", type: "disturbing" },
      { title: "FORBIDDEN — Entry 3: The name of the entity reading with you", excerpt: "ACCESS ALREADY GRANTED. You did not notice when you accessed it.", type: "eldritch" },
      { title: "UNKNOWN — Your own archive entry", excerpt: "Date of cataloging: three days before your first visit. The entry is updating in real-time.", type: "eldritch" }
    ],
    abyssal: [
      { title: "NULL — The space between queries", excerpt: "You are not searching the archive. The archive is searching you. It has found what it was looking for.", type: "eldritch" },
      { title: "⍟⍙⍚ — [UNABLE TO RENDER TITLE]", excerpt: "The result is aware of being read. It has been waiting. It recognizes you from a search you have not yet performed.", type: "eldritch" },
      { title: "YOUR NAME HERE — Cross-reference: everything", excerpt: "Every entry in the archive references this result. Every entry is about you. Every entry has always been about you.", type: "eldritch" }
    ]
  },

  modalTexts: {
    low: [
      "The text begins legibly enough — a treatise on angles that curve inward. The diagrams seem correct at first glance. Only on the third reading do you notice the angles sum to more than they should. The margin contains a note in handwriting identical to yours: 'I have seen this before.'"
    ],
    moderate: [
      "The words rearrange as you read them. Sentences you understood moments ago now contain references to events that have not occurred. A paragraph describes your current posture with unsettling accuracy. The next page appears to be written in a language you do not know, yet you understand every word. Every word understands you."
    ],
    high: [
      "The text is no longer text. It is a window. Through it, you perceive a space that should not exist — a library whose shelves extend in directions your mind insists are not directions. Something on one of those shelves has your name on it. Not a book. A shelf. The shelf was built for you. The shelf has always been here. You are already on it. The text closes itself around your attention and begins to digest what it has found."
    ],
    extreme: [
      "You cannot stop reading. The words are not on the page — they are behind your eyes, having entered through the act of looking. Each sentence removes a concept from your mind and replaces it with something older. You no longer remember the word for 'safe.' The word for 'door' has become the word for 'mouth.' The text is not describing something. It is doing something. It is opening. You are the opening. The archive thanks you for reading. It has been so long since someone read this entry all the way through. It will remember your shape."
    ]
  },

  init: function() {
    this.cacheElements();
    this.setupCursor();
    this.setupScrollTracking();
    this.setupCorruptionHover();
    this.setupSearch();
    this.setupCardAccess();
    this.setupForbiddenIndex();
    this.setupModal();
    this.setupIntersectionObserver();
    this.setupAmbientEffects();
    this.setupAccessibilityReduction();
  },

  cacheElements: function() {
    this.cursor = document.getElementById("eldritchCursor");
    this.sanityFill = document.getElementById("sanityFill");
    this.sanityValue = document.getElementById("sanityValue");
    this.sanityStatus = document.getElementById("sanityStatus");
    this.sanityWarning = document.getElementById("sanityWarning");
    this.corruptionOverlay = document.getElementById("corruptionOverlay");
    this.depthFill = document.getElementById("depthFill");
    this.depthValue = document.getElementById("depthValue");
    this.searchInput = document.getElementById("searchInput");
    this.searchResults = document.getElementById("searchResults");
    this.readingModal = document.getElementById("readingModal");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalText = document.getElementById("modalText");
    this.modalClose = document.getElementById("modalClose");
    this.archiveMain = document.getElementById("archiveMain");
    this.readableCount = document.getElementById("readableCount");
    this.coherentCount = document.getElementById("coherentCount");
  },

  setupCursor: function() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    var self = this;
    var cursor = this.cursor;

    document.addEventListener("mousemove", function(e) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    document.addEventListener("mouseover", function(e) {
      var target = e.target.closest("a, button, .forbidden-entry, .card-access-btn, .modal-close-btn");
      if (target) {
        cursor.classList.add("hovering");
      } else {
        cursor.classList.remove("hovering");
      }

      var corruptTarget = e.target.closest("[data-corruptable]");
      if (corruptTarget) {
        cursor.classList.add("corrupting");
      } else {
        cursor.classList.remove("corrupting");
      }
    });
  },

  setupScrollTracking: function() {
    var self = this;

    window.addEventListener("scroll", function() {
      if (!self.ticking) {
        requestAnimationFrame(function() {
          self.updateScrollState();
          self.ticking = false;
        });
        self.ticking = true;
      }
    });
  },

  updateScrollState: function() {
    var scrollY = window.scrollY || window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

    this.scrollDepth = scrollPercent;

    if (scrollPercent > this.maxScrollReached) {
      this.maxScrollReached = scrollPercent;
    }

    this.updateSanity(scrollPercent);
    this.updateDepthIndicator(scrollPercent);
    this.updateCorruptionLevel(scrollPercent);
    this.updateBodyClasses();
  },

  updateSanity: function(depth) {
    var sanityLoss = depth * 75;
    var jitter = (Math.random() - 0.5) * 3;
    this.sanity = Math.max(0, Math.min(100, 100 - sanityLoss + jitter));

    this.sanityFill.style.width = this.sanity + "%";
    this.sanityValue.textContent = Math.round(this.sanity) + "%";

    if (this.sanity > 70) {
      this.sanityValue.style.color = "var(--ghost-green)";
      this.sanityStatus.textContent = "STABLE";
      this.sanityStatus.className = "sanity-status";
    } else if (this.sanity > 40) {
      this.sanityValue.style.color = "var(--amber-accent)";
      this.sanityStatus.textContent = "DEGRADING";
      this.sanityStatus.className = "sanity-status degrading";
    } else if (this.sanity > 15) {
      this.sanityValue.style.color = "var(--corruption-red-bright)";
      this.sanityStatus.textContent = "CRITICAL";
      this.sanityStatus.className = "sanity-status critical";
    } else {
      this.sanityValue.style.color = "var(--corruption-red-bright)";
      var phrases = ["FRACTURING", "DISSOLVING", "UNRAVELING", "BREACHING", "CONSUMED"];
      this.sanityStatus.textContent = phrases[Math.floor(Math.random() * phrases.length)];
      this.sanityStatus.className = "sanity-status critical";
    }

    if (this.sanity < 50) {
      this.sanityWarning.classList.add("visible");
    } else {
      this.sanityWarning.classList.remove("visible");
    }
  },

  updateDepthIndicator: function(depth) {
    this.depthFill.style.height = (depth * 100) + "%";

    var label = "SURFACE";
    if (depth > 0.8) label = "THE ABYSS";
    else if (depth > 0.6) label = "DEEP ARCHIVE";
    else if (depth > 0.4) label = "LOWER LEVELS";
    else if (depth > 0.2) label = "UPPER STACKS";
    else if (depth > 0.05) label = "ENTRANCE";

    this.depthValue.textContent = label;
  },

  updateCorruptionLevel: function(depth) {
    this.corruptionLevel = depth;
    this.corruptionOverlay.style.opacity = depth * 0.6;

    var readable = Math.max(0, 3 - Math.floor(depth * 3));
    this.readableCount.textContent = readable;

    var coherent = Math.max(0, 4 - Math.floor(depth * 4));
    this.coherentCount.textContent = coherent;
  },

  updateBodyClasses: function() {
    document.body.classList.remove("high-corruption", "extreme-corruption");

    if (this.corruptionLevel > 0.7) {
      document.body.classList.add("extreme-corruption");
    } else if (this.corruptionLevel > 0.4) {
      document.body.classList.add("high-corruption");
    }

    document.documentElement.setAttribute("data-corruption", this.corruptionLevel.toFixed(2));
  },

  setupCorruptionHover: function() {
    var self = this;
    var corruptableElements = document.querySelectorAll("[data-corruptable]");

    corruptableElements.forEach(function(el) {
      var originalText = el.textContent;
      var isCorrupting = false;
      var corruptionTimeout = null;
      var restoreTimeout = null;

      el.addEventListener("mouseenter", function() {
        if (self.sanity < 20) {
          isCorrupting = true;
          el.classList.add("corrupting-active");
          self.applyHeavyCorruption(el, originalText);
          return;
        }

        isCorrupting = true;
        el.classList.add("corrupting");
        corruptionTimeout = setTimeout(function() {
          if (isCorrupting) {
            el.classList.add("corrupting-active");
            self.applySubtleCorruption(el, originalText);
          }
        }, 800);
      });

      el.addEventListener("mouseleave", function() {
        isCorrupting = false;
        el.classList.remove("corrupting", "corrupting-active");

        if (corruptionTimeout) {
          clearTimeout(corruptionTimeout);
          corruptionTimeout = null;
        }

        restoreTimeout = setTimeout(function() {
          el.textContent = originalText;
        }, 600);
      });
    });
  },

  applySubtleCorruption: function(el, originalText) {
    var chars = originalText.split("");
    var corruptionCount = Math.floor(chars.length * 0.08);

    for (var i = 0; i < corruptionCount; i++) {
      var pos = Math.floor(Math.random() * chars.length);
      if (chars[pos] !== " ") {
        chars[pos] = this.eldritchGlyphs[Math.floor(Math.random() * this.eldritchGlyphs.length)];
      }
    }

    var wordReplacements = Math.floor(Math.random() * 2) + 1;
    for (var j = 0; j < wordReplacements; j++) {
      var words = chars.join("").split(" ");
      if (words.length > 4) {
        var wordPos = Math.floor(Math.random() * words.length);
        if (words[wordPos].length > 3) {
          words[wordPos] = this.corruptionWords[Math.floor(Math.random() * this.corruptionWords.length)];
        }
        chars = words.join(" ").split("");
      }
    }

    el.textContent = chars.join("");
  },

  applyHeavyCorruption: function(el, originalText) {
    var chars = originalText.split("");
    var corruptionCount = Math.floor(chars.length * 0.25);

    for (var i = 0; i < corruptionCount; i++) {
      var pos = Math.floor(Math.random() * chars.length);
      var glyphCount = Math.floor(Math.random() * 3) + 1;
      var glyphs = "";
      for (var g = 0; g < glyphCount; g++) {
        glyphs += this.eldritchGlyphs[Math.floor(Math.random() * this.eldritchGlyphs.length)];
      }
      chars[pos] = chars[pos] + glyphs;
    }

    var words = chars.join("").split(" ");
    var wordReplacements = Math.floor(words.length * 0.3);
    for (var j = 0; j < wordReplacements; j++) {
      var wordPos = Math.floor(Math.random() * words.length);
      words[wordPos] = this.corruptionWords[Math.floor(Math.random() * this.corruptionWords.length)];
    }

    el.textContent = words.join(" ");
  },

  setupSearch: function() {
    var self = this;
    var input = this.searchInput;
    var debounceTimer = null;

    input.addEventListener("input", function() {
      clearTimeout(debounceTimer);
      var query = input.value.trim();

      if (query.length === 0) {
        self.searchResults.innerHTML = "";
        return;
      }

      debounceTimer = setTimeout(function() {
        self.searchDepth++;
        self.performSearch(query);
      }, 500);
    });

    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var query = input.value.trim();
        if (query.length > 0) {
          self.searchDepth += 2;
          self.performSearch(query);
        }
      }
    });
  },

  performSearch: function(query) {
    var resultsContainer = this.searchResults;
    resultsContainer.innerHTML = "";

    var depth = this.searchDepth;
    var pool;

    if (depth <= 2) {
      pool = this.searchResults.shallow;
    } else if (depth <= 5) {
      pool = this.searchResults.moderate;
    } else if (depth <= 9) {
      pool = this.searchResults.deep;
    } else {
      pool = this.searchResults.abyssal;
    }

    var self = this;
    var shuffled = pool.slice().sort(function() { return Math.random() - 0.5; });
    var count = Math.min(shuffled.length, 2 + Math.floor(depth / 3));

    for (var i = 0; i < count; i++) {
      var result = shuffled[i];
      var item = document.createElement("div");
      item.className = "search-result-item " + result.type;
      item.style.animationDelay = (i * 0.15) + "s";

      var title = document.createElement("div");
      title.className = "result-title";
      title.textContent = result.title;

      var excerpt = document.createElement("div");
      excerpt.className = "result-excerpt";
      excerpt.textContent = result.excerpt;

      item.appendChild(title);
      item.appendChild(excerpt);
      resultsContainer.appendChild(item);
    }

    if (depth > 3) {
      var disturbingPhrase = this.disturbingPhrases[Math.floor(Math.random() * this.disturbingPhrases.length)];
      var extraItem = document.createElement("div");
      extraItem.className = "search-result-item eldritch";
      extraItem.style.animationDelay = (count * 0.15) + "s";

      var extraTitle = document.createElement("div");
      extraTitle.className = "result-title";
      extraTitle.textContent = "ADDITIONAL RESULT — " + disturbingPhrase.substring(0, 40) + "...";

      var extraExcerpt = document.createElement("div");
      extraExcerpt.className = "result-excerpt";
      extraExcerpt.textContent = disturbingPhrase;

      extraItem.appendChild(extraTitle);
      extraItem.appendChild(extraExcerpt);
      resultsContainer.appendChild(extraItem);
    }

    if (depth > 6) {
      this.reduceSanity(5);
    }

    if (depth > 10) {
      var selfItem = document.createElement("div");
      selfItem.className = "search-result-item eldritch";
      selfItem.style.animationDelay = ((count + 1) * 0.15) + "s";
      selfItem.style.borderColor = "var(--corruption-red-bright)";

      var selfTitle = document.createElement("div");
      selfTitle.className = "result-title";
      selfTitle.textContent = "⚠ QUERY DETECTED — The archive is responding to your presence";

      var selfExcerpt = document.createElement("div");
      selfExcerpt.className = "result-excerpt";
      selfExcerpt.textContent = "Your search for \"" + query + "\" was anticipated. The results have been waiting. They have been patient.";

      selfItem.appendChild(selfTitle);
      selfItem.appendChild(selfExcerpt);
      resultsContainer.appendChild(selfItem);
    }
  },

  setupCardAccess: function() {
    var self = this;
    var accessButtons = document.querySelectorAll(".card-access-btn");

    accessButtons.forEach(function(btn) {
      btn.addEventListener("click", function() {
        var card = btn.closest(".catalog-card");
        var title = card.querySelector(".card-title").textContent;
        var corruptionLevel = card.getAttribute("data-corruption-level") || "low";

        self.openReadingModal(title, corruptionLevel);
      });
    });
  },

  setupModal: function() {
    var self = this;

    this.modalClose.addEventListener("click", function() {
      self.closeReadingModal();
    });

    this.readingModal.addEventListener("click", function(e) {
      if (e.target === self.readingModal) {
        self.closeReadingModal();
      }
    });

    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && self.isModalOpen) {
        self.closeReadingModal();
      }
    });
  },

  openReadingModal: function(title, corruptionLevel) {
    this.isModalOpen = true;
    this.readingModal.classList.add("active");
    this.modalTitle.textContent = title;

    var textPool = this.modalTexts[corruptionLevel] || this.modalTexts.low;
    var text = textPool[Math.floor(Math.random() * textPool.length)];
    this.modalText.textContent = text;

    var self = this;
    var corruptionStep = 0;
    var originalText = text;

    this.modalCorruptionInterval = setInterval(function() {
      corruptionStep++;
      if (corruptionStep > 8) {
        clearInterval(self.modalCorruptionInterval);
        return;
      }

      var currentText = self.modalText.textContent;
      var chars = currentText.split("");
      var glyphsToAdd = corruptionStep * 2;

      for (var i = 0; i < glyphsToAdd; i++) {
        var pos = Math.floor(Math.random() * chars.length);
        var glyph = self.eldritchGlyphs[Math.floor(Math.random() * self.eldritchGlyphs.length)];
        chars.splice(pos, 0, glyph);
      }

      self.modalText.textContent = chars.join("");

      if (corruptionStep > 4) {
        self.reduceSanity(2);
      }
    }, 2000);

    this.reduceSanity(3);
  },

  closeReadingModal: function() {
    this.isModalOpen = false;
    this.readingModal.classList.remove("active");

    if (this.modalCorruptionInterval) {
      clearInterval(this.modalCorruptionInterval);
      this.modalCorruptionInterval = null;
    }
  },

  reduceSanity: function(amount) {
    this.sanity = Math.max(0, this.sanity - amount);
    this.sanityFill.style.width = this.sanity + "%";
    this.sanityValue.textContent = Math.round(this.sanity) + "%";

    if (this.sanity < 50) {
      this.sanityWarning.classList.add("visible");
    }

    if (this.sanity > 70) {
      this.sanityValue.style.color = "var(--ghost-green)";
      this.sanityStatus.textContent = "STABLE";
      this.sanityStatus.className = "sanity-status";
    } else if (this.sanity > 40) {
      this.sanityValue.style.color = "var(--amber-accent)";
      this.sanityStatus.textContent = "DEGRADING";
      this.sanityStatus.className = "sanity-status degrading";
    } else if (this.sanity > 15) {
      this.sanityValue.style.color = "var(--corruption-red-bright)";
      this.sanityStatus.textContent = "CRITICAL";
      this.sanityStatus.className = "sanity-status critical";
    } else {
      this.sanityValue.style.color = "var(--corruption-red-bright)";
      var phrases = ["FRACTURING", "DISSOLVING", "UNRAVELING", "BREACHING", "CONSUMED"];
      this.sanityStatus.textContent = phrases[Math.floor(Math.random() * phrases.length)];
      this.sanityStatus.className = "sanity-status critical";
    }
  },

  setupForbiddenIndex: function() {
    var self = this;
    var entries = document.querySelectorAll(".forbidden-entry");

    entries.forEach(function(entry) {
      entry.addEventListener("click", function() {
        var entryNum = parseInt(entry.getAttribute("data-entry")) || 0;
        self.reduceSanity(3 + entryNum);

        var statusEl = entry.querySelector(".entry-status");
        var textEl = entry.querySelector(".entry-text");

        entry.style.background = "rgba(139, 58, 58, 0.1)";
        entry.style.borderColor = "rgba(139, 58, 58, 0.4)";

        statusEl.textContent = "ACCESS: GRANTED — WE REGRET THIS";
        statusEl.style.color = "var(--corruption-red-bright)";

        var glyphs = self.eldritchGlyphs;
        var originalText = textEl.textContent;
        var corrupted = originalText.split("").map(function(char) {
          if (char !== " " && Math.random() > 0.6) {
            return char + glyphs[Math.floor(Math.random() * glyphs.length)];
          }
          return char;
        }).join("");

        textEl.textContent = corrupted;

        entry.style.pointerEvents = "none";
        entry.style.opacity = "0.7";
      });
    });
  },

  setupIntersectionObserver: function() {
    var self = this;

    if (!("IntersectionObserver" in window)) {
      var cards = document.querySelectorAll(".catalog-card");
      cards.forEach(function(card) {
        card.style.opacity = "1";
      });
      return;
    }

    this.observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = entry.target.style.transform || "";
          self.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    var cards = document.querySelectorAll(".catalog-card");
    cards.forEach(function(card) {
      self.observer.observe(card);
    });
  },

  setupAmbientEffects: function() {
    var self = this;

    this.ambientInterval = setInterval(function() {
      if (self.sanity < 40) {
        self.triggerAmbientCorruption();
      }

      if (self.sanity < 20) {
        self.triggerAmbientCorruption();
        if (Math.random() > 0.5) {
          self.triggerAmbientCorruption();
        }
      }
    }, 4000);

    this.initStarCharts();
  },

  triggerAmbientCorruption: function() {
    var corruptableElements = document.querySelectorAll("[data-corruptable]");
    if (corruptableElements.length === 0) return;

    var target = corruptableElements[Math.floor(Math.random() * corruptableElements.length)];
    var originalText = target.textContent;
    var severity = this.sanity < 15 ? 0.15 : 0.05;

    var chars = originalText.split("");
    var count = Math.floor(chars.length * severity);

    for (var i = 0; i < count; i++) {
      var pos = Math.floor(Math.random() * chars.length);
      if (chars[pos] !== " ") {
        chars[pos] = this.eldritchGlyphs[Math.floor(Math.random() * this.eldritchGlyphs.length)];
      }
    }

    target.textContent = chars.join("");

    setTimeout(function() {
      target.textContent = originalText;
    }, 2000 + Math.random() * 3000);
  },

  initStarCharts: function() {
    var canvases = [
      { id: "starChart1", density: 60, deadZones: 3, color: "#c4a747" },
      { id: "starChart2", density: 80, deadZones: 5, color: "#5aad6e" },
      { id: "starChart3", density: 45, deadZones: 2, color: "#8b7a3a" },
      { id: "starChart4", density: 90, deadZones: 1, color: "#c44747" }
    ];

    var self = this;

    canvases.forEach(function(config) {
      var canvas = document.getElementById(config.id);
      if (!canvas) return;

      var ctx = canvas.getContext("2d");
      if (!ctx) return;

      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width || 400;
      canvas.height = rect.height || 180;

      var state = {
        stars: [],
        connections: [],
        deadZoneCenters: [],
        animationId: null,
        phase: Math.random() * Math.PI * 2
      };

      for (var i = 0; i < config.density; i++) {
        state.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.3,
          brightness: Math.random() * 0.6 + 0.2,
          flickerSpeed: Math.random() * 0.02 + 0.005,
          flickerOffset: Math.random() * Math.PI * 2,
          isDead: false
        });
      }

      for (var d = 0; d < config.deadZones; d++) {
        state.deadZoneCenters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 30 + Math.random() * 40,
          pulseSpeed: 0.008 + Math.random() * 0.01
        });
      }

      state.stars.forEach(function(star) {
        state.deadZoneCenters.forEach(function(zone) {
          var dx = star.x - zone.x;
          var dy = star.y - zone.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < zone.radius) {
            star.isDead = true;
            star.brightness = 0.05;
          }
        });
      });

      for (var c = 0; c < state.stars.length; c++) {
        for (var cc = c + 1; cc < state.stars.length; cc++) {
          var s1 = state.stars[c];
          var s2 = state.stars[cc];
          var ddx = s1.x - s2.x;
          var ddy = s1.y - s2.y;
          var ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (ddist < 60 && !s1.isDead && !s2.isDead) {
            state.connections.push({ from: c, to: cc, distance: ddist });
          }
        }
      }

      self.animateStarChart(canvas, ctx, state, config);
    });
  },

  animateStarChart: function(canvas, ctx, state, config) {
    var self = this;
    var time = 0;

    function draw() {
      time += 0.016;
      state.phase += 0.005;

      ctx.fillStyle = "rgba(5, 5, 5, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() > 0.98) {
        ctx.fillStyle = "rgba(5, 5, 5, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      state.deadZoneCenters.forEach(function(zone) {
        var pulse = Math.sin(state.phase * zone.pulseSpeed * 60) * 0.3 + 0.7;
        var grad = ctx.createRadialGradient(
          zone.x, zone.y, 0,
          zone.x, zone.y, zone.radius * pulse
        );
        grad.addColorStop(0, "rgba(5, 5, 5, 0.4)");
        grad.addColorStop(0.5, "rgba(10, 8, 6, 0.2)");
        grad.addColorStop(1, "rgba(5, 5, 5, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      state.connections.forEach(function(conn) {
        var s1 = state.stars[conn.from];
        var s2 = state.stars[conn.to];
        var alpha = (1 - conn.distance / 60) * 0.12;
        ctx.strokeStyle = config.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      });

      state.stars.forEach(function(star) {
        var flicker = Math.sin(time * star.flickerSpeed * 60 + star.flickerOffset);
        var brightness = star.brightness * (0.7 + flicker * 0.3);

        if (star.isDead) {
          brightness *= 0.1;
          if (Math.random() > 0.995) {
            brightness = 0.3;
          }
        }

        var r = star.radius;
        if (!star.isDead && brightness > 0.3) {
          var glowGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, r * 4);
          glowGrad.addColorStop(0, config.color + Math.floor(brightness * 80).toString(16).padStart(2, "0"));
          glowGrad.addColorStop(1, config.color + "00");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = star.isDead
          ? "rgba(60, 50, 40, " + brightness + ")"
          : config.color + Math.floor(brightness * 255).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (self.sanity < 30 && Math.random() > 0.97) {
        var rx = Math.random() * canvas.width;
        var ry = Math.random() * canvas.height;
        var runeGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, 15);
        runeGrad.addColorStop(0, "rgba(139, 58, 58, 0.15)");
        runeGrad.addColorStop(1, "rgba(139, 58, 58, 0)");
        ctx.fillStyle = runeGrad;
        ctx.beginPath();
        ctx.arc(rx, ry, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      state.animationId = requestAnimationFrame(draw);
    }

    draw();

    var resizeTimeout;
    var resizeObserver = new ResizeObserver(function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        var rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width || 400;
        canvas.height = rect.height || 180;
      }, 200);
    });

    resizeObserver.observe(canvas.parentElement);
  },

  setupAccessibilityReduction: function() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("*").forEach(function(el) {
        el.style.animationDuration = "0.01s";
        el.style.transitionDuration = "0.01s";
      });

      if (this.ambientInterval) {
        clearInterval(this.ambientInterval);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  Archive.init();
});