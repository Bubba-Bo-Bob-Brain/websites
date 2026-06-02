(function () {
    const canvas = document.getElementById("bioluminescent-canvas");
    const ctx = canvas.getContext("2d");

    const depthValEl = document.getElementById("depth-value");
    const depthBarEl = document.getElementById("depth-bar");
    const pressureValEl = document.getElementById("pressure-value");
    const pressureBarEl = document.getElementById("pressure-bar");
    
    const headingValEl = document.getElementById("heading-val");
    const velocityValEl = document.getElementById("velocity-val");
    const clockEl = document.getElementById("mission-clock");
    const tickerEl = document.getElementById("log-ticker");
    
    const sonarPingEl = document.getElementById("sonar-ping-element");
    const btnSonar = document.getElementById("btn-sonar-ping");
    const btnSilent = document.getElementById("btn-silent-running");
    const btnKlaxon = document.getElementById("btn-emergency-klaxon");
    
    const hullSegments = document.querySelectorAll(".hull-segment");
    const sectorStatusEl = document.getElementById("selected-sector-status");
    const faunaLog = document.getElementById("fauna-log");

    let depth = 10928;
    let heading = 284.5;
    let velocity = 0.2;
    let isSilentRunning = false;
    let isKlaxonActive = false;
    
    let particles = [];
    const maxParticles = 40;

    const logMessages = [
        "Anomalous biological signature detected at Sector Echo-9.",
        "External temperature dropping. Ambient current: 1.4 knots East.",
        "Hydrostatic pressure stabilizing at 109.2 Megapascals.",
        "Acoustic anomaly detected. Analyzing background resonance...",
        "Bioluminescent bloom approaching viewport starboard quadrant.",
        "Auxiliary thermal generators cycling. Fuel levels at 94%.",
        "Passive sonar sweep detected high-frequency crustacean clicks."
    ];

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    class BioParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 3.5 + 0.5;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.2;
            this.alpha = Math.random() * 0.5 + 0.3;
            this.glowColor = isSilentRunning ? "0, 102, 255" : "0, 255, 170";
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.glowColor}, ${this.alpha})`;
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = `rgb(${this.glowColor})`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new BioParticle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    function updateMissionClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(3, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}:${secs}`;
    }

    function updateMetrics() {
        depth += (Math.random() - 0.5) * 1.5;
        const currentDepthInt = Math.floor(depth);
        depthValEl.textContent = currentDepthInt.toLocaleString();
        
        const maxDepthLimit = 12000;
        const depthPercent = (currentDepthInt / maxDepthLimit) * 100;
        depthBarEl.style.height = `${depthPercent}%`;

        const pressure = Math.floor(currentDepthInt * 0.1005);
        pressureValEl.textContent = pressure.toLocaleString();
        
        const pressurePercent = (pressure / 1200) * 100;
        pressureBarEl.style.width = `${pressurePercent}%`;

        heading += (Math.random() - 0.5) * 0.4;
        if (heading < 0) heading += 360;
        if (heading >= 360) heading -= 360;
        headingValEl.textContent = `${heading.toFixed(1)}°`;

        velocity += (Math.random() - 0.5) * 0.05;
        velocity = Math.max(-1.5, Math.min(1.5, velocity));
        const sign = velocity >= 0 ? "+" : "";
        velocityValEl.textContent = `${sign}${velocity.toFixed(2)} m/s`;
    }

    function addTickerLog(customMessage) {
        const message = customMessage || logMessages[Math.floor(Math.random() * logMessages.length)];
        tickerEl.innerHTML = `<span>&gt;&gt; ${message}</span>`;
    }

    function triggerSonarPing() {
        sonarPingEl.classList.remove("pinging");
        void sonarPingEl.offsetWidth;
        sonarPingEl.classList.add("pinging");
        
        addTickerLog("Active acoustic sonar pulse transmitted. Listening for returns...");
        
        setTimeout(() => {
            const species = [
                { name: "Magnapinna Squid", id: "#B-09", strength: "STRONG SIG" },
                { name: "Gigantocypris", id: "#B-10", strength: "WEAK SIG" },
                { name: "Unidentified Leviathan Class", id: "#B-99", strength: "CRITICAL SIG" }
            ];
            const detected = species[Math.floor(Math.random() * species.length)];
            
            const newItem = document.createElement("div");
            newItem.className = "fauna-item target-pulse";
            newItem.innerHTML = `
                <div class="fauna-meta">
                    <span class="fauna-id">${detected.id}</span>
                    <span class="fauna-time">${new Date().toTimeString().split(' ')[0]}</span>
                </div>
                <div class="fauna-body">
                    <span class="fauna-name">${detected.name}</span>
                    <span class="fauna-sig ${detected.strength.includes('CRITICAL') ? 'signal-weak' : 'signal-strong'}">${detected.strength}</span>
                </div>
            `;
            
            faunaLog.prepend(newItem);
            addTickerLog(`Acoustic return: Detected ${detected.name} near station perimeter.`);
        }, 1800);
    }

    function handleHullSectorClick(event) {
        const sector = event.currentTarget;
        const sectorName = sector.getAttribute("data-sector");
        const sectorHealth = sector.querySelector(".seg-val").textContent;
        
        let statusClass = "status-green";
        let descriptiveStatus = "NOMINAL CAPACITY";
        
        if (sector.classList.contains("yellow")) {
            statusClass = "status-yellow";
            descriptiveStatus = "MINOR CAVITATION DETECTED";
        } else if (sector.classList.contains("orange")) {
            statusClass = "status-orange";
            descriptiveStatus = "MICRO-STRUCTURAL STRESS";
        } else if (sector.classList.contains("red")) {
            statusClass = "status-red";
            descriptiveStatus = "CRITICAL BENDING MOMENT";
        }

        sectorStatusEl.className = statusClass;
        sectorStatusEl.textContent = `${sectorName.toUpperCase()} - ${sectorHealth} [${descriptiveStatus}]`;
        addTickerLog(`Diagnostics query initiated: ${sectorName} integrity analyzed.`);
    }

    btnSonar.addEventListener("click", triggerSonarPing);

    btnSilent.addEventListener("click", () => {
        isSilentRunning = !isSilentRunning;
        document.body.classList.toggle("silent-running-active", isSilentRunning);
        
        particles.forEach(p => {
            p.glowColor = isSilentRunning ? "0, 102, 255" : "0, 255, 170";
        });

        if (isSilentRunning) {
            addTickerLog("SILENT RUNNING MODE ACTIVATED. Non-essential power decoupled.");
            btnSilent.querySelector(".btn-text").textContent = "DEACTIVATE SILENT RUNNING";
        } else {
            addTickerLog("Standard operating profile restored. Thermal signatures normalization in progress.");
            btnSilent.querySelector(".btn-text").textContent = "SILENT RUNNING";
        }
    });

    btnKlaxon.addEventListener("click", () => {
        isKlaxonActive = !isKlaxonActive;
        document.body.classList.toggle("klaxon-active", isKlaxonActive);

        if (isKlaxonActive) {
            addTickerLog("WARNING: Emergency structural pressure alert initiated manually.");
            btnKlaxon.querySelector(".btn-text").textContent = "SILENCE KLAXON";
        } else {
            addTickerLog("Emergency alarm silenced. Standard deep-sea protocols resuming.");
            btnKlaxon.querySelector(".btn-text").textContent = "EMERGENCY KLAXON";
        }
    });

    window.addEventListener("resize", () => {
        resizeCanvas();
        initParticles();
    });

    hullSegments.forEach(seg => {
        seg.addEventListener("click", handleHullSectorClick);
    });

    resizeCanvas();
    initParticles();
    animateParticles();

    setInterval(updateMissionClock, 1000);
    setInterval(updateMetrics, 1500);
    setInterval(() => addTickerLog(), 10000);
})();