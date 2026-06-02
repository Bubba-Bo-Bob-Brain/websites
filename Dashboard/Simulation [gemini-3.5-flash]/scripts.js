(function () {
    const STATE = {
        isPaused: false,
        speedMultiplier: 1,
        epoch: 348291048.02,
        population: 8402198321,
        systemLoad: 94.8,
        tectonicStress: 84.21,
        activeVolcanoes: 412,
        meanTemp: 15.42,
        co2Density: 382.4,
        kardashevScale: 0.7821,
        maritimeFleet: 48291,
        airCargo: 14892,
        satellites: [
            { id: 1, radius: 140, speed: 0.02, angle: 0, color: '#00f0ff' },
            { id: 2, radius: 190, speed: 0.012, angle: 1.5, color: '#00ff66' },
            { id: 3, radius: 210, speed: 0.008, angle: 3.1, color: '#ffaa00' },
            { id: 4, radius: 240, speed: 0.005, angle: 4.5, color: '#ff3366' }
        ],
        storms: [
            { id: 'Aurelia', x: 280, y: 160, size: 8, speedX: 0.2, speedY: -0.1 },
            { id: 'Zephyr', x: 520, y: 320, size: 10, speedX: -0.15, speedY: 0.15 },
            { id: 'Yuri', x: 620, y: 120, size: 6, speedX: 0.1, speedY: 0.05 }
        ],
        seismicHistory: Array(50).fill(25),
        consumptionHistory: Array(40).fill(30)
    };

    const terminalLogs = [
        "AETHERIS_SHELL: Atmospheric chemical matrix recalibrating...",
        "SYS_INFRA: Automated cargo shuttle docking sequence initiated.",
        "SYS_LITH: Stress anomaly registered at tectonic boundary 14-A.",
        "SYS_CLIM: Super-cyclone tracking models projected to Sector 44.",
        "AETHERIS_SHELL: Purging hyperloop data channel cache files.",
        "SYS_BIO: Megacity Tokyo-Delta reaching density threshold 98.2%.",
        "SYS_RES: Deep crust heavy-isotope drill sequence operational.",
        "SYS_INFRA: Autonomous oceanic cleanup fleet dispatched to Sector 09.",
        "AETHERIS_SHELL: Core integrity validation code 0x88F2: SUCCESS.",
        "SYS_LITH: Geothermal conversion plants operating at peak output.",
        "SYS_CLIM: Biosphere carbon sequestration scrubbers set to high."
    ];

    const volcanoNames = [
        "Mt. Vesuvius IV (VEI 5)",
        "Krakatoa Prime (VEI 3)",
        "Mauna Loa Beta (VEI 1)",
        "Mount Erebus Gamma (VEI 2)",
        "Santorini Reborn (VEI 4)",
        "Popocatépetl V (VEI 2)",
        "Fuji Prime (VEI 1)",
        "Eyjafjallajökull Delta (VEI 3)"
    ];

    const sectors = ["Sector 04-B", "Sector 89-K", "Sector 112-A", "Sector 34-F", "Sector 15-D", "Sector 72-Y", "Sector 10-M", "Sector 55-Z"];
    const eventLogStream = document.getElementById("event-stream");
    const terminalOutput = document.getElementById("terminal-output");
    const climateGridContainer = document.getElementById("climate-grid-cells");
    const seismicContainer = document.getElementById("seismic-waves");
    const consumptionContainer = document.getElementById("consumption-chart");

    let seismicSvg, seismicPath;
    let consumptionSvg, consumptionPath, consumptionArea;
    let animationFrameId;

    function init() {
        setupControlButtons();
        generateMapContinents();
        generateMapTradeRoutes();
        generateMapSatellites();
        generateClimateGrid();
        setupDynamicCharts();
        
        startSimulationLoops();
        animate();
    }

    function setupControlButtons() {
        const buttons = {
            pause: document.getElementById("btn-pause"),
            play: document.getElementById("btn-play"),
            fast: document.getElementById("btn-fast"),
            hyper: document.getElementById("btn-hyper")
        };

        function resetActive() {
            Object.values(buttons).forEach(btn => btn.classList.remove("active"));
        }

        buttons.pause.addEventListener("click", () => {
            resetActive();
            buttons.pause.classList.add("active");
            STATE.isPaused = true;
        });

        buttons.play.addEventListener("click", () => {
            resetActive();
            buttons.play.classList.add("active");
            STATE.isPaused = false;
            STATE.speedMultiplier = 1;
        });

        buttons.fast.addEventListener("click", () => {
            resetActive();
            buttons.fast.classList.add("active");
            STATE.isPaused = false;
            STATE.speedMultiplier = 8;
        });

        buttons.hyper.addEventListener("click", () => {
            resetActive();
            buttons.hyper.classList.add("active");
            STATE.isPaused = false;
            STATE.speedMultiplier = 32;
        });
    }

    function generateMapContinents() {
        const group = document.getElementById("continents-group");
        const shapes = [
            "M 150,150 Q 180,120 220,130 T 320,180 T 280,260 T 210,240 T 140,200 Z",
            "M 450,100 Q 520,80 580,120 T 640,180 T 600,280 T 500,240 T 420,160 Z",
            "M 250,300 Q 300,280 340,320 T 380,410 T 290,440 T 220,380 Z",
            "M 550,320 Q 600,290 650,340 T 700,420 T 610,430 T 520,370 Z",
            "M 350,80 Q 380,60 410,90 T 390,130 T 340,110 Z"
        ];

        shapes.forEach((d) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("class", "continent-shape");
            group.appendChild(path);
        });
    }

    function generateMapTradeRoutes() {
        const group = document.getElementById("routes-group");
        const routes = [
            { from: [200, 180], to: [500, 160] },
            { from: [550, 150], to: [600, 360] },
            { from: [280, 360], to: [580, 380] },
            { from: [250, 200], to: [300, 350] },
            { from: [480, 200], to: [310, 360] }
        ];

        routes.forEach(r => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const d = `M ${r.from[0]},${r.from[1]} Q ${(r.from[0] + r.to[0])/2},${Math.min(r.from[1], r.to[1]) - 40} ${r.to[0]},${r.to[1]}`;
            path.setAttribute("d", d);
            path.setAttribute("class", "trade-route-path");
            group.appendChild(path);
        });
    }

    function generateMapSatellites() {
        const group = document.getElementById("satellites-group");
        
        STATE.satellites.forEach(sat => {
            const orbit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            orbit.setAttribute("cx", "400");
            orbit.setAttribute("cy", "250");
            orbit.setAttribute("r", sat.radius);
            orbit.setAttribute("class", "satellite-orbit");
            group.appendChild(orbit);

            const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            node.setAttribute("id", `sat-node-${sat.id}`);
            node.setAttribute("r", "4");
            node.setAttribute("fill", sat.color);
            node.setAttribute("class", "satellite-node");
            group.appendChild(node);
        });
    }

    function generateClimateGrid() {
        climateGridContainer.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement("div");
            cell.className = "grid-cell";
            const level = Math.random();
            cell.style.backgroundColor = getClimateColor(level);
            cell.dataset.val = level;
            climateGridContainer.appendChild(cell);
        }
    }

    function getClimateColor(val) {
        if (val < 0.2) return 'rgba(0, 240, 255, 0.4)';
        if (val < 0.5) return 'rgba(0, 255, 102, 0.3)';
        if (val < 0.8) return 'rgba(255, 170, 0, 0.3)';
        return 'rgba(255, 51, 102, 0.4)';
    }

    function setupDynamicCharts() {
        seismicSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        seismicSvg.setAttribute("width", "100%");
        seismicSvg.setAttribute("height", "100%");
        seismicPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        seismicPath.setAttribute("class", "seismic-svg-path");
        seismicSvg.appendChild(seismicPath);
        seismicContainer.appendChild(seismicSvg);

        consumptionSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        consumptionSvg.setAttribute("width", "100%");
        consumptionSvg.setAttribute("height", "100%");
        
        consumptionArea = document.createElementNS("http://www.w3.org/2000/svg", "path");
        consumptionArea.setAttribute("fill", "rgba(0, 240, 255, 0.08)");
        
        consumptionPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        consumptionPath.setAttribute("fill", "none");
        consumptionPath.setAttribute("stroke", "var(--neon-cyan)");
        consumptionPath.setAttribute("stroke-width", "1.5");
        
        consumptionSvg.appendChild(consumptionArea);
        consumptionSvg.appendChild(consumptionPath);
        consumptionContainer.appendChild(consumptionSvg);
    }

    function drawSeismicChart() {
        const width = seismicContainer.clientWidth;
        const height = seismicContainer.clientHeight;
        const points = STATE.seismicHistory;
        const step = width / (points.length - 1);
        
        let d = `M 0,${height/2}`;
        for (let i = 0; i < points.length; i++) {
            const x = i * step;
            const y = (points[i] / 50) * height;
            d += ` L ${x},${y}`;
        }
        seismicPath.setAttribute("d", d);
    }

    function drawConsumptionChart() {
        const width = consumptionContainer.clientWidth;
        const height = consumptionContainer.clientHeight;
        const points = STATE.consumptionHistory;
        const step = width / (points.length - 1);
        
        let d = `M 0,${height - (points[0]/50)*height}`;
        for (let i = 0; i < points.length; i++) {
            const x = i * step;
            const y = height - (points[i] / 50) * height;
            d += ` L ${x},${y}`;
        }
        consumptionPath.setAttribute("d", d);

        const areaD = d + ` L ${width},${height} L 0,${height} Z`;
        consumptionArea.setAttribute("d", areaD);
    }

    function updateSimulationData() {
        if (STATE.isPaused) return;

        const factor = STATE.speedMultiplier;

        STATE.epoch += 0.04 * factor;
        document.getElementById("epoch-counter").innerText = STATE.epoch.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        STATE.systemLoad = Math.min(99.9, Math.max(80.0, STATE.systemLoad + (Math.random() - 0.5) * 2));
        const loadEl = document.getElementById("system-load");
        loadEl.innerText = `${STATE.systemLoad.toFixed(1)}%`;
        if (STATE.systemLoad > 95) {
            loadEl.className = "metric-value text-alert";
        } else if (STATE.systemLoad > 90) {
            loadEl.className = "metric-value text-warning";
        } else {
            loadEl.className = "metric-value text-success";
        }

        STATE.population += Math.round((Math.random() * 5 - 1.8) * factor);
        document.getElementById("global-population").innerText = STATE.population.toLocaleString();

        const birthRate = (4.2 + (Math.random() - 0.5) * 0.4).toFixed(1);
        const deathRate = (1.8 + (Math.random() - 0.5) * 0.2).toFixed(1);
        document.getElementById("birth-rate").innerText = birthRate;
        document.getElementById("death-rate").innerText = deathRate;

        STATE.tectonicStress = Math.min(100.0, Math.max(70.0, STATE.tectonicStress + (Math.random() - 0.5) * 0.6 * factor));
        document.getElementById("tectonic-stress").innerText = `${STATE.tectonicStress.toFixed(2)} GPa`;

        if (Math.random() < 0.05 * factor) {
            STATE.activeVolcanoes = Math.max(380, Math.min(600, STATE.activeVolcanoes + Math.round((Math.random() - 0.5) * 6)));
            document.getElementById("active-volcanoes").innerText = `${STATE.activeVolcanoes} / 1,024`;
        }

        STATE.meanTemp = Math.min(18.0, Math.max(14.0, STATE.meanTemp + (Math.random() - 0.5) * 0.005 * factor));
        document.getElementById("mean-temp").innerText = `${STATE.meanTemp.toFixed(2)} °C`;

        STATE.co2Density = Math.min(450.0, Math.max(350.0, STATE.co2Density + (Math.random() - 0.48) * 0.02 * factor));
        document.getElementById("co2-density").innerText = `${STATE.co2Density.toFixed(1)} ppm`;

        STATE.kardashevScale = Math.min(1.0, STATE.kardashevScale + 0.0000001 * factor);
        document.getElementById("kardashev-val").innerText = STATE.kardashevScale.toFixed(6);

        STATE.maritimeFleet = Math.round(STATE.maritimeFleet + (Math.random() - 0.5) * 4 * factor);
        STATE.airCargo = Math.round(STATE.airCargo + (Math.random() - 0.5) * 8 * factor);
        document.getElementById("maritime-fleet").innerText = `${STATE.maritimeFleet.toLocaleString()} Ships`;
        document.getElementById("air-cargo").innerText = `${STATE.airCargo.toLocaleString()} Units/h`;

        updateSeismicData();
        updateConsumptionData();
        updateClimateGridCells();
    }

    function updateSeismicData() {
        STATE.seismicHistory.shift();
        const base = STATE.tectonicStress - 60; 
        const wave = base + (Math.sin(STATE.epoch * 2.5) * 12) + (Math.random() - 0.5) * 15;
        STATE.seismicHistory.push(Math.max(2, Math.min(48, wave)));
    }

    function updateConsumptionData() {
        STATE.consumptionHistory.shift();
        const last = STATE.consumptionHistory[STATE.consumptionHistory.length - 1];
        const next = last + (Math.random() - 0.5) * 3 + (Math.sin(STATE.epoch * 0.5) * 1.5);
        STATE.consumptionHistory.push(Math.max(5, Math.min(45, next)));
    }

    function updateClimateGridCells() {
        const cells = climateGridContainer.children;
        const changeCount = Math.floor(Math.random() * 8) + 1;
        for (let i = 0; i < changeCount; i++) {
            const idx = Math.floor(Math.random() * cells.length);
            const cell = cells[idx];
            let val = parseFloat(cell.dataset.val);
            val = Math.max(0, Math.min(1, val + (Math.random() - 0.5) * 0.15));
            cell.dataset.val = val;
            cell.style.backgroundColor = getClimateColor(val);
        }
    }

    function animateSatellitesAndStorms() {
        STATE.satellites.forEach(sat => {
            if (!STATE.isPaused) {
                sat.angle += sat.speed * STATE.speedMultiplier;
            }
            const x = 400 + sat.radius * Math.cos(sat.angle);
            const y = 250 + sat.radius * Math.sin(sat.angle) * 0.4; 
            const node = document.getElementById(`sat-node-${sat.id}`);
            if (node) {
                node.setAttribute("cx", x);
                node.setAttribute("cy", y);
            }
        });

        const weatherGroup = document.getElementById("weather-group");
        weatherGroup.innerHTML = '';
        STATE.storms.forEach(storm => {
            if (!STATE.isPaused) {
                storm.x += storm.speedX * STATE.speedMultiplier;
                storm.y += storm.speedY * STATE.speedMultiplier;

                if (storm.x < 100 || storm.x > 700) storm.speedX *= -1;
                if (storm.y < 50 || storm.y > 450) storm.speedY *= -1;
            }

            const stormCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            stormCircle.setAttribute("cx", storm.x);
            stormCircle.setAttribute("cy", storm.y);
            stormCircle.setAttribute("class", "storm-node");
            weatherGroup.appendChild(stormCircle);
        });
    }

    function startSimulationLoops() {
        setInterval(updateSimulationData, 200);

        setInterval(() => {
            if (STATE.isPaused) return;
            addTerminalLine();
        }, 3500);

        setInterval(() => {
            if (STATE.isPaused) return;
            addEventLog();
            updateVolcanoList();
        }, 5000);

        setInterval(() => {
            const footerTime = document.getElementById("footer-time");
            const now = new Date();
            footerTime.innerText = `UTC: ${now.toISOString().replace('T', ' ').substring(0, 19)}`;
        }, 1000);
    }

    function addTerminalLine() {
        const lineText = terminalLogs[Math.floor(Math.random() * terminalLogs.length)];
        const lineDiv = document.createElement("div");
        lineDiv.className = "term-line";
        lineDiv.innerText = `> ${lineText}`;
        terminalOutput.appendChild(lineDiv);
        if (terminalOutput.children.length > 25) {
            terminalOutput.removeChild(terminalOutput.firstChild);
        }
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function addEventLog() {
        const actions = [
            "Trade Convoy Alpha-4 diverted to avoid turbulence zone",
            "Atmospheric scrubber system online in Sector 21-C",
            "Seismic stabilization anchors deployed at oceanic trench 9",
            "Hydro-electric throughput optimized (+4.2 GW)",
            "Agricultural transport shuttle landed at hub Delta-2",
            "Deep space array detected minor high-energy solar flux"
        ];
        const lineText = actions[Math.floor(Math.random() * actions.length)];
        const lineDiv = document.createElement("div");
        lineDiv.className = "stream-line";
        lineDiv.innerText = lineText;
        eventLogStream.appendChild(lineDiv);
        if (eventLogStream.children.length > 5) {
            eventLogStream.removeChild(eventLogStream.firstChild);
        }
        eventLogStream.scrollTop = eventLogStream.scrollHeight;
    }

    function updateVolcanoList() {
        const list = document.getElementById("volcano-list");
        list.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const li = document.createElement("li");
            const statusType = Math.random();
            let statusSpan = '';
            if (statusType < 0.2) {
                statusSpan = '<span class="text-alert">CRITICAL</span>';
            } else if (statusType < 0.5) {
                statusSpan = '<span class="text-warning">WARNING</span>';
            } else {
                statusSpan = '<span class="text-muted">STEADY</span>';
            }
            const sector = sectors[Math.floor(Math.random() * sectors.length)];
            const name = volcanoNames[Math.floor(Math.random() * volcanoNames.length)];
            li.innerHTML = `${statusSpan} ${sector} // ${name}`;
            list.appendChild(li);
        }
    }

    function animate() {
        animateSatellitesAndStorms();
        drawSeismicChart();
        drawConsumptionChart();
        animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        drawSeismicChart();
        drawConsumptionChart();
    });

    init();
})();