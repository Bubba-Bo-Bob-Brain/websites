const WarRoom = {
  clockEl: null,
  dateEl: null,
  radioFeed: null,
  posterIndex: 0,
  posterTotal: 3,
  posterAutoTimer: null,
  dragState: null,
  selectedTool: "select",
  interceptMessages: [],
  alertMessages: [],
  alertTimer: null,
  threatTimer: null,
  productionTimer: null,
  radioTimer: null,
  dustInterval: null,

  init: function () {
    this.cacheDom();
    this.startClock();
    this.generateDust();
    this.initGauges();
    this.initRadioFeed();
    this.initPosterCarousel();
    this.initUnitDrag();
    this.initMapTools();
    this.initUnitTooltips();
    this.startThreatFluctuation();
    this.startProductionUpdates();
    this.startAlertRotation();
    this.startRadioIntercepts();
    this.enhanceLampFlicker();
  },

  cacheDom: function () {
    this.clockEl = document.getElementById("clockTime");
    this.dateEl = document.getElementById("dateValue");
    this.radioFeed = document.getElementById("radioFeed");
  },

  startClock: function () {
    const self = this;
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      self.clockEl.textContent = h + ":" + m + ":" + s;
    }
    updateClock();
    setInterval(updateClock, 1000);

    const months = [
      "JAN", "FEB", "MÄR", "APR", "MAI", "JUN",
      "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"
    ];
    const baseDate = new Date(1943, 10, 14);
    const today = new Date();
    const dayOffset = Math.floor((today - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
    baseDate.setDate(baseDate.getDate() + dayOffset);
    const day = baseDate.getDate();
    const month = months[baseDate.getMonth()];
    const year = baseDate.getFullYear();
    this.dateEl.textContent = day + ". " + month + ". " + year;
  },

  generateDust: function () {
    const container = document.getElementById("dustParticles");
    if (!container) return;
    const self = this;
    function createDustParticle() {
      const particle = document.createElement("div");
      particle.className = "dust-particle";
      const x = Math.random() * 100;
      const size = 1 + Math.random() * 2;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 2;
      const drift = -20 + Math.random() * 40;
      particle.style.left = x + "%";
      particle.style.top = "-5px";
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.opacity = 0.1 + Math.random() * 0.3;
      particle.style.animationDuration = duration + "s";
      particle.style.animationDelay = delay + "s";
      particle.style.setProperty("--drift", drift + "px");
      container.appendChild(particle);
      setTimeout(function () {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    }
    for (let i = 0; i < 15; i++) {
      setTimeout(createDustParticle, i * 300);
    }
    self.dustInterval = setInterval(function () {
      if (container.childElementCount < 25) {
        createDustParticle();
      }
    }, 800);
  },

  enhanceLampFlicker: function () {
    const filament = document.querySelector(".lamp-filament");
    const cone = document.getElementById("lampLightCone");
    if (!filament) return;
    function randomFlicker() {
      const intensity = 0.6 + Math.random() * 0.4;
      filament.style.opacity = intensity;
      if (cone) cone.style.opacity = intensity * 0.8;
      const glowSize = 12 + Math.random() * 12;
      filament.style.boxShadow =
        "0 0 " + glowSize + "px rgba(200,160,80," + (intensity * 0.4) + "), " +
        "0 0 " + (glowSize * 3) + "px rgba(200,160,80," + (intensity * 0.15) + ")";
      const nextFlicker = 2000 + Math.random() * 6000;
      setTimeout(randomFlicker, nextFlicker);
    }
    setTimeout(randomFlicker, 5000);
  },

  initGauges: function () {
    const self = this;
    const gauges = document.querySelectorAll(".gauge");
    gauges.forEach(function (gauge) {
      const value = parseInt(gauge.dataset.value, 10);
      const max = parseInt(gauge.dataset.max, 10);
      const fill = gauge.querySelector(".gauge-fill");
      const needle = gauge.querySelector(".gauge-needle");
      const valueText = gauge.querySelector(".gauge-value");
      const radius = 50;
      const circumference = 2 * Math.PI * radius;
      if (fill) {
        fill.style.strokeDasharray = circumference;
        fill.style.strokeDashoffset = circumference;
      }
      setTimeout(function () {
        const offset = circumference - (value / max) * circumference;
        if (fill) {
          fill.style.strokeDashoffset = offset;
        }
        if (needle) {
          const angle = -90 + (value / max) * 180;
          needle.style.transform = "translate(-50%, -100%) rotate(" + angle + "deg)";
        }
      }, 300);
      if (valueText) {
        let currentVal = 0;
        const step = Math.ceil(value / 30);
        const counterInterval = setInterval(function () {
          currentVal += step;
          if (currentVal >= value) {
            currentVal = value;
            clearInterval(counterInterval);
          }
          valueText.textContent = currentVal;
        }, 40);
      }
    });
    setInterval(function () {
      self.fluctuateGauges();
    }, 8000);
  },

  fluctuateGauges: function () {
    const gauges = document.querySelectorAll(".gauge");
    gauges.forEach(function (gauge) {
      const baseValue = parseInt(gauge.dataset.value, 10);
      const max = parseInt(gauge.dataset.max, 10);
      const fluctuation = Math.floor(Math.random() * 7) - 3;
      const newValue = Math.max(5, Math.min(max, baseValue + fluctuation));
      gauge.dataset.value = newValue;
      const fill = gauge.querySelector(".gauge-fill");
      const needle = gauge.querySelector(".gauge-needle");
      const valueText = gauge.querySelector(".gauge-value");
      const radius = 50;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (newValue / max) * circumference;
      if (fill) fill.style.strokeDashoffset = offset;
      if (needle) {
        const angle = -90 + (newValue / max) * 180;
        needle.style.transform = "translate(-50%, -100%) rotate(" + angle + "deg)";
      }
      if (valueText) valueText.textContent = newValue;
    });
  },

  initRadioFeed: function () {
    const feed = this.radioFeed;
    if (!feed) return;
    feed.scrollTop = feed.scrollHeight;
  },

  startRadioIntercepts: function () {
    const self = this;
    this.interceptMessages = [
      { type: "enemy", source: "FEIND-7.2MHz", msg: "...Panzerkolonne gesichtet, Richtung Nordwest... Stärke geschätzt: Regiment..." },
      { type: "friendly", source: "EIGENE-3.8MHz", msg: "Spähtrupp Fuchs meldet: Brücke bei Kilometer 47 intakt. Minenfeld umgangen." },
      { type: "enemy", source: "FEIND-12.1MHz", msg: "...Artillerie-Stellung verlegt... Neue Koordinaten erkannt... Feuervorbereitung vermutet..." },
      { type: "neutral", source: "NEUTRAL-9.4MHz", msg: "Wetteränderung: Kaltfront zieht auf. Temperaturfall auf -3°C in der Nacht. Schneefall möglich." },
      { type: "enemy", source: "FEIND-7.2MHz", msg: "...Verschlüsselter Funkverkehr zunehmend... Schlüsselrolle gewechselt... Entschlüsselung priorisieren..." },
      { type: "friendly", source: "EIGENE-3.8MHz", msg: "Flak-Batterie 14 meldet: Luftverteidigungsbereich gesichert. Munitionsvorrat: 72%." },
      { type: "enemy", source: "FEIND-15.6MHz", msg: "...Truppentransporter im Hafen gesichtet... Verladung läuft... Auslauftermin unbekannt..." },
      { type: "friendly", source: "EIGENE-5.1MHz", msg: "Nachschubkolonne erreicht Versorgungspunkt Alpha. Treibstofflieferung: 4.200 Liter." },
      { type: "neutral", source: "NEUTRAL-9.4MHz", msg: "Funkstörung zunehmend auf Frequenz 7-12MHz. Reichweite reduziert. Atmosphärische Störungen." },
      { type: "enemy", source: "FEIND-7.2MHz", msg: "...Aufklärungsdoppel bestätigt... Eigene Stellungen bei Hügel 219 kartografiert..." },
      { type: "friendly", source: "EIGENE-3.8MHz", msg: "Pioniertrupp hat Feldbefestigungen am Südufer abgeschlossen. Sperren aktiv." },
      { type: "enemy", source: "FEIND-12.1MHz", msg: "...Luftwaffe: Bombardement geplant für 0600... Zielkoordinaten unbestätigt..." },
      { type: "friendly", source: "EIGENE-5.1MHz", msg: "Funkstelle Berta: Verbindung zu Sektorkommando wiederhergestellt. Verschlüsselung aktiv." },
      { type: "enemy", source: "FEIND-7.2MHz", msg: "...Reserve-Division in Bereitstellung... Verlegungsbefehl erwartet... Zeitfenster: 48 Stunden..." },
      { type: "neutral", source: "NEUTRAL-9.4MHz", msg: "Gezeitenbericht: Springflut erwartet am 16.11. Wasserstand +1,8m. Landungsoperationen erschwert." }
    ];
    function addIntercept() {
      if (!self.radioFeed) return;
      const msgData = self.interceptMessages[Math.floor(Math.random() * self.interceptMessages.length)];
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const entry = document.createElement("div");
      entry.className = "radio-entry new-entry intercept-" + msgData.type;
      entry.innerHTML =
        '<span class="intercept-time">' + h + ":" + m + '</span>' +
        '<span class="intercept-source">[' + msgData.source + ']</span>' +
        '<span class="intercept-msg">' + msgData.msg + '</span>';
      self.radioFeed.insertBefore(entry, self.radioFeed.firstChild);
      if (self.radioFeed.childElementCount > 20) {
        self.radioFeed.removeChild(self.radioFeed.lastChild);
      }
      setTimeout(function () {
        entry.classList.remove("new-entry");
      }, 1000);
    }
    self.radioTimer = setInterval(addIntercept, 8000 + Math.random() * 7000);
  },

  initPosterCarousel: function () {
    const self = this;
    const prevBtn = document.getElementById("posterPrev");
    const nextBtn = document.getElementById("posterNext");
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        self.changePoster(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        self.changePoster(1);
      });
    }
    this.posterAutoTimer = setInterval(function () {
      self.changePoster(1);
    }, 12000);
  },

  changePoster: function (direction) {
    const cards = document.querySelectorAll(".poster-card");
    const counter = document.getElementById("posterCounter");
    if (!cards.length) return;
    cards[this.posterIndex].classList.remove("poster-active");
    this.posterIndex = (this.posterIndex + direction + this.posterTotal) % this.posterTotal;
    cards[this.posterIndex].classList.add("poster-active");
    if (counter) {
      counter.textContent = (this.posterIndex + 1) + " / " + this.posterTotal;
    }
    clearInterval(this.posterAutoTimer);
    const self = this;
    this.posterAutoTimer = setInterval(function () {
      self.changePoster(1);
    }, 12000);
  },

  initUnitDrag: function () {
    const self = this;
    const mapSurface = document.getElementById("mapSurface");
    if (!mapSurface) return;
    const friendlyUnits = mapSurface.querySelectorAll(".unit-friendly");
    friendlyUnits.forEach(function (unit) {
      unit.addEventListener("mousedown", function (e) {
        if (self.selectedTool !== "select" && self.selectedTool !== "move") return;
        e.preventDefault();
        const rect = mapSurface.getBoundingClientRect();
        const unitRect = unit.getBoundingClientRect();
        const offsetX = e.clientX - unitRect.left;
        const offsetY = e.clientY - unitRect.top;
        self.dragState = {
          unit: unit,
          offsetX: offsetX,
          offsetY: offsetY,
          mapRect: rect,
          startLeft: parseInt(unit.style.left, 10),
          startTop: parseInt(unit.style.top, 10)
        };
        unit.style.zIndex = "25";
        unit.style.transition = "none";
        unit.style.filter = "brightness(1.3) drop-shadow(0 0 8px rgba(200,160,80,0.5))";
      });
      unit.addEventListener("touchstart", function (e) {
        if (self.selectedTool !== "select" && self.selectedTool !== "move") return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = mapSurface.getBoundingClientRect();
        const unitRect = unit.getBoundingClientRect();
        const offsetX = touch.clientX - unitRect.left;
        const offsetY = touch.clientY - unitRect.top;
        self.dragState = {
          unit: unit,
          offsetX: offsetX,
          offsetY: offsetY,
          mapRect: rect,
          startLeft: parseInt(unit.style.left, 10),
          startTop: parseInt(unit.style.top, 10)
        };
        unit.style.zIndex = "25";
        unit.style.transition = "none";
      }, { passive: false });
    });
    document.addEventListener("mousemove", function (e) {
      if (!self.dragState) return;
      self.handleDragMove(e.clientX, e.clientY);
    });
    document.addEventListener("touchmove", function (e) {
      if (!self.dragState) return;
      const touch = e.touches[0];
      self.handleDragMove(touch.clientX, touch.clientY);
    }, { passive: false });
    document.addEventListener("mouseup", function () {
      self.handleDragEnd();
    });
    document.addEventListener("touchend", function () {
      self.handleDragEnd();
    });
  },

  handleDragMove: function (clientX, clientY) {
    if (!this.dragState) return;
    const ds = this.dragState;
    const mapRect = ds.mapRect;
    let newLeft = clientX - mapRect.left - ds.offsetX;
    let newTop = clientY - mapRect.top - ds.offsetY;
    newLeft = Math.max(0, Math.min(mapRect.width - 64, newLeft));
    newTop = Math.max(0, Math.min(mapRect.height - 60, newTop));
    ds.unit.style.left = newLeft + "px";
    ds.unit.style.top = newTop + "px";
  },

  handleDragEnd: function () {
    if (!this.dragState) return;
    const unit = this.dragState.unit;
    unit.style.zIndex = "10";
    unit.style.transition = "transform 0.1s, box-shadow 0.1s";
    unit.style.filter = "";
    this.dragState = null;
  },

  initMapTools: function () {
    const self = this;
    const toolBtns = document.querySelectorAll(".tool-btn");
    toolBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        toolBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        self.selectedTool = btn.id.replace("tool", "").toLowerCase();
        const mapSurface = document.getElementById("mapSurface");
        if (!mapSurface) return;
        switch (self.selectedTool) {
          case "select":
            mapSurface.style.cursor = "default";
            break;
          case "move":
            mapSurface.style.cursor = "grab";
            break;
          case "measure":
            mapSurface.style.cursor = "crosshair";
            break;
          case "mark":
            mapSurface.style.cursor = "cell";
            break;
          default:
            mapSurface.style.cursor = "default";
        }
      });
    });
    const mapSurface = document.getElementById("mapSurface");
    if (mapSurface) {
      mapSurface.addEventListener("click", function (e) {
        if (self.selectedTool === "mark") {
          self.placeMapMarker(e, mapSurface);
        } else if (self.selectedTool === "measure") {
          self.measureDistance(e, mapSurface);
        }
      });
    }
  },

  placeMapMarker: function (e, mapSurface) {
    const rect = mapSurface.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const marker = document.createElement("div");
    marker.className = "map-user-marker";
    marker.style.position = "absolute";
    marker.style.left = (x - 6) + "px";
    marker.style.top = (y - 6) + "px";
    marker.style.width = "12px";
    marker.style.height = "12px";
    marker.style.borderRadius = "50%";
    marker.style.background = "radial-gradient(circle, rgba(200,160,80,0.9), rgba(200,160,80,0.3))";
    marker.style.boxShadow = "0 0 8px rgba(200,160,80,0.5)";
    marker.style.zIndex = "8";
    marker.style.pointerEvents = "none";
    marker.style.animation = "markerAppear 0.3s ease-out";
    mapSurface.appendChild(marker);
    setTimeout(function () {
      marker.style.transition = "opacity 0.5s";
      marker.style.opacity = "0.5";
    }, 500);
  },

  measureDistance: function (e, mapSurface) {
    const existingLine = mapSurface.querySelector(".measure-line");
    const existingStart = mapSurface.querySelector(".measure-start");
    if (existingLine) {
      const rect = mapSurface.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const startX = parseFloat(existingStart.dataset.x);
      const startY = parseFloat(existingStart.dataset.y);
      const dx = x - startX;
      const dy = y - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const km = (dist * 0.5).toFixed(1);
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.zIndex = "7";
      svg.style.pointerEvents = "none";
      svg.innerHTML =
        '<line x1="' + startX + '" y1="' + startY + '" x2="' + x + '" y2="' + y + '" stroke="rgba(200,160,80,0.6)" stroke-width="1.5" stroke-dasharray="6,3"/>' +
        '<circle cx="' + startX + '" cy="' + startY + '" r="3" fill="rgba(200,160,80,0.8)"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="3" fill="rgba(200,160,80,0.8)"/>' +
        '<text x="' + ((startX + x) / 2) + '" y="' + ((startY + y) / 2 - 6) + '" fill="rgba(200,160,80,0.9)" font-size="10" font-family="Oswald" text-anchor="middle">' + km + ' km</text>';
      mapSurface.appendChild(svg);
      if (existingLine.parentNode) existingLine.parentNode.removeChild(existingLine);
      if (existingStart.parentNode) existingStart.parentNode.removeChild(existingStart);
      setTimeout(function () {
        svg.style.transition = "opacity 2s";
        svg.style.opacity = "0";
        setTimeout(function () {
          if (svg.parentNode) svg.parentNode.removeChild(svg);
        }, 2500);
      }, 4000);
    } else {
      const rect = mapSurface.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const startMarker = document.createElement("div");
      startMarker.className = "measure-start";
      startMarker.dataset.x = x;
      startMarker.dataset.y = y;
      startMarker.style.position = "absolute";
      startMarker.style.left = (x - 4) + "px";
      startMarker.style.top = (y - 4) + "px";
      startMarker.style.width = "8px";
      startMarker.style.height = "8px";
      startMarker.style.borderRadius = "50%";
      startMarker.style.background = "rgba(200,160,80,0.8)";
      startMarker.style.zIndex = "7";
      startMarker.style.pointerEvents = "none";
      mapSurface.appendChild(startMarker);
      const line = document.createElement("div");
      line.className = "measure-line";
      line.style.display = "none";
      mapSurface.appendChild(line);
    }
  },

  initUnitTooltips: function () {
    const self = this;
    const tooltip = document.getElementById("unitTooltip");
    if (!tooltip) return;
    const tooltipName = document.getElementById("tooltipName");
    const tooltipDetail = document.getElementById("tooltipDetail");
    const tooltipStatus = document.getElementById("tooltipStatus");
    const unitData = {
      "1": { name: "7. Infanterie-Division", detail: "Stärke: 8.400 Mann\nAusrüstung: Standard\nVersorgung: 84%", status: "EINSATZBEREIT", statusColor: "#4a8a3a" },
      "2": { name: "3. Panzer-Division", detail: "Stärke: 160 Panzer\nTyp: PzKpfw IV & V\nTreibstoff: 72%", status: "TEILBEREIT", statusColor: "#c8a050" },
      "3": { name: "12. Artillerie-Regiment", detail: "Stärke: 48 Geschütze\nKaliber: 10.5cm & 15cm\nMunition: 91%", status: "EINSATZBEREIT", statusColor: "#4a8a3a" },
      "4": { name: "Aufklärungsgruppe Adler", detail: "Stärke: 280 Mann\nFahrzeuge: 18 Sd.Kfz.\nReichweite: 56%", status: "AUFKLÄRUNG", statusColor: "#3a5a8a" },
      "5": { name: "5. Pionier-Kompanie", detail: "Stärke: 420 Mann\nAusrüstung: Pionier\nVersorgung: 68%", status: "EINSATZBEREIT", statusColor: "#4a8a3a" },
      "e1": { name: "Feindliche Infanterie", detail: "Stärke: Geschätzt 6.000-8.000\nLetzte Aufklärung: 12h\nZuverlässigkeit: MEDIUM", status: "UNBESTÄTIGT", statusColor: "#c83030" },
      "e2": { name: "Feindliche Panzer", detail: "Stärke: Geschätzt 80-120\nTyp: Unbekannt\nZuverlässigkeit: NIEDRIG", status: "UNBESTÄTIGT", statusColor: "#c83030" },
      "e3": { name: "Feindliche Artillerie", detail: "Stärke: Geschätzt 30-50 Geschütze\nPosition: Bestätigt\nZuverlässigkeit: HOCH", status: "BESTÄTIGT", statusColor: "#c8a050" }
    };
    const allUnits = document.querySelectorAll(".unit-token");
    allUnits.forEach(function (unit) {
      unit.addEventListener("mouseenter", function (e) {
        const unitId = unit.dataset.unit;
        const data = unitData[unitId];
        if (!data) return;
        tooltipName.textContent = data.name;
        tooltipDetail.textContent = data.detail;
        tooltipStatus.textContent = data.status;
        tooltipStatus.style.color = data.statusColor;
        tooltip.classList.add("visible");
        const rect = unit.getBoundingClientRect();
        tooltip.style.left = (rect.right + 10) + "px";
        tooltip.style.top = (rect.top) + "px";
        if (rect.right + 220 > window.innerWidth) {
          tooltip.style.left = (rect.left - 210) + "px";
        }
      });
      unit.addEventListener("mouseleave", function () {
        tooltip.classList.remove("visible");
      });
    });
  },

  startThreatFluctuation: function () {
    const self = this;
    this.threatTimer = setInterval(function () {
      const threats = [
        { bar: "threatAir", val: "threatAirVal", base: 65 },
        { bar: "threatLand", val: "threatLandVal", base: 40 },
        { bar: "threatSea", val: "threatSeaVal", base: 80 },
        { bar: "threatSabotage", val: "threatSabotageVal", base: 25 }
      ];
      threats.forEach(function (t) {
        const fluctuation = Math.floor(Math.random() * 11) - 5;
        const newVal = Math.max(5, Math.min(95, t.base + fluctuation));
        t.base = newVal;
        const bar = document.getElementById(t.bar);
        const val = document.getElementById(t.val);
        if (bar) bar.style.width = newVal + "%";
        if (val) val.textContent = newVal + "%";
      });
      self.updateAlertBasedOnThreats(threats);
    }, 10000);
  },

  updateAlertBasedOnThreats: function (threats) {
    const alertText = document.getElementById("alertText");
    if (!alertText) return;
    let highestThreat = { name: "", value: 0 };
    const names = { threatAir: "LUFT", threatLand: "LAND", threatSea: "MARITIM", threatSabotage: "SABOTAGE" };
    threats.forEach(function (t) {
      if (t.base > highestThreat.value) {
        highestThreat = { name: names[t.bar] || t.bar, value: t.base };
      }
    });
    let severity = "NIEDRIG";
    let message = "";
    if (highestThreat.value > 75) {
      severity = "KRITISCH";
      message = highestThreat.name + " BEDROHUNG: KRITISCH — Sofortige Maßnahmen empfohlen. Alle Einheiten erhöhte Alarmstufe.";
    } else if (highestThreat.value > 55) {
      severity = "HOCH";
      message = highestThreat.name + " BEDROHUNG: HOCH — Verstärkte Aufklärung angeordnet. Vorsicht bei Operationen in diesem Sektor.";
    } else if (highestThreat.value > 35) {
      severity = "MITTEL";
      message = highestThreat.name + " BEDROHUNG: MITTEL — Lage unter Beobachtung. Standard-Sicherheitsprotokolle aktiv.";
    } else {
      severity = "NIEDRIG";
      message = highestThreat.name + " BEDROHUNG: NIEDRIG — Keine ungewöhnlichen Aktivitäten erkannt. Routineüberwachung fortgesetzt.";
    }
    alertText.textContent = message;
  },

  startProductionUpdates: function () {
    this.productionTimer = setInterval(function () {
      const items = document.querySelectorAll(".production-item");
      items.forEach(function (item) {
        const countEl = item.querySelector(".production-count");
        const fillEl = item.querySelector(".production-fill");
        const statusEl = item.querySelector(".production-status");
        if (!countEl || !fillEl) return;
        const parts = countEl.textContent.split("/");
        let current = parseInt(parts[0].trim(), 10);
        const target = parseInt(parts[1].trim(), 10);
        if (current < target) {
          const increment = Math.random() > 0.6 ? 1 : 0;
          current = Math.min(target, current + increment);
          countEl.textContent = current + " / " + target;
          const percent = Math.round((current / target) * 100);
          fillEl.style.width = percent + "%";
          if (statusEl) {
            if (percent >= 100) {
              statusEl.textContent = "ABGESCHLOSSEN";
              statusEl.className = "production-status status-ahead";
            } else if (percent >= 80) {
              statusEl.textContent = "IM ZEITPLAN";
              statusEl.className = "production-status status-on-track";
            } else if (percent >= 55) {
              statusEl.textContent = "VERZÖGERUNG";
              statusEl.className = "production-status status-behind";
            } else {
              statusEl.textContent = "KRITISCH";
              statusEl.className = "production-status status-critical";
            }
          }
        }
      });
    }, 12000);
  },

  startAlertRotation: function () {
    const self = this;
    this.alertMessages = [
      "MARITIME BEDROHUNG: HOCH — U-Boot-Aktivität im Kanal erkannt. Vorsicht bei Nachschubrouten.",
      "LUFTLAGEMELDUNG: Feindliche Aufklärungsflüge über Sektorgrenze. Flak-Stellungen alarmiert.",
      "NACHSCHUB: Treibstofflieferung Versorgungspunkt Bravo um 48 Stunden verzögert. Rationierung empfohlen.",
      "AUFKLÄRUNG: Neue feindliche Befestigungsline 8km westlich von Hügel 219 entdeckt. Kartierung läuft.",
      "SICHERHEIT: Feindliche Agententätigkeit im Hinterland vermutet. Gegen-spionage-Maßnahmen verstärkt.",
      "WETTER: Kaltfront zieht auf. Temperaturen unter -5°C erwartet. Winterausrüstung priorisieren.",
      "VERBINDUNG: Funkverbindung zu Sektorkommando Nord instabil. Alternative Frequenzen getestet.",
      "PRODUKTION: Stahlwerk Ruhrtal meldet Lieferverzögerung. Panzer-Produktion möglicherweise betroffen."
    ];
    let alertIndex = 0;
    self.alertTimer = setInterval(function () {
      alertIndex = (alertIndex + 1) % self.alertMessages.length;
      const alertText = document.getElementById("alertText");
      if (alertText) {
        alertText.style.opacity = "0";
        alertText.style.transition = "opacity 0.3s";
        setTimeout(function () {
          alertText.textContent = self.alertMessages[alertIndex];
          alertText.style.opacity = "1";
        }, 300);
      }
    }, 15000);
  }
};

const markerStyle = document.createElement("style");
markerStyle.textContent = "@keyframes markerAppear { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }";
document.head.appendChild(markerStyle);

document.addEventListener("DOMContentLoaded", function () {
  WarRoom.init();
});