/* ============================================================
   NOVA MERIDIAN — Bridge Command Console
   Interactive Systems & Animations
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       UTILITY HELPERS
       ---------------------------------------------------------- */
    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(randomBetween(min, max + 1));
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function formatTime(hours, minutes, seconds) {
        return String(hours).padStart(2, '0') + ':' +
               String(minutes).padStart(2, '0') + ':' +
               String(seconds).padStart(2, '0');
    }

    function formatNumber(num, decimals) {
        return num.toFixed(decimals);
    }

    /* ----------------------------------------------------------
       STAR FIELD GENERATION
       ---------------------------------------------------------- */
    function createStarField() {
        const farLayer = document.getElementById('starFieldFar');
        const midLayer = document.getElementById('starFieldMid');
        const nearLayer = document.getElementById('starFieldNear');

        if (!farLayer || !midLayer || !nearLayer) return;

        function addStars(layer, count, sizeRange, opacityRange) {
            for (let i = 0; i < count; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                const size = randomBetween(sizeRange[0], sizeRange[1]);
                const opacity = randomBetween(opacityRange[0], opacityRange[1]);
                star.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    top: ${randomBetween(0, 85)}%;
                    left: ${randomBetween(0, 100)}%;
                    opacity: ${opacity};
                    box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5});
                `;
                layer.appendChild(star);
            }
        }

        addStars(farLayer, 60, [0.5, 1.5], [0.3, 0.6]);
        addStars(midLayer, 40, [1, 2.5], [0.5, 0.8]);
        addStars(nearLayer, 15, [1.5, 3], [0.7, 1]);

        const parallaxStars = [
            { layer: farLayer, speed: 0.02 },
            { layer: midLayer, speed: 0.05 },
            { layer: nearLayer, speed: 0.1 }
        ];

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animateParallax() {
            currentX = lerp(currentX, mouseX, 0.02);
            currentY = lerp(currentY, mouseY, 0.02);

            parallaxStars.forEach(function (p) {
                p.layer.style.transform = 'translate(' + (currentX * p.speed * 30) + 'px, ' + (currentY * p.speed * 20) + 'px)';
            });

            requestAnimationFrame(animateParallax);
        }

        animateParallax();
    }

    /* ----------------------------------------------------------
       CHROME GRID FLOOR GENERATION
       ---------------------------------------------------------- */
    function createChromeGrid() {
        const horizontalContainer = document.getElementById('gridHorizontal');
        const verticalContainer = document.getElementById('gridVertical');

        if (!horizontalContainer || !verticalContainer) return;

        for (let i = 0; i < 12; i++) {
            const line = document.createElement('div');
            line.className = 'grid-h-line';
            line.style.top = (i * (100 / 11)) + '%';
            line.style.opacity = 0.3 + (Math.abs(i - 6) < 3 ? 0.4 : 0);
            horizontalContainer.appendChild(line);
        }

        for (let i = 0; i < 40; i++) {
            const line = document.createElement('div');
            line.className = 'grid-v-line';
            line.style.left = (i * (100 / 39)) + '%';
            const centerDist = Math.abs(i - 19.5) / 19.5;
            line.style.opacity = 1 - centerDist * 0.6;
            const baseWidth = 0.5 + (1 - centerDist) * 1.5;
            line.style.width = baseWidth + 'px';
            verticalContainer.appendChild(line);
        }
    }

    /* ----------------------------------------------------------
       CLOCK & STARDATE
       ---------------------------------------------------------- */
    function initClock() {
        const clockEl = document.getElementById('clock');
        const stardateEl = document.getElementById('stardate');
        const etaEl = document.getElementById('eta');

        if (!clockEl) return;

        let seconds = 14 * 3600 + 25 * 42 + 30;
        let stardateBase = 78432.6;
        let etaSeconds = 4 * 3600 + 32 * 17;

        function update() {
            seconds++;
            const h = Math.floor(seconds / 3600) % 24;
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            clockEl.textContent = formatTime(h, m, s);

            stardateBase += 0.0003;
            if (stardateEl) {
                stardateEl.textContent = formatNumber(stardateBase, 1);
            }

            if (etaEl && etaSeconds > 0) {
                etaSeconds--;
                const eh = Math.floor(etaSeconds / 3600);
                const em = Math.floor((etaSeconds % 3600) / 60);
                const es = etaSeconds % 60;
                etaEl.textContent = formatTime(eh, em, es);
            }
        }

        setInterval(update, 1000);
    }

    /* ----------------------------------------------------------
       NAVIGATION COORDINATES (Live Drift)
       ---------------------------------------------------------- */
    function initNavigationDrift() {
        const coordX = document.getElementById('coordX');
        const coordY = document.getElementById('coordY');
        const coordZ = document.getElementById('coordZ');
        const heading = document.getElementById('heading');
        const warp = document.getElementById('warpFactor');

        if (!coordX || !coordY || !coordZ || !heading) return;

        let x = 482.73;
        let y = -129.08;
        let z = 847.21;
        let h = 45.7;

        function update() {
            x += randomBetween(-0.15, 0.15);
            y += randomBetween(-0.08, 0.08);
            z += randomBetween(-0.12, 0.12);
            h += randomBetween(-0.2, 0.2);
            if (h >= 360) h -= 360;
            if (h < 0) h += 360;

            coordX.textContent = formatNumber(x, 2);
            coordY.textContent = formatNumber(y, 2);
            coordZ.textContent = formatNumber(z, 2);
            heading.textContent = formatNumber(h, 1) + '°';
        }

        setInterval(update, 2000);

        if (warp) {
            setInterval(function () {
                const factor = Math.floor(randomBetween(3, 6));
                warp.textContent = 'FACTOR ' + factor;
            }, 8000);
        }
    }

    /* ----------------------------------------------------------
       WAVEFORM CANVAS — Comms Frequency Display
       ---------------------------------------------------------- */
    function initWaveform() {
        const canvas = document.getElementById('waveformCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        function resize() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        resize();
        window.addEventListener('resize', resize);

        let time = 0;
        const waveData = [];
        const dataPoints = 200;

        for (let i = 0; i < dataPoints; i++) {
            waveData.push(0);
        }

        function draw() {
            const width = canvas.getBoundingClientRect().width;
            const height = canvas.getBoundingClientRect().height;

            ctx.clearRect(0, 0, width, height);

            time += 0.05;

            waveData.shift();
            const signal = Math.sin(time * 3) * 0.3 +
                          Math.sin(time * 7) * 0.15 +
                          Math.sin(time * 13) * 0.08 +
                          randomBetween(-0.1, 0.1);
            waveData.push(signal);

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
            ctx.shadowBlur = 4;

            for (let i = 0; i < dataPoints; i++) {
                const x = (i / (dataPoints - 1)) * width;
                const y = height / 2 + waveData[i] * (height * 0.35);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 0, 170, 0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < dataPoints; i++) {
                const x = (i / (dataPoints - 1)) * width;
                const y = height / 2 + waveData[i] * (height * 0.35) + 3;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            requestAnimationFrame(draw);
        }

        draw();
    }

    /* ----------------------------------------------------------
       FREQUENCY VALUE UPDATER
       ---------------------------------------------------------- */
    function initFrequencyUpdater() {
        const freqValue = document.getElementById('freqValue');
        if (!freqValue) return;

        let freq = 142.75;

        setInterval(function () {
            freq += randomBetween(-0.5, 0.5);
            if (freq < 140) freq = 140;
            if (freq > 145) freq = 145;
            freqValue.textContent = formatNumber(freq, 2) + ' MHz';
        }, 1500);
    }

    /* ----------------------------------------------------------
       SHIELD INTEGRITY ANIMATION
       ---------------------------------------------------------- */
    function initShieldSystem() {
        const shieldPercent = document.getElementById('shieldPercent');
        const shieldSegments = [
            document.getElementById('shieldN'),
            document.getElementById('shieldNE'),
            document.getElementById('shieldE'),
            document.getElementById('shieldSE'),
            document.getElementById('shieldS'),
            document.getElementById('shieldSW'),
            document.getElementById('shieldW'),
            document.getElementById('shieldNW')
        ];

        let shieldValue = 94;

        function updateShields() {
            shieldValue += randomBetween(-1.5, 1);
            if (shieldValue > 100) shieldValue = 100;
            if (shieldValue < 75) shieldValue = 75;

            if (shieldPercent) {
                shieldPercent.textContent = Math.round(shieldValue) + '%';
                if (shieldValue < 85) {
                    shieldPercent.style.color = '#ffaa00';
                    shieldPercent.style.textShadow = '0 0 7px rgba(255, 170, 0, 0.4)';
                } else if (shieldValue < 75) {
                    shieldPercent.style.color = '#ff2244';
                    shieldPercent.style.textShadow = '0 0 7px rgba(255, 34, 68, 0.4)';
                } else {
                    shieldPercent.style.color = '';
                    shieldPercent.style.textShadow = '';
                }
            }

            shieldSegments.forEach(function (seg) {
                if (!seg) return;
                const span = seg.querySelector('span');
                if (!span) return;
                let segValue = shieldValue + randomBetween(-8, 5);
                if (segValue > 100) segValue = 100;
                if (segValue < 60) segValue = 60;
                span.textContent = Math.round(segValue) + '%';

                if (segValue < 80) {
                    span.style.color = '#ffaa00';
                } else if (segValue < 70) {
                    span.style.color = '#ff2244';
                } else {
                    span.style.color = '';
                }
            });
        }

        setInterval(updateShields, 3000);
    }

    /* ----------------------------------------------------------
       WEAPONS SYSTEM — Charge Bars & Target Data
       ---------------------------------------------------------- */
    function initWeaponsSystem() {
        const weapons = [
            { bar: document.getElementById('phaserA'), status: document.getElementById('phaserAStatus'), charge: 92, type: 'ready' },
            { bar: document.getElementById('phaserB'), status: document.getElementById('phaserBStatus'), charge: 87, type: 'ready' },
            { bar: document.getElementById('torpedo1'), status: document.getElementById('torpedo1Status'), charge: 100, type: 'loaded' },
            { bar: document.getElementById('torpedo2'), status: document.getElementById('torpedo2Status'), charge: 65, type: 'loading' },
            { bar: document.getElementById('pulseCannon'), status: document.getElementById('pulseCannonStatus'), charge: 45, type: 'charging' }
        ];

        const targetRange = document.getElementById('targetRange');
        const targetVelocity = document.getElementById('targetVelocity');
        const targetSignature = document.getElementById('targetSignature');

        let rangeVal = 4523;
        let velocityVal = 127;
        let sigVal = 0.73;

        function updateWeapons() {
            weapons.forEach(function (w) {
                if (!w.bar) return;

                if (w.type === 'charging' || w.type === 'loading') {
                    w.charge += randomBetween(0.5, 2);
                    if (w.charge >= 100) {
                        w.charge = 100;
                        w.type = w.bar.id.includes('torpedo') ? 'loaded' : 'ready';
                        if (w.status) {
                            w.status.textContent = w.type.toUpperCase();
                            w.status.classList.remove('charging');
                        }
                    }
                } else {
                    w.charge += randomBetween(-2, 1.5);
                    if (w.charge > 100) w.charge = 100;
                    if (w.charge < 70) w.charge = 70;
                }

                w.bar.style.width = w.charge + '%';
            });

            rangeVal += randomBetween(-50, 50);
            if (rangeVal < 2000) rangeVal = 2000;
            if (rangeVal > 8000) rangeVal = 8000;

            velocityVal += randomBetween(-5, 5);
            if (velocityVal < 50) velocityVal = 50;
            if (velocityVal > 300) velocityVal = 300;

            sigVal += randomBetween(-0.05, 0.05);
            if (sigVal < 0.3) sigVal = 0.3;
            if (sigVal > 1.5) sigVal = 1.5;

            if (targetRange) targetRange.textContent = Math.round(rangeVal) + ' km';
            if (targetVelocity) targetVelocity.textContent = Math.round(velocityVal) + ' km/s';
            if (targetSignature) targetSignature.textContent = formatNumber(sigVal, 2);
        }

        setInterval(updateWeapons, 2500);
    }

    /* ----------------------------------------------------------
       TELEMETRY — System Readouts
       ---------------------------------------------------------- */
    function initTelemetry() {
        const coreTemp = document.getElementById('coreTemp');
        const reactorOutput = document.getElementById('reactorOutput');
        const gravity = document.getElementById('gravity');
        const o2Level = document.getElementById('o2Level');

        let temp = 2847;
        let reactor = 7.2;
        let grav = 1.02;
        let o2 = 21.3;

        function update() {
            temp += randomInt(-30, 30);
            if (temp < 2600) temp = 2600;
            if (temp > 3200) temp = 3200;

            reactor += randomBetween(-0.3, 0.3);
            if (reactor < 5.5) reactor = 5.5;
            if (reactor > 9.5) reactor = 9.5;

            grav += randomBetween(-0.02, 0.02);
            if (grav < 0.95) grav = 0.95;
            if (grav > 1.08) grav = 1.08;

            o2 += randomBetween(-0.1, 0.1);
            if (o2 < 20) o2 = 20;
            if (o2 > 22.5) o2 = 22.5;

            if (coreTemp) coreTemp.textContent = temp.toLocaleString() + '°K';
            if (reactorOutput) reactorOutput.textContent = formatNumber(reactor, 1) + ' TW';
            if (gravity) gravity.textContent = formatNumber(grav, 2) + ' G';
            if (o2Level) o2Level.textContent = formatNumber(o2, 1) + '%';
        }

        setInterval(update, 3000);
    }

    /* ----------------------------------------------------------
       SHIP LOG — Live Entries
       ---------------------------------------------------------- */
    function initShipLog() {
        const log = document.getElementById('shipLog');
        if (!log) return;

        const logMessages = [
            { msg: 'Routine sensor calibration complete', type: 'info' },
            { msg: 'Warp field stability at 99.7%', type: 'success' },
            { msg: 'Minor graviton flux detected — sector 7-G', type: 'warn' },
            { msg: 'Shields holding — no anomalies', type: 'success' },
            { msg: 'Long-range sensors picking up subspace chatter', type: 'info' },
            { msg: 'Navigation computer updating star charts', type: 'info' },
            { msg: 'Life support systems operating within parameters', type: 'success' },
            { msg: 'Micro-meteorite detected — shields deflected', type: 'warn' },
            { msg: 'Communication array recalibrated', type: 'info' },
            { msg: 'Tachyon sweep negative — no cloaked vessels', type: 'success' },
            { msg: 'Deuterium reserves at 84.2%', type: 'info' },
            { msg: 'Infrared anomaly detected — analyzing', type: 'warn' },
            { msg: 'Duty shift rotation in T-minus 47 minutes', type: 'info' },
            { msg: 'Structural integrity field nominal', type: 'success' },
            { msg: 'Subspace relay station delta-7 signal acquired', type: 'info' },
            { msg: 'Thermal variance in cargo bay 3 — monitoring', type: 'warn' },
            { msg: 'Plasma conduit pressure within safe limits', type: 'success' },
            { msg: 'Astrometric scan updating — 147 new objects', type: 'info' }
        ];

        let logIndex = 0;
        let logCounter = 26;

        function addLogEntry() {
            const entry = logMessages[logIndex % logMessages.length];
            logIndex++;

            const now = new Date();
            const timeStr = formatTime(now.getHours(), now.getMinutes(), now.getSeconds());

            const entryEl = document.createElement('div');
            entryEl.className = 'log-entry';
            entryEl.innerHTML = '<span class="log-time">[' + timeStr + ']</span><span class="log-msg ' + entry.type + '">' + entry.msg + '</span>';

            log.appendChild(entryEl);
            log.scrollTop = log.scrollHeight;

            while (log.children.length > 30) {
                log.removeChild(log.firstChild);
            }
        }

        setInterval(addLogEntry, 6000);
    }

    /* ----------------------------------------------------------
       COMMS CHANNEL INTERACTION
       ---------------------------------------------------------- */
    function initCommsChannels() {
        const channels = document.querySelectorAll('.channel');

        channels.forEach(function (channel) {
            channel.addEventListener('click', function () {
                const isActive = this.classList.contains('active');

                if (!isActive) {
                    this.classList.add('active');
                    const indicator = this.querySelector('.channel-indicator');
                    if (indicator) {
                        indicator.style.background = '';
                        indicator.style.boxShadow = '';
                    }
                } else {
                    this.classList.remove('active');
                }
            });
        });
    }

    /* ----------------------------------------------------------
       SENSOR CONTACT COUNT & THREAT LEVEL
       ---------------------------------------------------------- */
    function initSensorUpdates() {
        const contactCount = document.getElementById('contactCount');
        const threatLevel = document.getElementById('threatLevel');

        if (!contactCount || !threatLevel) return;

        let contacts = 3;
        let threatState = 0;

        const threatLabels = ['LOW', 'MODERATE', 'HIGH'];
        const threatClasses = ['threat-low', 'threat-med', 'threat-high'];

        setInterval(function () {
            if (Math.random() > 0.7) {
                contacts += randomInt(-1, 2);
                if (contacts < 1) contacts = 1;
                if (contacts > 8) contacts = 8;
                contactCount.textContent = contacts;
            }

            if (Math.random() > 0.85) {
                threatState = randomInt(0, 2);
                threatLevel.textContent = threatLabels[threatState];
                threatLevel.className = 'sensor-value ' + threatClasses[threatState];
            }
        }, 5000);
    }

    /* ----------------------------------------------------------
       QUICK ACTION BUTTONS
       ---------------------------------------------------------- */
    function initActionButtons() {
        const redAlertBtn = document.getElementById('btnRedAlert');
        const shieldBoostBtn = document.getElementById('btnShieldBoost');
        const scanBtn = document.getElementById('btnScan');
        const hailBtn = document.getElementById('btnHail');

        const redAlertOverlay = document.getElementById('redAlertOverlay');
        const redAlertText = document.getElementById('redAlertText');
        const shipLog = document.getElementById('shipLog');

        let redAlertActive = false;

        function addLogMessage(text, type) {
            if (!shipLog) return;
            const now = new Date();
            const timeStr = formatTime(now.getHours(), now.getMinutes(), now.getSeconds());
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = '<span class="log-time">[' + timeStr + ']</span><span class="log-msg ' + type + '">' + text + '</span>';
            shipLog.appendChild(entry);
            shipLog.scrollTop = shipLog.scrollHeight;
            while (shipLog.children.length > 30) {
                shipLog.removeChild(shipLog.firstChild);
            }
        }

        if (redAlertBtn) {
            redAlertBtn.addEventListener('click', function () {
                redAlertActive = !redAlertActive;

                if (redAlertActive) {
                    if (redAlertOverlay) redAlertOverlay.classList.add('active');
                    if (redAlertText) redAlertText.classList.add('active');
                    addLogMessage('RED ALERT ACTIVATED — All hands to battle stations', 'alert');
                } else {
                    if (redAlertOverlay) redAlertOverlay.classList.remove('active');
                    if (redAlertText) redAlertText.classList.remove('active');
                    addLogMessage('Red alert cancelled — resuming normal operations', 'info');
                }
            });
        }

        if (shieldBoostBtn) {
            shieldBoostBtn.addEventListener('click', function () {
                addLogMessage('Shield boost engaged — redirecting auxiliary power', 'success');

                const shieldPercent = document.getElementById('shieldPercent');
                if (shieldPercent) {
                    shieldPercent.style.color = '#ff00aa';
                    shieldPercent.style.textShadow = '0 0 15px rgba(255, 0, 170, 0.6)';
                    setTimeout(function () {
                        shieldPercent.style.color = '';
                        shieldPercent.style.textShadow = '';
                    }, 3000);
                }
            });
        }

        if (scanBtn) {
            scanBtn.addEventListener('click', function () {
                addLogMessage('Initiating deep space sensor sweep...', 'info');
                setTimeout(function () {
                    addLogMessage('Deep space scan complete — no hostile contacts detected', 'success');
                }, 3000);
            });
        }

        if (hailBtn) {
            hailBtn.addEventListener('click', function () {
                addLogMessage('Opening hailing frequencies on all channels...', 'info');
                setTimeout(function () {
                    addLogMessage('No response from unknown contact — continuing to monitor', 'warn');
                }, 4000);
            });
        }
    }

    /* ----------------------------------------------------------
       TARGET CONTACT MOVEMENT
       ---------------------------------------------------------- */
    function initTargetContact() {
        const contact = document.getElementById('targetContact');
        if (!contact) return;

        let topPos = 35;
        let leftPos = 65;

        function update() {
            topPos += randomBetween(-1.5, 1.5);
            leftPos += randomBetween(-1, 1);

            if (topPos < 20) topPos = 20;
            if (topPos > 55) topPos = 55;
            if (leftPos < 55) leftPos = 55;
            if (leftPos > 80) leftPos = 80;

            contact.style.top = topPos + '%';
            contact.style.left = leftPos + '%';
        }

        setInterval(update, 2000);
    }

    /* ----------------------------------------------------------
       RADAR BLIP ANIMATION ENHANCEMENT
       ---------------------------------------------------------- */
    function initRadarBlips() {
        const radar = document.getElementById('radarSweep');
        if (!radar) return;

        setInterval(function () {
            if (Math.random() > 0.6) {
                const blip = document.createElement('div');
                blip.className = 'radar-blip';
                blip.style.top = randomBetween(15, 85) + '%';
                blip.style.left = randomBetween(15, 85) + '%';
                blip.style.opacity = randomBetween(0.4, 0.8);
                radar.appendChild(blip);

                setTimeout(function () {
                    if (blip.parentNode) {
                        blip.parentNode.removeChild(blip);
                    }
                }, 4000);
            }
        }, 2500);
    }

    /* ----------------------------------------------------------
       TARGET-LOCK RETICLE — Lock-on Effect
       ---------------------------------------------------------- */
    function initTargetLock() {
        const reticle = document.getElementById('targetReticle');
        if (!reticle) return;

        let isLocked = false;

        setInterval(function () {
            if (!isLocked && Math.random() > 0.6) {
                isLocked = true;
                reticle.style.boxShadow = '0 0 20px rgba(255, 0, 170, 0.4), inset 0 0 20px rgba(255, 0, 170, 0.1)';
                reticle.style.border = '1px solid rgba(255, 0, 170, 0.3)';
                reticle.style.borderRadius = '50%';

                setTimeout(function () {
                    isLocked = false;
                    reticle.style.boxShadow = '';
                    reticle.style.border = '';
                }, 5000);
            }
        }, 7000);
    }

    /* ----------------------------------------------------------
       POWER DISTRIBUTION ANIMATION
       ---------------------------------------------------------- */
    function initPowerDistribution() {
        const segments = document.querySelectorAll('.power-segment');
        if (segments.length === 0) return;

        const baseWidths = Array.from(segments).map(function (s) {
            return parseFloat(s.style.width) || 20;
        });

        setInterval(function () {
            segments.forEach(function (seg, i) {
                const variation = randomBetween(-3, 3);
                let newWidth = baseWidths[i] + variation;
                if (newWidth < 5) newWidth = 5;
                if (newWidth > 40) newWidth = 40;
                seg.style.width = newWidth + '%';
            });
        }, 4000);
    }

    /* ----------------------------------------------------------
       STAR MAP — Player Ship Drift
       ---------------------------------------------------------- */
    function initStarMapDrift() {
        const playerShip = document.querySelector('.player-ship');
        const waypoint = document.querySelector('.waypoint');

        if (!playerShip || !waypoint) return;

        let playerTop = 65;
        let playerLeft = 50;
        const wpTop = 25;
        const wpLeft = 40;

        function update() {
            const dx = wpLeft - playerLeft;
            const dy = wpTop - playerTop;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 2) {
                playerLeft += (dx / dist) * randomBetween(0.1, 0.5);
                playerTop += (dy / dist) * randomBetween(0.1, 0.5);
            } else {
                playerLeft = wpLeft + randomBetween(-0.5, 0.5);
                playerTop = wpTop + randomBetween(-0.5, 0.5);
            }

            playerShip.style.top = playerTop + '%';
            playerShip.style.left = playerLeft + '%';
        }

        setInterval(update, 2000);
    }

    /* ----------------------------------------------------------
       HULL STATUS ANIMATION
       ---------------------------------------------------------- */
    function initHullStatus() {
        const hullFills = document.querySelectorAll('.hull-fill');
        const hullValues = document.querySelectorAll('.hull-value');

        if (hullFills.length === 0) return;

        const baseValues = [96, 91, 78, 84];

        setInterval(function () {
            hullFills.forEach(function (fill, i) {
                if (!hullValues[i]) return;
                let newVal = baseValues[i] + randomBetween(-1.5, 1);
                if (newVal > 100) newVal = 100;
                if (newVal < 60) newVal = 60;
                fill.style.width = newVal + '%';
                hullValues[i].textContent = Math.round(newVal) + '%';
            });
        }, 5000);
    }

    /* ----------------------------------------------------------
       TELEMETRY BAR ANIMATION
       ---------------------------------------------------------- */
    function initTelemetryBars() {
        const fills = document.querySelectorAll('.telemetry-fill');
        if (fills.length === 0) return;

        const baseWidths = [62, 72, 99, 51, 85, 100];

        setInterval(function () {
            fills.forEach(function (fill, i) {
                let newWidth = baseWidths[i] + randomBetween(-3, 3);
                if (newWidth > 100) newWidth = 100;
                if (newWidth < 20) newWidth = 20;
                fill.style.width = newWidth + '%';
            });
        }, 3500);
    }

    /* ----------------------------------------------------------
       SIGNAL STRENGTH ANIMATION
       ---------------------------------------------------------- */
    function initSignalBars() {
        const bars = document.querySelectorAll('.signal-bar');
        if (bars.length === 0) return;

        setInterval(function () {
            bars.forEach(function (bar, i) {
                const shouldBeActive = i >= 3 ? Math.random() > 0.2 : Math.random() > 0.5;
                if (shouldBeActive) {
                    bar.classList.add('active');
                } else {
                    bar.classList.remove('active');
                }
            });
        }, 2000);
    }

    /* ----------------------------------------------------------
       VIEWPORT CROSSHAIR — Subtle Breathing
       ---------------------------------------------------------- */
    function initCrosshairBreathing() {
        const crosshair = document.querySelector('.hud-crosshair');
        if (!crosshair) return;

        let time = 0;

        function breathe() {
            time += 0.02;
            const scale = 1 + Math.sin(time) * 0.05;
            const opacity = 0.25 + Math.sin(time) * 0.1;
            crosshair.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
            crosshair.style.opacity = opacity;
            requestAnimationFrame(breathe);
        }

        breathe();
    }

    /* ----------------------------------------------------------
       INITIALIZATION
       ---------------------------------------------------------- */
    function init() {
        createStarField();
        createChromeGrid();
        initClock();
        initNavigationDrift();
        initWaveform();
        initFrequencyUpdater();
        initShieldSystem();
        initWeaponsSystem();
        initTelemetry();
        initShipLog();
        initCommsChannels();
        initSensorUpdates();
        initActionButtons();
        initTargetContact();
        initRadarBlips();
        initTargetLock();
        initPowerDistribution();
        initStarMapDrift();
        initHullStatus();
        initTelemetryBars();
        initSignalBars();
        initCrosshairBreathing();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();