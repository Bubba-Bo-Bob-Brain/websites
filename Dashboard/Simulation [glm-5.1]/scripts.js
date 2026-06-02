const Dashboard = {
  state: {
    paused: false,
    speed: 1247,
    simDate: new Date(2847, 5, 15, 14, 32, 7),
    population: 8204317891,
    speciesCount: 8741293,
    gdp: 151.4,
    cpuLoad: 67.3,
    memUse: 847,
    alertCount: 12,
    cycle: 7891432,
    canvas: null,
    ctx: null,
    mapLayers: {
      tectonic: true,
      climate: true,
      pop: false,
      resources: false,
      trade: true,
      biome: false,
      currents: false,
      military: false
    },
    magData: [],
    tradeRoutes: [],
    seismicEvents: [],
    lastSeismicTime: 0,
    lastToastTime: 0,
    animFrame: null
  },

  init: function () {
    this.state.canvas = document.getElementById("planet-canvas");
    this.state.ctx = this.state.canvas.getContext("2d");
    this.initMagData();
    this.initTradeRoutes();
    this.initSeismicEvents();
    this.bindEvents();
    this.resizeCanvas();
    this.drawPlanet();
    this.drawMagSparkline();
    this.startLoop();
  },

  initMagData: function () {
    for (var i = 0; i < 60; i++) {
      this.state.magData.push(30 + Math.random() * 6 - 3 + Math.sin(i * 0.3) * 2);
    }
  },

  initTradeRoutes: function () {
    this.state.tradeRoutes = [
      { id: "P-17", from: "ZEPHYR", to: "HELIOS", vol: 4.2, status: "DISRUPTED", x1: 0.22, y1: 0.67, x2: 0.51, y2: 0.33 },
      { id: "P-03", from: "ARCANUM", to: "MEGA-9", x1: 0.15, y1: 0.48, x2: 0.62, y2: 0.55, vol: 7.8, status: "ACTIVE" },
      { id: "P-22", from: "BOREAL", to: "NOVA", x1: 0.45, y1: 0.72, x2: 0.38, y2: 0.25, vol: 3.1, status: "ACTIVE" },
      { id: "A-07", from: "HELIOS", to: "KHEPRI", x1: 0.51, y1: 0.33, x2: 0.34, y2: 0.28, vol: 2.4, status: "DELAYED" },
      { id: "A-11", from: "MEGA-9", to: "ZEPHYR", x1: 0.62, y1: 0.55, x2: 0.22, y2: 0.67, vol: 5.9, status: "ACTIVE" },
      { id: "S-01", from: "ORBITAL", to: "SURF", x1: 0.50, y1: 0.05, x2: 0.50, y2: 0.50, vol: 1.1, status: "ACTIVE" }
    ];
  },

  initSeismicEvents: function () {
    var locations = ["TETHYS PLATE", "KHEPRI RIFT", "ARCANUM BASIN", "ZEPHYR MARGIN", "HELIOS RIDGE", "BOREAL SHELF", "NOVA TRENCH", "CORSAIR STRAIT", "HELIX FAULT", "PYRENE ZONE"];
    for (var i = 0; i < 20; i++) {
      var mag = Math.random() < 0.05 ? (5 + Math.random() * 3.5) : (1 + Math.random() * 4.5);
      this.state.seismicEvents.push({
        time: this.formatTime(new Date(2847, 5, 15, 14, Math.floor(32 - i * 3), Math.floor(Math.random() * 60))),
        mag: "M" + mag.toFixed(1),
        loc: locations[Math.floor(Math.random() * locations.length)],
        depth: Math.floor(5 + Math.random() * 150) + "km",
        critical: mag >= 7,
        warning: mag >= 5 && mag < 7
      });
    }
  },

  bindEvents: function () {
    var self = this;

    window.addEventListener("resize", function () {
      self.resizeCanvas();
      self.drawPlanet();
    });

    document.getElementById("btn-pause").addEventListener("click", function () {
      self.state.paused = !self.state.paused;
      this.textContent = self.state.paused ? "▶" : "⏸";
      this.style.color = self.state.paused ? "#ffb300" : "";
      self.showToast(self.state.paused ? "⏸ SIMULATION PAUSED" : "▶ SIMULATION RESUMED", self.state.paused ? "warning" : "info");
    });

    document.getElementById("btn-speed").addEventListener("click", function () {
      var speeds = [1, 10, 100, 500, 1247, 5000];
      var idx = speeds.indexOf(self.state.speed);
      idx = (idx + 1) % speeds.length;
      self.state.speed = speeds[idx];
      document.querySelector(".sim-speed").textContent = "⏩ " + self.state.speed.toLocaleString() + "x";
      self.showToast("⏩ SPEED: " + self.state.speed.toLocaleString() + "x", "info");
    });

    document.getElementById("btn-reset").addEventListener("click", function () {
      self.state.simDate = new Date(2847, 5, 15, 14, 32, 7);
      self.state.population = 8204317891;
      self.state.cycle = 7891432;
      self.showToast("🔄 SIMULATION RESET", "warning");
    });

    document.getElementById("btn-alerts").addEventListener("click", function () {
      self.state.alertCount = 0;
      document.getElementById("alert-count").textContent = "0";
      document.getElementById("alert-count").style.animation = "none";
      self.showToast("🔔 ALERTS ACKNOWLEDGED", "info");
    });

    document.querySelectorAll(".layer-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var layer = this.getAttribute("data-layer");
        self.state.mapLayers[layer] = !self.state.mapLayers[layer];
        this.classList.toggle("active");
        self.drawPlanet();
      });
    });

    var viewport = document.getElementById("map-viewport");
    viewport.addEventListener("mousemove", function (e) {
      var rect = self.state.canvas.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var lat = (90 - y * 180).toFixed(1);
      var lon = (x * 360 - 180).toFixed(1);
      var ns = lat >= 0 ? "N" : "S";
      var ew = lon >= 0 ? "E" : "W";
      document.getElementById("map-coords").textContent = Math.abs(lat).toFixed(1) + "°" + ns + " " + Math.abs(lon).toFixed(1) + "°" + ew;
    });

    document.querySelectorAll(".map-hotspot").forEach(function (hs) {
      hs.addEventListener("mouseenter", function () {
        var label = this.getAttribute("data-label");
        self.showToast("📍 " + label, "info");
      });
    });
  },

  resizeCanvas: function () {
    var canvas = this.state.canvas;
    var parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  },

  drawPlanet: function () {
    var ctx = this.state.ctx;
    var w = this.state.canvas.width;
    var h = this.state.canvas.height;
    if (w === 0 || h === 0) return;

    ctx.fillStyle = "#060a10";
    ctx.fillRect(0, 0, w, h);

    var time = Date.now() * 0.001;
    this.drawOceanGrid(ctx, w, h);
    this.drawContinents(ctx, w, h, time);
    this.drawCloudLayer(ctx, w, h, time);

    if (this.state.mapLayers.tectonic) this.drawTectonicOverlay(ctx, w, h);
    if (this.state.mapLayers.climate) this.drawClimateOverlay(ctx, w, h);
    if (this.state.mapLayers.trade) this.drawTradeRoutes(ctx, w, h, time);
    if (this.state.mapLayers.currents) this.drawOceanCurrents(ctx, w, h, time);
    if (this.state.mapLayers.pop) this.drawPopDots(ctx, w, h);
    if (this.state.mapLayers.resources) this.drawResourceNodes(ctx, w, h);
    if (this.state.mapLayers.biome) this.drawBiomeOverlay(ctx, w, h);
    if (this.state.mapLayers.military) this.drawMilitaryZones(ctx, w, h);

    this.drawGridLines(ctx, w, h);
  },

  seededRandom: function (x, y) {
    var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  },

  noise2D: function (x, y) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    var fx = x - ix;
    var fy = y - iy;
    var sx = fx * fx * (3 - 2 * fx);
    var sy = fy * fy * (3 - 2 * fy);
    var a = this.seededRandom(ix, iy);
    var b = this.seededRandom(ix + 1, iy);
    var c = this.seededRandom(ix, iy + 1);
    var d = this.seededRandom(ix + 1, iy + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  },

  fbm: function (x, y, octaves) {
    var val = 0;
    var amp = 0.5;
    var freq = 1;
    for (var i = 0; i < octaves; i++) {
      val += amp * this.noise2D(x * freq, y * freq);
      amp *= 0.5;
      freq *= 2;
    }
    return val;
  },

  drawOceanGrid: function (ctx, w, h) {
    var gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#0a1628");
    gradient.addColorStop(0.3, "#0c1e3a");
    gradient.addColorStop(0.5, "#0e2244");
    gradient.addColorStop(0.7, "#0c1e3a");
    gradient.addColorStop(1, "#0a1628");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(14, 74, 110, 0.12)";
    ctx.lineWidth = 0.5;
    var gridSize = 30;
    for (var x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (var y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  },

  drawContinents: function (ctx, w, h, time) {
    var self = this;
    var landMasses = [
      { cx: 0.18, cy: 0.35, rx: 0.08, ry: 0.12, name: "ARCANUM" },
      { cx: 0.25, cy: 0.55, rx: 0.05, ry: 0.08, name: "" },
      { cx: 0.38, cy: 0.28, rx: 0.07, ry: 0.06, name: "KHEPRI" },
      { cx: 0.42, cy: 0.38, rx: 0.04, ry: 0.05, name: "" },
      { cx: 0.55, cy: 0.45, rx: 0.12, ry: 0.15, name: "HELIOS" },
      { cx: 0.62, cy: 0.52, rx: 0.06, ry: 0.08, name: "MEGA-9" },
      { cx: 0.75, cy: 0.35, rx: 0.09, ry: 0.10, name: "TETHYS" },
      { cx: 0.80, cy: 0.50, rx: 0.04, ry: 0.06, name: "" },
      { cx: 0.15, cy: 0.70, rx: 0.06, ry: 0.04, name: "ZEPHYR" },
      { cx: 0.50, cy: 0.75, rx: 0.10, ry: 0.05, name: "BOREAL" },
      { cx: 0.35, cy: 0.65, rx: 0.03, ry: 0.04, name: "" },
      { cx: 0.68, cy: 0.68, rx: 0.04, ry: 0.03, name: "" }
    ];

    landMasses.forEach(function (lm) {
      var cx = lm.cx * w;
      var cy = lm.cy * h;
      var rx = lm.rx * w;
      var ry = lm.ry * h;

      ctx.beginPath();
      var steps = 36;
      for (var i = 0; i <= steps; i++) {
        var angle = (i / steps) * Math.PI * 2;
        var noise = self.fbm(lm.cx * 10 + Math.cos(angle) * 2, lm.cy * 10 + Math.sin(angle) * 2, 4);
        var distort = 0.7 + noise * 0.6;
        var px = cx + Math.cos(angle) * rx * distort;
        var py = cy + Math.sin(angle) * ry * distort;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      var landGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      landGrad.addColorStop(0, "#2a4a28");
      landGrad.addColorStop(0.4, "#1e3a1e");
      landGrad.addColorStop(0.7, "#1a3018");
      landGrad.addColorStop(1, "#143014");
      ctx.fillStyle = landGrad;
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      if (lm.name) {
        ctx.fillStyle = "rgba(0, 229, 255, 0.5)";
        ctx.font = "7px 'Share Tech Mono'";
        ctx.textAlign = "center";
        ctx.fillText(lm.name, cx, cy + 3);
      }

      self.drawTerrainDetail(ctx, cx, cy, rx, ry, lm.cx, lm.cy);
    });
  },

  drawTerrainDetail: function (ctx, cx, cy, rx, ry, seedX, seedY) {
    for (var i = 0; i < 12; i++) {
      var angle = this.seededRandom(seedX * 100 + i, seedY * 100) * Math.PI * 2;
      var dist = this.seededRandom(seedX * 200 + i, seedY * 200) * 0.7;
      var px = cx + Math.cos(angle) * rx * dist;
      var py = cy + Math.sin(angle) * ry * dist;
      var size = 1 + this.seededRandom(seedX * 300 + i, seedY * 300) * 3;

      var terrainType = this.seededRandom(seedX * 400 + i, seedY * 400);
      if (terrainType < 0.3) {
        ctx.fillStyle = "rgba(60, 100, 60, 0.3)";
      } else if (terrainType < 0.6) {
        ctx.fillStyle = "rgba(80, 70, 40, 0.2)";
      } else {
        ctx.fillStyle = "rgba(100, 90, 70, 0.25)";
      }
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    var mountainCount = Math.floor(this.seededRandom(seedX * 500, seedY * 500) * 5);
    for (var j = 0; j < mountainCount; j++) {
      var ma = this.seededRandom(seedX * 600 + j, seedY * 600) * Math.PI * 2;
      var md = this.seededRandom(seedX * 700 + j, seedY * 700) * 0.5;
      var mx = cx + Math.cos(ma) * rx * md;
      var my = cy + Math.sin(ma) * ry * md;
      ctx.fillStyle = "rgba(140, 130, 110, 0.35)";
      ctx.beginPath();
      ctx.moveTo(mx - 2, my + 1);
      ctx.lineTo(mx, my - 2);
      ctx.lineTo(mx + 2, my + 1);
      ctx.closePath();
      ctx.fill();
    }
  },

  drawCloudLayer: function (ctx, w, h, time) {
    ctx.globalAlpha = 0.08;
    for (var i = 0; i < 8; i++) {
      var yBase = (0.1 + i * 0.11) * h;
      var offset = time * (3 + i * 0.5) % w;
      ctx.fillStyle = "#aaccdd";
      ctx.beginPath();
      for (var x = 0; x < w; x += 4) {
        var noise = this.fbm((x + offset) * 0.005, i * 3.7, 3);
        var cloudY = yBase + noise * 20 - 10;
        var cloudH = 2 + noise * 6;
        ctx.fillRect(x, cloudY, 4, cloudH);
      }
    }
    ctx.globalAlpha = 1;
  },

  drawTectonicOverlay: function (ctx, w, h) {
    var faults = [
      { x1: 0.34, y1: 0.20, x2: 0.41, y2: 0.45, activity: "high" },
      { x1: 0.70, y1: 0.25, x2: 0.78, y2: 0.55, activity: "high" },
      { x1: 0.15, y1: 0.40, x2: 0.30, y2: 0.60, activity: "med" },
      { x1: 0.50, y1: 0.30, x2: 0.60, y2: 0.65, activity: "med" },
      { x1: 0.10, y1: 0.68, x2: 0.25, y2: 0.75, activity: "low" },
      { x1: 0.45, y1: 0.70, x2: 0.65, y2: 0.78, activity: "low" }
    ];

    var self = this;
    faults.forEach(function (f) {
      ctx.beginPath();
      ctx.moveTo(f.x1 * w, f.y1 * h);
      var midX = (f.x1 + f.x2) / 2 * w + (self.seededRandom(f.x1 * 100, f.y1 * 100) - 0.5) * 20;
      var midY = (f.y1 + f.y2) / 2 * h + (self.seededRandom(f.x2 * 100, f.y2 * 100) - 0.5) * 20;
      ctx.quadraticCurveTo(midX, midY, f.x2 * w, f.y2 * h);

      if (f.activity === "high") {
        ctx.strokeStyle = "rgba(255, 51, 85, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
      } else if (f.activity === "med") {
        ctx.strokeStyle = "rgba(255, 179, 0, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
      } else {
        ctx.strokeStyle = "rgba(0, 229, 255, 0.25)";
        ctx.lineWidth = 0.7;
        ctx.setLineDash([2, 4]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    var volcanoes = [
      { x: 0.34, y: 0.28 }, { x: 0.41, y: 0.38 }, { x: 0.75, y: 0.41 },
      { x: 0.22, y: 0.55 }, { x: 0.55, y: 0.48 }, { x: 0.62, y: 0.52 }
    ];
    volcanoes.forEach(function (v) {
      ctx.beginPath();
      ctx.arc(v.x * w, v.y * h, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 51, 85, 0.5)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(v.x * w, v.y * h, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 51, 85, 0.2)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  },

  drawClimateOverlay: function (ctx, w, h) {
    var zones = [
      { y1: 0, y2: 0.08, color: "rgba(100, 180, 255, 0.08)", label: "POLAR" },
      { y1: 0.08, y2: 0.18, color: "rgba(120, 200, 220, 0.06)", label: "TUNDRA" },
      { y1: 0.18, y2: 0.30, color: "rgba(80, 180, 80, 0.06)", label: "BOREAL" },
      { y1: 0.30, y2: 0.50, color: "rgba(60, 160, 60, 0.08)", label: "TEMPERATE" },
      { y1: 0.50, y2: 0.65, color: "rgba(200, 180, 60, 0.07)", label: "SUBTROPICAL" },
      { y1: 0.65, y2: 0.82, color: "rgba(220, 120, 40, 0.08)", label: "TROPICAL" },
      { y1: 0.82, y2: 0.92, color: "rgba(120, 200, 220, 0.06)", label: "TUNDRA" },
      { y1: 0.92, y2: 1.0, color: "rgba(100, 180, 255, 0.08)", label: "POLAR" }
    ];

    var self = this;
    zones.forEach(function (z) {
      ctx.fillStyle = z.color;
      ctx.fillRect(0, z.y1 * h, w, (z.y2 - z.y1) * h);

      ctx.fillStyle = "rgba(0, 229, 255, 0.12)";
      ctx.font = "6px 'Share Tech Mono'";
      ctx.textAlign = "right";
      ctx.fillText(z.label, w - 4, ((z.y1 + z.y2) / 2) * h + 2);
    });

    ctx.strokeStyle = "rgba(0, 229, 255, 0.08)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 6]);
    zones.forEach(function (z) {
      ctx.beginPath();
      ctx.moveTo(0, z.y1 * h);
      ctx.lineTo(w, z.y1 * h);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  },

  drawTradeRoutes: function (ctx, w, h, time) {
    var self = this;
    this.state.tradeRoutes.forEach(function (route) {
      var x1 = route.x1 * w;
      var y1 = route.y1 * h;
      var x2 = route.x2 * w;
      var y2 = route.y2 * h;

      var cpx = (x1 + x2) / 2 + (self.seededRandom(route.x1 * 10, route.y1 * 10) - 0.5) * 40;
      var cpy = (y1 + y2) / 2 - 20;

      if (route.status === "DISRUPTED") {
        ctx.strokeStyle = "rgba(255, 51, 85, 0.5)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 4]);
      } else if (route.status === "DELAYED") {
        ctx.strokeStyle = "rgba(255, 179, 0, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
      } else {
        ctx.strokeStyle = "rgba(0, 255, 136, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cpx, cpy, x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (route.status === "ACTIVE") {
        var t = ((time * 0.3 + route.x1 * 100) % 1);
        var px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cpx + t * t * x2;
        var py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cpy + t * t * y2;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 136, 0.8)";
        ctx.fill();
      }
    });
  },

  drawOceanCurrents: function (ctx, w, h, time) {
    ctx.strokeStyle = "rgba(0, 150, 255, 0.2)";
    ctx.lineWidth = 1;
    for (var i = 0; i < 5; i++) {
      var yBase = (0.2 + i * 0.15) * h;
      ctx.beginPath();
      for (var x = 0; x < w; x += 3) {
        var y = yBase + Math.sin((x + time * 20 + i * 200) * 0.01) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  drawPopDots: function (ctx, w, h) {
    var cities = [
      { x: 0.62, y: 0.55, size: 6 }, { x: 0.38, y: 0.25, size: 5 },
      { x: 0.55, y: 0.48, size: 5 }, { x: 0.22, y: 0.67, size: 4 },
      { x: 0.15, y: 0.48, size: 4 }, { x: 0.75, y: 0.38, size: 3 },
      { x: 0.50, y: 0.73, size: 3 }, { x: 0.30, y: 0.58, size: 2 },
      { x: 0.68, y: 0.65, size: 2 }, { x: 0.42, y: 0.40, size: 2 }
    ];
    cities.forEach(function (c) {
      var grad = ctx.createRadialGradient(c.x * w, c.y * h, 0, c.x * w, c.y * h, c.size * 3);
      grad.addColorStop(0, "rgba(255, 224, 64, 0.5)");
      grad.addColorStop(0.5, "rgba(255, 224, 64, 0.15)");
      grad.addColorStop(1, "rgba(255, 224, 64, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x * w, c.y * h, c.size * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(c.x * w, c.y * h, c.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 224, 64, 0.9)";
      ctx.fill();
    });
  },

  drawResourceNodes: function (ctx, w, h) {
    var resources = [
      { x: 0.16, y: 0.47, type: "💎" }, { x: 0.40, y: 0.30, type: "⬛" },
      { x: 0.56, y: 0.42, type: "🟤" }, { x: 0.74, y: 0.37, type: "🟡" },
      { x: 0.20, y: 0.62, type: "⚪" }, { x: 0.52, y: 0.72, type: "🔵" },
      { x: 0.63, y: 0.50, type: "🟣" }, { x: 0.35, y: 0.55, type: "🛢️" }
    ];
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    resources.forEach(function (r) {
      ctx.fillText(r.type, r.x * w, r.y * h);

      ctx.beginPath();
      ctx.arc(r.x * w, r.y * h, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(170, 102, 255, 0.3)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  },

  drawBiomeOverlay: function (ctx, w, h) {
    var biomes = [
      { y1: 0, y2: 0.12, color: "rgba(150, 220, 255, 0.1)", label: "🧊" },
      { y1: 0.12, y2: 0.25, color: "rgba(40, 100, 40, 0.1)", label: "🌲" },
      { y1: 0.25, y2: 0.45, color: "rgba(60, 140, 60, 0.12)", label: "🌿" },
      { y1: 0.45, y2: 0.60, color: "rgba(180, 160, 40, 0.1)", label: "🏜️" },
      { y1: 0.60, y2: 0.78, color: "rgba(40, 160, 80, 0.12)", label: "🌴" },
      { y1: 0.78, y2: 0.88, color: "rgba(40, 100, 40, 0.1)", label: "🌲" },
      { y1: 0.88, y2: 1.0, color: "rgba(150, 220, 255, 0.1)", label: "🧊" }
    ];
    biomes.forEach(function (b) {
      ctx.fillStyle = b.color;
      ctx.fillRect(0, b.y1 * h, w, (b.y2 - b.y1) * h);
      ctx.font = "10px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(b.label, 4, ((b.y1 + b.y2) / 2) * h + 4);
    });
  },

  drawMilitaryZones: function (ctx, w, h) {
    var zones = [
      { x: 0.35, y: 0.40, r: 25 }, { x: 0.75, y: 0.45, r: 20 },
      { x: 0.55, y: 0.55, r: 15 }
    ];
    zones.forEach(function (z) {
      ctx.beginPath();
      ctx.arc(z.x * w, z.y * h, z.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 51, 85, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(z.x * w, z.y * h, z.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 51, 85, 0.15)";
      ctx.fill();
    });
  },

  drawGridLines: function (ctx, w, h) {
    ctx.strokeStyle = "rgba(14, 74, 110, 0.15)";
    ctx.lineWidth = 0.3;
    for (var lat = 1; lat < 6; lat++) {
      var y = (lat / 6) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (var lon = 1; lon < 8; lon++) {
      var x = (lon / 8) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(0, 229, 255, 0.12)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
  },

  drawMagSparkline: function () {
    var container = document.getElementById("mag-sparkline");
    if (!container) return;
    var canvas = document.createElement("canvas");
    canvas.width = container.clientWidth || 200;
    canvas.height = container.clientHeight || 20;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.innerHTML = "";
    container.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var data = this.state.magData;
    var w = canvas.width;
    var h = canvas.height;
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var range = max - min || 1;

    ctx.fillStyle = "#060a10";
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 229, 255, 0.6)";
    ctx.lineWidth = 1;
    for (var i = 0; i < data.length; i++) {
      var x = (i / (data.length - 1)) * w;
      var y = h - ((data[i] - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 229, 255, 0.08)";
    ctx.fill();
  },

  startLoop: function () {
    var self = this;
    var lastTime = performance.now();
    var tickAccumulator = 0;
    var slowTickAccumulator = 0;
    var renderTickAccumulator = 0;

    function loop(now) {
      var dt = now - lastTime;
      lastTime = now;

      if (!self.state.paused) {
        tickAccumulator += dt;
        slowTickAccumulator += dt;
        renderTickAccumulator += dt;

        if (tickAccumulator >= 1000) {
          self.tickSecond();
          tickAccumulator -= 1000;
        }

        if (slowTickAccumulator >= 5000) {
          self.tickSlow();
          slowTickAccumulator -= 5000;
        }

        if (renderTickAccumulator >= 2000) {
          self.drawPlanet();
          self.drawMagSparkline();
          renderTickAccumulator -= 2000;
        }
      }

      self.state.animFrame = requestAnimationFrame(loop);
    }

    this.state.animFrame = requestAnimationFrame(loop);
  },

  tickSecond: function () {
    this.advanceSimDate();
    this.updatePopulation();
    this.updateSpecies();
    this.updateSystemMetrics();
    this.updateSimCycle();
    this.maybeAddSeismicEvent();
    this.maybeShowToast();
    this.updateMagData();
  },

  tickSlow: function () {
    this.updateGDP();
    this.fluctuateResourceBars();
    this.updateAlertCount();
  },

  advanceSimDate: function () {
    var d = this.state.simDate;
    var speedFactor = Math.min(this.state.speed, 100);
    d.setSeconds(d.getSeconds() + speedFactor);

    var yr = d.getFullYear();
    var mo = String(d.getMonth() + 1).padStart(2, "0");
    var da = String(d.getDate()).padStart(2, "0");
    var hr = String(d.getHours()).padStart(2, "0");
    var mi = String(d.getMinutes()).padStart(2, "0");
    var se = String(d.getSeconds()).padStart(2, "0");

    document.getElementById("sim-date").textContent = yr + "." + mo + "." + da + " // " + hr + ":" + mi + ":" + se + " UTC";
  },

  updatePopulation: function () {
    var growth = 127432 / 86400;
    this.state.population += growth * this.state.speed * 0.08;
    document.getElementById("pop-counter").textContent = Math.floor(this.state.population).toLocaleString();
  },

  updateSpecies: function () {
    var rate = 14271 / (365.25 * 86400);
    this.state.speciesCount += rate * this.state.speed * 0.08;
    if (Math.random() < 0.3) {
      this.state.speciesCount -= Math.random() * 0.5;
    }
    document.getElementById("species-count").textContent = Math.floor(this.state.speciesCount).toLocaleString();
  },

  updateGDP: function () {
    this.state.gdp += (Math.random() - 0.48) * 0.1;
    document.getElementById("gdp-counter").textContent = "$" + this.state.gdp.toFixed(1) + "T";
  },

  updateSystemMetrics: function () {
    this.state.cpuLoad += (Math.random() - 0.5) * 2;
    this.state.cpuLoad = Math.max(20, Math.min(95, this.state.cpuLoad));
    document.getElementById("cpu-load").textContent = this.state.cpuLoad.toFixed(1) + "%";

    this.state.memUse += (Math.random() - 0.45) * 5;
    this.state.memUse = Math.max(500, Math.min(1200, this.state.memUse));
    document.getElementById("mem-use").textContent = Math.floor(this.state.memUse) + "TB";
  },

  updateSimCycle: function () {
    this.state.cycle += Math.floor(this.state.speed * 0.5);
    document.getElementById("sim-cycle").textContent = "#" + this.state.cycle.toLocaleString();
  },

  updateMagData: function () {
    var last = this.state.magData[this.state.magData.length - 1];
    var newVal = last + (Math.random() - 0.5) * 2 + Math.sin(Date.now() * 0.001) * 0.3;
    newVal = Math.max(25, Math.min(40, newVal));
    this.state.magData.push(newVal);
    if (this.state.magData.length > 60) this.state.magData.shift();
  },

  maybeAddSeismicEvent: function () {
    if (Math.random() > 0.15) return;

    var locations = ["TETHYS PLATE", "KHEPRI RIFT", "ARCANUM BASIN", "ZEPHYR MARGIN", "HELIOS RIDGE", "BOREAL SHELF", "NOVA TRENCH", "CORSAIR STRAIT", "HELIX FAULT", "PYRENE ZONE"];
    var mag = Math.random() < 0.03 ? (6 + Math.random() * 2.5) : (0.5 + Math.random() * 4.5);
    var d = this.state.simDate;
    var time = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");

    var event = {
      time: time,
      mag: "M" + mag.toFixed(1),
      loc: locations[Math.floor(Math.random() * locations.length)],
      depth: Math.floor(5 + Math.random() * 150) + "km",
      critical: mag >= 7,
      warning: mag >= 5 && mag < 7
    };

    var feed = document.getElementById("seismic-feed");
    var item = document.createElement("div");
    item.className = "feed-item" + (event.critical ? " alert-critical" : event.warning ? " alert-warning" : "");
    item.innerHTML = '<span class="fi-time">' + event.time + "</span>" + '<span class="fi-mag">' + event.mag + "</span>" + '<span class="fi-loc">' + event.loc + "</span>" + '<span class="fi-depth">' + event.depth + "</span>";

    item.style.opacity = "0";
    item.style.transform = "translateY(-10px)";
    feed.insertBefore(item, feed.firstChild);

    requestAnimationFrame(function () {
      item.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    });

    while (feed.children.length > 10) {
      feed.removeChild(feed.lastChild);
    }

    if (event.critical) {
      this.showToast("🔴 SEISMIC EVENT " + event.mag + " — " + event.loc, "critical");
      this.state.alertCount++;
      document.getElementById("alert-count").textContent = this.state.alertCount;
    }
  },

  maybeShowToast: function () {
    var now = Date.now();
    if (now - this.state.lastToastTime < 15000) return;
    if (Math.random() > 0.3) return;

    var messages = [
      { text: "🌊 Tidal surge detected — BOREAL SHELF", type: "warning" },
      { text: "🛰️ Satellite re-entry — DEBRIS-4782", type: "info" },
      { text: "📈 Trade volume surge — ROUTE A-11", type: "info" },
      { text: "🔥 Wildfire alert — HELIOS BASIN SECTOR 3", type: "warning" },
      { text: "🧬 New organism cataloged — ABYSSAL ZONE", type: "info" },
      { text: "⚡ Grid fluctuation — MEGACITY-9", type: "warning" },
      { text: "🚢 Cargo vessel delayed — PORT ZEPHYR", type: "info" },
      { text: "🌡️ Temperature record — EQUATORIAL ZONE", type: "warning" },
      { text: "☢️ Radiation spike — SECTOR 4-DELTA", type: "critical" },
      { text: "🌽 Crop failure — NORTHERN BOREAL", type: "warning" }
    ];

    var msg = messages[Math.floor(Math.random() * messages.length)];
    this.showToast(msg.text, msg.type);
    this.state.lastToastTime = now;
  },

  showToast: function (message, type) {
    var container = document.getElementById("toast-container");
    var toast = document.createElement("div");
    toast.className = "toast toast-" + (type || "info");
    toast.textContent = message;
    toast.style.cssText = "font-family:'Share Tech Mono',monospace;font-size:9px;padding:6px 12px;border-radius:3px;pointer-events:auto;opacity:0;transform:translateX(20px);transition:opacity 0.3s ease,transform 0.3s ease;max-width:320px;letter-spacing:0.5px;line-height:1.3;";

    if (type === "critical") {
      toast.style.background = "rgba(255,51,85,0.15)";
      toast.style.border = "1px solid rgba(255,51,85,0.4)";
      toast.style.color = "#ff3355";
    } else if (type === "warning") {
      toast.style.background = "rgba(255,179,0,0.12)";
      toast.style.border = "1px solid rgba(255,179,0,0.3)";
      toast.style.color = "#ffb300";
    } else {
      toast.style.background = "rgba(0,229,255,0.1)";
      toast.style.border = "1px solid rgba(0,229,255,0.25)";
      toast.style.color = "#00e5ff";
    }

    container.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });

    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4000);
  },

  fluctuateResourceBars: function () {
    var bars = document.querySelectorAll(".rr-fill:not(.res-depleted)");
    bars.forEach(function (bar) {
      var current = parseFloat(bar.style.width);
      var delta = (Math.random() - 0.5) * 2;
      var newVal = Math.max(3, Math.min(95, current + delta));
      bar.style.width = newVal.toFixed(1) + "%";
      var pctSpan = bar.parentElement.nextElementSibling;
      if (pctSpan && pctSpan.classList.contains("rr-pct")) {
        pctSpan.textContent = Math.round(newVal) + "%";
      }
    });
  },

  updateAlertCount: function () {
    if (Math.random() < 0.3) {
      this.state.alertCount += Math.floor(Math.random() * 3);
      document.getElementById("alert-count").textContent = this.state.alertCount;
    }
  },

  formatTime: function (d) {
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  Dashboard.init();
});