(function () {
    const clockHour = document.getElementById("hour-hand");
    const clockMinute = document.getElementById("minute-hand");
    const clockSecond = document.getElementById("second-hand");
    const clockDigital = document.getElementById("digital-clock");

    const posterCarousel = document.getElementById("poster-carousel");
    const posters = posterCarousel.querySelectorAll(".poster");
    let activePosterIndex = 0;

    const fuelNeedle = document.getElementById("fuel-needle");
    const powerNeedle = document.getElementById("power-needle");
    const tempNeedle = document.getElementById("temp-needle");

    const tubeA = document.getElementById("tube-a");
    const tubeB = document.getElementById("tube-b");
    const tubeC = document.getElementById("tube-c");

    const mapViewport = document.getElementById("map-viewport");
    const mapGridOverlay = document.querySelector(".map-grid-overlay");
    const topographicalVectors = document.querySelector(".topographical-vectors");
    const unitTokens = document.querySelectorAll(".unit-token");
    const reticle = document.getElementById("reticle");

    const btnGridToggle = document.getElementById("btn-grid-toggle");
    const btnRadarSweep = document.getElementById("btn-radar-sweep");
    const btnResetTokens = document.getElementById("btn-reset-tokens");
    const zoomKnob = document.getElementById("zoom-knob");

    const radioLog = document.getElementById("radio-log");
    const btnMorse = document.getElementById("btn-morse");
    const btnClear = document.getElementById("btn-clear");
    const radioContainer = document.querySelector(".radio-intercept");

    const sliderMunitions = document.getElementById("slider-munitions");
    const barMunitions = document.getElementById("bar-munitions");
    const valMunitions = document.getElementById("val-munitions");

    const sliderRockets = document.getElementById("slider-rockets");
    const barRockets = document.getElementById("bar-rockets");
    const valRockets = document.getElementById("val-rockets");

    const sliderOil = document.getElementById("slider-oil");
    const barOil = document.getElementById("bar-oil");
    const valOil = document.getElementById("val-oil");

    const klaxonCover = document.getElementById("klaxon-cover");
    const klaxonToggle = document.getElementById("klaxon-toggle");
    const klaxonContainer = document.querySelector(".klaxon-panel");

    const initialTokenPositions = {
        "unit-alpha": { top: "180px", left: "320px" },
        "unit-beta": { top: "320px", left: "180px" },
        "unit-gamma": { top: "120px", left: "620px" },
        "unit-omega": { top: "420px", left: "780px" }
    };

    const militaryMessages = [
        "ENCRYPTED WIRELESS RECEIVED: CONVOY OMEGA EN ROUTE TO POINT BAKER.",
        "INTELLIGENCE REPORT: ENEMY RECONNAISSANCE AIRCRAFT SPOTTED AT GRID 4-F.",
        "KRIEGSMARINE U-BOAT ACTIVITY REGISTERED 50 MILES NORTH-WEST.",
        "STRATEGIC ADVISORY: HEAVY FOG REDUCING AIR RECONNAISSANCE TO ZERO.",
        "PRODUCTION ALERT: METALLURGY QUOTA COMPLETED FOR THIRD QUARTER.",
        "SABOTAGE DETECTED: WIRELESS RELAY STATION BRAVO IS OFFLINE.",
        "WEATHER DIVISION: SNOW ACCUMULATIONS IMPEDING GROUND ADVANCE IN NORTHERN SECTOR.",
        "BALLISTIC TRAJECTORY COORDINATED FOR TARGET SECTOR 12.",
        "DIPLOMATIC CABLE INTERCEPTED: SUSPICIOUS ENVOY ACTIVITY IN GENEVA.",
        "REINFORCEMENTS ASSIGNED: FORTY TANK BRIGADES TRANSFERRED TO EAST FRONT."
    ];

    let isDraggingToken = false;
    let activeDragToken = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    let zoomLevel = 1;
    let knobRotation = 0;
    let isCoverOpen = false;
    let isAlarmActive = false;
    let isMorseActive = true;

    function updateChronograph() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
        const minuteDegrees = minutes * 6;
        const secondDegrees = seconds * 6;

        clockHour.style.transform = `rotate(${hourDegrees}deg)`;
        clockMinute.style.transform = `rotate(${minuteDegrees}deg)`;
        clockSecond.style.transform = `rotate(${secondDegrees}deg)`;

        const formatDigit = (num) => String(num).padStart(2, "0");
        clockDigital.textContent = `${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(seconds)}`;
    }

    function rotatePropagandaPosters() {
        posters[activePosterIndex].classList.remove("active");
        activePosterIndex = (activePosterIndex + 1) % posters.length;
        posters[activePosterIndex].classList.add("active");
    }

    function updateAnalogGauges() {
        const randomFluctuation = () => (Math.random() - 0.5) * 8;
        
        const fuelAngle = -45 + randomFluctuation() * 2;
        const powerAngle = 10 + randomFluctuation() * 4;
        const tempAngle = -20 + randomFluctuation() * 5;

        fuelNeedle.style.transform = `rotate(${fuelAngle}deg)`;
        powerNeedle.style.transform = `rotate(${powerAngle}deg)`;
        tempNeedle.style.transform = `rotate(${tempAngle}deg)`;
    }

    function flickerVacuumTubes() {
        const tubes = [tubeA, tubeB, tubeC];
        tubes.forEach(tube => {
            if (Math.random() > 0.3) {
                tube.classList.add("glowing");
            } else {
                tube.classList.remove("glowing");
            }
        });
    }

    function generateRadioLog() {
        if (!isMorseActive) return;

        radioContainer.classList.add("active-signal");
        setTimeout(() => {
            radioContainer.classList.remove("active-signal");
        }, 1500);

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        const randomPhrase = militaryMessages[Math.floor(Math.random() * militaryMessages.length)];

        const entry = document.createElement("div");
        entry.className = "log-entry";
        entry.innerHTML = `<span class="log-time">[${timeStr}]</span> ${randomPhrase}`;
        
        radioLog.appendChild(entry);
        radioLog.scrollTop = radioLog.scrollHeight;
    }

    function initMapInteractions() {
        unitTokens.forEach(token => {
            token.addEventListener("pointerdown", function (e) {
                isDraggingToken = true;
                activeDragToken = token;
                const rect = token.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left - rect.width / 2;
                dragOffsetY = e.clientY - rect.top - rect.height / 2;
                token.setPointerCapture(e.pointerId);

                unitTokens.forEach(t => t.classList.remove("active-focus"));
                const targetX = token.offsetLeft;
                const targetY = token.offsetTop;
                positionTargetReticle(targetX, targetY, token.querySelector(".unit-id").textContent);
            });

            token.addEventListener("pointermove", function (e) {
                if (!isDraggingToken || activeDragToken !== token) return;

                const viewportRect = mapViewport.getBoundingClientRect();
                let x = e.clientX - viewportRect.left - dragOffsetX;
                let y = e.clientY - viewportRect.top - dragOffsetY;

                x = Math.max(22, Math.min(viewportRect.width - 22, x));
                y = Math.max(22, Math.min(viewportRect.height - 22, y));

                token.style.left = `${x}px`;
                token.style.top = `${y}px`;

                positionTargetReticle(x, y, token.querySelector(".unit-id").textContent);
            });

            token.addEventListener("pointerup", function (e) {
                if (activeDragToken === token) {
                    isDraggingToken = false;
                    activeDragToken = null;
                    token.releasePointerCapture(e.pointerId);
                }
            });
        });

        mapViewport.addEventListener("click", function (e) {
            if (e.target === mapViewport || e.target.classList.contains("map-grid-overlay") || e.target.tagName === "svg") {
                reticle.classList.remove("active");
            }
        });
    }

    function positionTargetReticle(x, y, labelText) {
        reticle.style.left = `${x}px`;
        reticle.style.top = `${y}px`;
        reticle.querySelector(".reticle-data").textContent = labelText;
        reticle.classList.add("active");
    }

    function resetTokenPositions() {
        unitTokens.forEach(token => {
            const initial = initialTokenPositions[token.id];
            if (initial) {
                token.style.top = initial.top;
                token.style.left = initial.left;
            }
        });
        reticle.classList.remove("active");
    }

    function toggleGridIllumination() {
        const isVisible = mapGridOverlay.style.opacity !== "0";
        mapGridOverlay.style.opacity = isVisible ? "0" : "1";
    }

    function toggleRadarSweep() {
        topographicalVectors.classList.toggle("radar-active");
    }

    function handleZoomKnobRotation() {
        knobRotation = (knobRotation + 45) % 360;
        zoomKnob.style.transform = `rotate(${knobRotation}deg)`;

        if (zoomLevel === 1) {
            zoomLevel = 1.15;
        } else if (zoomLevel === 1.15) {
            zoomLevel = 1.3;
        } else {
            zoomLevel = 1;
        }

        mapViewport.style.transform = `scale(${zoomLevel})`;
        mapViewport.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    }

    function setupProductionSliders() {
        sliderMunitions.addEventListener("input", function () {
            const val = sliderMunitions.value;
            barMunitions.style.width = `${val}%`;
            valMunitions.textContent = `${val}%`;
        });

        sliderRockets.addEventListener("input", function () {
            const val = sliderRockets.value;
            barRockets.style.width = `${val}%`;
            valRockets.textContent = `${val}%`;
        });

        sliderOil.addEventListener("input", function () {
            const val = sliderOil.value;
            barOil.style.width = `${val}%`;
            valOil.textContent = `${val}%`;
        });
    }

    function handleKlaxonCoverClick() {
        isCoverOpen = !isCoverOpen;
        if (isCoverOpen) {
            klaxonCover.classList.add("open");
        } else {
            klaxonCover.classList.remove("open");
            if (isAlarmActive) {
                toggleAlarmState();
            }
        }
    }

    function toggleAlarmState() {
        if (!isCoverOpen) return;
        isAlarmActive = !isAlarmActive;
        if (isAlarmActive) {
            klaxonToggle.classList.add("on");
            klaxonContainer.classList.add("klaxon-active");
            document.body.classList.add("emergency-atmosphere");
        } else {
            klaxonToggle.classList.remove("on");
            klaxonContainer.classList.remove("klaxon-active");
            document.body.classList.remove("emergency-atmosphere");
        }
    }

    function setupRadioControls() {
        btnMorse.addEventListener("click", function () {
            isMorseActive = !isMorseActive;
            btnMorse.classList.toggle("active", isMorseActive);
        });

        btnClear.addEventListener("click", function () {
            radioLog.innerHTML = "";
        });
    }

    function init() {
        updateChronograph();
        setInterval(updateChronograph, 1000);

        setInterval(rotatePropagandaPosters, 6000);

        updateAnalogGauges();
        setInterval(updateAnalogGauges, 1200);

        flickerVacuumTubes();
        setInterval(flickerVacuumTubes, 800);

        generateRadioLog();
        setInterval(generateRadioLog, 5000);

        initMapInteractions();
        setupProductionSliders();
        setupRadioControls();

        btnGridToggle.addEventListener("click", toggleGridIllumination);
        btnRadarSweep.addEventListener("click", toggleRadarSweep);
        btnResetTokens.addEventListener("click", resetTokenPositions);
        zoomKnob.addEventListener("click", handleZoomKnobRotation);

        klaxonCover.addEventListener("click", handleKlaxonCoverClick);
        klaxonToggle.addEventListener("click", toggleAlarmState);
    }

    window.addEventListener("DOMContentLoaded", init);
})();