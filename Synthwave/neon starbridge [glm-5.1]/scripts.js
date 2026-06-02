const PI = Math.PI;
const TAU = PI * 2;

class BridgeConsole {
    constructor() {
        this.time = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
        this.frame = 0;

        this.stardate = 2847.312;
        this.shipTimeSeconds = 0;

        this.navHeading = 247.3;
        this.navPitch = 2.7;
        this.navYaw = -1.4;
        this.warpFactor = 3.7;
        this.navEta = 2 * 3600 + 47 * 60 + 13;

        this.shields = {
            fore: 96, aft: 91, port: 94, stbd: 95,
            dorsal: 93, ventral: 94
        };
        this.shieldPct = 94;
        this.shieldFreq = 247.8;

        this.weapons = {
            phaserA: { charge: 100, status: 'ready' },
            phaserB: { charge: 78, status: 'charging' },
            torpedoFwd: { ammo: 24, max: 24, status: 'ready' },
            torpedoAft: { ammo: 18, max: 24, status: 'ready' },
            missile: { ammo: 8, max: 12, status: 'ready' },
            pd: { status: 'on' }
        };

        this.currentTarget = null;
        this.targetLockProgress = 0;
        this.targetScanAngle = 0;

        this.commsChannel = 7;
        this.signalStrength = 7;
        this.commsFreq = 156.8;

        this.viewportStars = [];
        this.starMapStars = [];
        this.gridOffset = 0;

        this.reactorOutput = 87;
        this.hullTemp = 127;
        this.radiation = 0.3;
        this.gravity = 1.0;
        this.o2 = 21.2;

        this.hull = 98;
        this.fuel = 73;
        this.ammo = 83;
        this.life = 100;

        this.shieldMode = 'standard';
        this.alertLevel = 'green';

        this.transmissionQueue = [];
        this.lastTransmissionTime = 0;

        this.init();
    }

    init() {
        this.initViewportStars();
        this.initStarMapStars();
        this.initCanvases();
        this.initControls();
        this.initSignalBars();
        this.updateStardate();
        this.scheduleTransmissions();
        this.loop(0);
    }

    initViewportStars() {
        for (let i = 0; i < 200; i++) {
            this.viewportStars.push({
                x: Math.random(),
                y: Math.random(),
                z: Math.random() * 3 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 2 + 1,
                twinkleOffset: Math.random() * TAU
            });
        }
    }

    initStarMapStars() {
        for (let i = 0; i < 80; i++) {
            this.starMapStars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.2 + 0.3,
                brightness: Math.random() * 0.4 + 0.1,
                twinkle: Math.random() * TAU
            });
        }
    }

    initCanvases() {
        this.viewportCanvas = document.getElementById('viewportCanvas');
        this.viewportCtx = this.viewportCanvas.getContext('2d');

        this.starMapCanvas = document.getElementById('starMapCanvas');
        this.starMapCtx = this.starMapCanvas.getContext('2d');

        this.shieldRingCanvas = document.getElementById('shieldRingCanvas');
        this.shieldRingCtx = this.shieldRingCanvas.getContext('2d');

        this.targetLockCanvas = document.getElementById('targetLockCanvas');
        this.targetLockCtx = this.targetLockCanvas.getContext('2d');

        this.freqDisplayCanvas = document.getElementById('freqDisplayCanvas');
        this.freqDisplayCtx = this.freqDisplayCanvas.getContext('2d');

        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());
    }

    resizeCanvases() {
        const canvases = [
            { canvas: this.viewportCanvas, wrapper: this.viewportCanvas.parentElement },
            { canvas: this.starMapCanvas, wrapper: this.starMapCanvas.parentElement },
            { canvas: this.shieldRingCanvas, wrapper: this.shieldRingCanvas.parentElement },
            { canvas: this.targetLockCanvas, wrapper: this.targetLockCanvas.parentElement },
            { canvas: this.freqDisplayCanvas, wrapper: this.freqDisplayCanvas.parentElement }
        ];

        canvases.forEach(({ canvas, wrapper }) => {
            const rect = wrapper.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
            canvas._w = rect.width;
            canvas._h = rect.height;
        });
    }

    initControls() {
        document.querySelectorAll('.shield-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.shield-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.shieldMode = btn.dataset.mode;
                this.updateShieldMode();
            });
        });

        document.querySelectorAll('.channel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.commsChannel = parseInt(btn.dataset.ch);
                this.updateCommsChannel();
            });
        });

        document.getElementById('btnFirePhaser').addEventListener('click', () => {
            this.firePhasers();
        });

        document.getElementById('btnFireTorpedo').addEventListener('click', () => {
            this.fireTorpedo();
        });

        document.getElementById('btnHail').addEventListener('click', () => {
            this.addTransmission('outgoing', 'USS CHROMEDRIVE', 'HAILING ON ALL FREQUENCIES. REQUESTING RESPONSE.');
        });

        document.getElementById('btnRespond').addEventListener('click', () => {
            this.addTransmission('outgoing', 'USS CHROMEDRIVE', 'MESSAGE ACKNOWLEDGED. STANDING BY.');
        });

        document.getElementById('btnEncrypt').addEventListener('click', () => {
            const btn = document.getElementById('btnEncrypt');
            btn.classList.toggle('active');
        });

        document.getElementById('btnBroadcast').addEventListener('click', () => {
            this.addTransmission('outgoing', 'USS CHROMEDRIVE', 'BROADCAST: ALL VESSELS IN SECTOR GAMMA-7, REPORT STATUS.');
        });

        document.querySelectorAll('.comms-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.id !== 'btnEncrypt') {
                    btn.classList.add('active');
                    setTimeout(() => btn.classList.remove('active'), 800);
                }
            });
        });
    }

    initSignalBars() {
        this.signalBarEls = [];
        for (let i = 1; i <= 10; i++) {
            this.signalBarEls.push(document.getElementById('sig' + i));
        }
        this.updateSignalBars();
    }

    loop(timestamp) {
        this.deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;
        this.time += this.deltaTime;
        this.frame++;

        this.update(this.deltaTime);
        this.render();

        requestAnimationFrame(t => this.loop(t));
    }

    update(dt) {
        this.stardate += dt * 0.001;
        this.shipTimeSeconds += dt;

        this.gridOffset += dt * (this.warpFactor * 0.08);
        if (this.gridOffset > 1) this.gridOffset -= 1;

        this.navHeading += (Math.random() - 0.5) * 0.02;
        this.navPitch += (Math.random() - 0.5) * 0.005;
        this.navYaw += (Math.random() - 0.5) * 0.005;
        this.navPitch = Math.max(-5, Math.min(5, this.navPitch));
        this.navYaw = Math.max(-5, Math.min(5, this.navYaw));

        if (this.navEta > 0) {
            this.navEta -= dt;
            if (this.navEta < 0) this.navEta = 0;
        }

        Object.keys(this.shields).forEach(key => {
            this.shields[key] += (Math.random() - 0.5) * 0.3;
            this.shields[key] = Math.max(60, Math.min(100, this.shields[key]));
        });
        this.shieldPct = Object.values(this.shields).reduce((a, b) => a + b, 0) / 6;
        this.shieldFreq += (Math.random() - 0.5) * 0.1;

        if (this.weapons.phaserB.charge < 100) {
            this.weapons.phaserB.charge += dt * 5;
            if (this.weapons.phaserB.charge >= 100) {
                this.weapons.phaserB.charge = 100;
                this.weapons.phaserB.status = 'ready';
            }
        }

        this.targetScanAngle += dt * 1.5;
        if (this.currentTarget) {
            this.targetLockProgress = Math.min(1, this.targetLockProgress + dt * 0.3);
        } else {
            this.targetLockProgress = Math.max(0, this.targetLockProgress - dt * 0.5);
        }

        if (this.frame % 120 === 0 && Math.random() < 0.3 && !this.currentTarget) {
            this.acquireTarget();
        }

        this.signalStrength = 5 + Math.sin(this.time * 0.7) * 2 + Math.sin(this.time * 1.3) * 1.5 + Math.random() * 0.5;
        this.signalStrength = Math.max(1, Math.min(10, this.signalStrength));

        this.reactorOutput += (Math.random() - 0.5) * 0.2;
        this.reactorOutput = Math.max(80, Math.min(95, this.reactorOutput));

        this.hullTemp += (Math.random() - 0.5) * 0.5;
        this.hullTemp = Math.max(80, Math.min(200, this.hullTemp));

        this.radiation += (Math.random() - 0.5) * 0.01;
        this.radiation = Math.max(0.1, Math.min(2.0, this.radiation));

        this.hull += (Math.random() - 0.5) * 0.05;
        this.hull = Math.max(80, Math.min(100, this.hull));

        this.fuel -= dt * 0.002;
        this.fuel = Math.max(0, this.fuel);

        this.ammo = ((this.weapons.torpedoFwd.ammo + this.weapons.torpedoAft.ammo + this.weapons.missile.ammo) /
            (this.weapons.torpedoFwd.max + this.weapons.torpedoAft.max + this.weapons.missile.max)) * 100;

        if (this.frame % 30 === 0) {
            this.updateDOM();
        }

        this.updateSignalBars();

        this.processTransmissionQueue();
    }

    updateDOM() {
        document.getElementById('stardate').textContent = this.stardate.toFixed(3);

        const h = Math.floor(this.shipTimeSeconds / 3600) % 24;
        const m = Math.floor(this.shipTimeSeconds / 60) % 60;
        const s = Math.floor(this.shipTimeSeconds) % 60;
        document.getElementById('shipTime').textContent =
            String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');

        document.getElementById('navHeading').textContent = this.navHeading.toFixed(1) + '°';
        document.getElementById('navPitch').textContent = (this.navPitch >= 0 ? '+' : '') + this.navPitch.toFixed(1) + '°';
        document.getElementById('navYaw').textContent = (this.navYaw >= 0 ? '+' : '') + this.navYaw.toFixed(1) + '°';
        document.getElementById('navCoords').textContent =
            Math.abs(this.navHeading * 0.19).toFixed(1) + 'N / ' + Math.abs(this.navPitch * 42).toFixed(1) + 'E / Z+' + (this.warpFactor * 0.65).toFixed(1);

        document.getElementById('warpFactor').textContent = this.warpFactor.toFixed(1);
        document.getElementById('warpFill').style.width = (this.warpFactor / 9 * 100) + '%';
        document.getElementById('navVelocity').textContent = Math.floor(this.warpFactor * this.warpFactor * 39.8) + 'c';

        const etaH = Math.floor(this.navEta / 3600);
        const etaM = Math.floor((this.navEta % 3600) / 60);
        const etaS = Math.floor(this.navEta % 60);
        document.getElementById('navEta').textContent =
            String(etaH).padStart(2, '0') + ':' + String(etaM).padStart(2, '0') + ':' + String(etaS).padStart(2, '0');

        const totalEta = 2 * 3600 + 47 * 60 + 13;
        document.getElementById('etaFill').style.width = ((1 - this.navEta / totalEta) * 100) + '%';

        document.getElementById('shieldPct').textContent = Math.round(this.shieldPct) + '%';
        document.getElementById('sFore').style.width = this.shields.fore + '%';
        document.getElementById('sForeVal').textContent = Math.round(this.shields.fore) + '%';
        document.getElementById('sAft').style.width = this.shields.aft + '%';
        document.getElementById('sAftVal').textContent = Math.round(this.shields.aft) + '%';
        document.getElementById('sPort').style.width = this.shields.port + '%';
        document.getElementById('sPortVal').textContent = Math.round(this.shields.port) + '%';
        document.getElementById('sStbd').style.width = this.shields.stbd + '%';
        document.getElementById('sStbdVal').textContent = Math.round(this.shields.stbd) + '%';
        document.getElementById('sDorsal').style.width = this.shields.dorsal + '%';
        document.getElementById('sDorsalVal').textContent = Math.round(this.shields.dorsal) + '%';
        document.getElementById('sVentral').style.width = this.shields.ventral + '%';
        document.getElementById('sVentralVal').textContent = Math.round(this.shields.ventral) + '%';

        document.getElementById('shieldFreq').textContent = this.shieldFreq.toFixed(1) + ' MHz';

        document.getElementById('wPhaserA').style.width = this.weapons.phaserA.charge + '%';
        document.getElementById('wPhaserAStatus').textContent = this.weapons.phaserA.charge >= 95 ? 'RDY' : 'CHG';
        document.getElementById('wPhaserAStatus').className = 'weapon-status ' + (this.weapons.phaserA.charge >= 95 ? 'ready' : 'charging');
        document.getElementById('wPhaserB').style.width = this.weapons.phaserB.charge + '%';
        document.getElementById('wPhaserBStatus').textContent = this.weapons.phaserB.status === 'ready' ? 'RDY' : 'CHG';
        document.getElementById('wPhaserBStatus').className = 'weapon-status ' + (this.weapons.phaserB.status === 'ready' ? 'ready' : 'charging');
        document.getElementById('wTorpedoFwdAmmo').textContent = this.weapons.torpedoFwd.ammo + ' / ' + this.weapons.torpedoFwd.max;
        document.getElementById('wTorpedoAftAmmo').textContent = this.weapons.torpedoAft.ammo + ' / ' + this.weapons.torpedoAft.max;
        document.getElementById('wMissileAmmo').textContent = String(this.weapons.missile.ammo).padStart(2, '0') + ' / ' + this.weapons.missile.max;

        if (this.currentTarget) {
            document.getElementById('targetName').textContent = this.currentTarget.name;
            document.getElementById('targetRange').textContent = this.currentTarget.range + ' Km';
            document.getElementById('targetBearing').textContent = this.currentTarget.bearing + '°';
        } else {
            document.getElementById('targetName').textContent = 'NO TARGET';
            document.getElementById('targetRange').textContent = '--- Km';
            document.getElementById('targetBearing').textContent = '---°';
        }

        document.getElementById('freqChannel').textContent = 'CH-' + String(this.commsChannel).padStart(2, '0');
        document.getElementById('freqValue').textContent = this.commsFreq.toFixed(1) + ' MHz';
        document.getElementById('signalValue').textContent = (-40 + this.signalStrength * 2).toFixed(0) + ' dBm';

        document.getElementById('reactorFill').style.width = this.reactorOutput + '%';
        document.getElementById('reactorVal').textContent = Math.round(this.reactorOutput) + '%';

        document.getElementById('vHullTempVal').textContent = Math.round(this.hullTemp) + '°K';
        document.getElementById('vHullTemp').style.width = (this.hullTemp / 300 * 100) + '%';
        document.getElementById('vRadiationVal').textContent = this.radiation.toFixed(1) + ' mSv';
        document.getElementById('vRadiation').style.width = (this.radiation / 3 * 100) + '%';
        document.getElementById('vGravityVal').textContent = this.gravity.toFixed(1) + 'G';
        document.getElementById('vGravity').style.width = (this.gravity / 2 * 100) + '%';
        document.getElementById('vO2Val').textContent = this.o2.toFixed(1) + '%';
        document.getElementById('vO2').style.width = (this.o2 / 25 * 100) + '%';

        document.getElementById('hudHeading').textContent = 'HDG ' + this.navHeading.toFixed(1);
        document.getElementById('hudPitch').textContent = 'PIC ' + (this.navPitch >= 0 ? '+' : '') + this.navPitch.toFixed(1);
        document.getElementById('hudSpeed').textContent = 'W' + this.warpFactor.toFixed(1);

        document.getElementById('stripHull').style.width = this.hull + '%';
        document.getElementById('stripHullVal').textContent = Math.round(this.hull) + '%';
        document.getElementById('stripFuel').style.width = this.fuel + '%';
        document.getElementById('stripFuelVal').textContent = Math.round(this.fuel) + '%';
        document.getElementById('stripAmmo').style.width = this.ammo + '%';
        document.getElementById('stripAmmoVal').textContent = Math.round(this.ammo) + '%';
        document.getElementById('stripLife').style.width = this.life + '%';
        document.getElementById('stripLifeVal').textContent = Math.round(this.life) + '%';

        const dist = (4.7 * (1 - (1 - this.navEta / totalEta))).toFixed(1);
        document.getElementById('navDistance').textContent = dist + ' LY';
    }

    updateSignalBars() {
        const active = Math.round(this.signalStrength);
        this.signalBarEls.forEach((bar, i) => {
            const height = 6 + (i + 1) * 1.2;
            bar.style.height = height + 'px';
            if (i < active) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
    }

    render() {
        this.renderViewport();
        this.renderStarMap();
        this.renderShieldRing();
        this.renderTargetLock();
        this.renderFreqDisplay();
        this.renderShieldFreqVis();
    }

    renderViewport() {
        const ctx = this.viewportCtx;
        const w = this.viewportCanvas._w;
        const h = this.viewportCanvas._h;
        if (!w || !h) return;

        ctx.clearRect(0, 0, w, h);

        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#020208');
        bgGrad.addColorStop(0.45, '#050520');
        bgGrad.addColorStop(0.65, '#1a0a30');
        bgGrad.addColorStop(0.75, '#3d1055');
        bgGrad.addColorStop(0.82, '#6b1d7a');
        bgGrad.addColorStop(0.88, '#c4285a');
        bgGrad.addColorStop(0.92, '#ff6030');
        bgGrad.addColorStop(0.95, '#ffb020');
        bgGrad.addColorStop(1, '#ffdd44');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        const horizonY = h * 0.85;
        const sunGrad = ctx.createRadialGradient(w * 0.5, horizonY, 0, w * 0.5, horizonY, w * 0.5);
        sunGrad.addColorStop(0, 'rgba(255, 200, 80, 0.4)');
        sunGrad.addColorStop(0.3, 'rgba(255, 96, 48, 0.2)');
        sunGrad.addColorStop(1, 'rgba(255, 96, 48, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, horizonY - h * 0.3, w, h * 0.4);

        const sunSliceY = horizonY - h * 0.04;
        const sunH = h * 0.12;
        const sunW = w * 0.18;
        const cx = w * 0.5;
        for (let i = 0; i < 8; i++) {
            const sliceY = sunSliceY - sunH + i * (sunH / 8);
            const sliceH = sunH / 16;
            if (i % 2 === 0) {
                ctx.fillStyle = 'rgba(255, 180, 60, 0.9)';
            } else {
                ctx.fillStyle = 'rgba(10, 5, 20, 0.95)';
            }
            ctx.fillRect(cx - sunW, sliceY, sunW * 2, sliceH);
        }

        ctx.fillStyle = '#020208';
        ctx.fillRect(0, horizonY, w, h - horizonY);

        this.viewportStars.forEach(star => {
            const sx = star.x * w;
            const sy = star.y * horizonY * 0.95;
            const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
            const alpha = star.brightness * twinkle;
            const size = star.z * 0.8 + 0.3;

            star.x -= star.z * 0.0003 * (this.warpFactor * 0.5);
            if (star.x < 0) star.x += 1;
            if (star.x > 1) star.x -= 1;

            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, TAU);
            ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
            ctx.fill();

            if (star.z > 2) {
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx - star.z * 3 * (this.warpFactor * 0.3), sy);
                ctx.strokeStyle = `rgba(200, 220, 255, ${alpha * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });

        this.drawChromeGrid(ctx, w, h, horizonY);

        const scanAlpha = 0.03 + Math.sin(this.time * 0.5) * 0.01;
        ctx.fillStyle = `rgba(0, 240, 255, ${scanAlpha})`;
        ctx.fillRect(0, 0, w, h);
    }

    drawChromeGrid(ctx, w, h, horizonY) {
        const numHLines = 20;
        const numVLines = 30;
        const vanishX = w * 0.5;
        const vanishY = horizonY;
        const gridBottom = h;

        ctx.strokeStyle = 'rgba(255, 45, 149, 0.6)';
        ctx.lineWidth = 0.8;

        for (let i = 0; i < numVLines; i++) {
            const t = (i / (numVLines - 1)) * 2 - 1;
            const bottomX = vanishX + t * w * 1.2;

            ctx.beginPath();
            ctx.moveTo(vanishX, vanishY);
            ctx.lineTo(bottomX, gridBottom);
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(255, 45, 149, 0.5)';
        for (let i = 0; i < numHLines; i++) {
            const rawT = (i + this.gridOffset) / numHLines;
            const t = rawT % 1;
            const perspT = t * t;
            const y = vanishY + perspT * (gridBottom - vanishY);

            if (y < vanishY || y > gridBottom) continue;

            const spread = perspT * w * 1.2;
            const alpha = 0.15 + perspT * 0.6;
            ctx.strokeStyle = `rgba(255, 45, 149, ${alpha})`;
            ctx.lineWidth = 0.5 + perspT * 0.8;

            ctx.beginPath();
            ctx.moveTo(vanishX - spread, y);
            ctx.lineTo(vanishX + spread, y);
            ctx.stroke();
        }

        const glowGrad = ctx.createLinearGradient(0, vanishY - 4, 0, vanishY + 4);
        glowGrad.addColorStop(0, 'rgba(255, 45, 149, 0)');
        glowGrad.addColorStop(0.5, 'rgba(255, 45, 149, 0.8)');
        glowGrad.addColorStop(1, 'rgba(255, 45, 149, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, vanishY - 2, w, 4);
    }

    renderStarMap() {
        const ctx = this.starMapCtx;
        const w = this.starMapCanvas._w;
        const h = this.starMapCanvas._h;
        if (!w || !h) return;

        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#040410';
        ctx.fillRect(0, 0, w, h);

        this.starMapStars.forEach(star => {
            const sx = star.x * w;
            const sy = star.y * h;
            const twinkle = Math.sin(this.time * 0.8 + star.twinkle) * 0.2 + 0.8;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, TAU);
            ctx.fillStyle = `rgba(180, 190, 220, ${star.brightness * twinkle})`;
            ctx.fill();
        });

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.lineWidth = 0.5;
        const gridStep = 20;
        for (let x = gridStep; x < w; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = gridStep; y < h; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        const waypoints = [
            { id: 'currentPos', x: 0.35, y: 0.55 },
            { id: 'wp1', x: 0.55, y: 0.35 },
            { id: 'wp2', x: 0.72, y: 0.50 },
            { id: 'wp3', x: 0.85, y: 0.30 },
            { id: 'stellar1', x: 0.20, y: 0.25 },
            { id: 'stellar2', x: 0.65, y: 0.75 }
        ];

        ctx.strokeStyle = 'rgba(255, 184, 0, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -this.time * 20;
        for (let i = 0; i < waypoints.length - 1; i++) {
            if (waypoints[i].id === 'currentPos') {
                ctx.beginPath();
                ctx.moveTo(waypoints[i].x * w, waypoints[i].y * h);
                ctx.lineTo(waypoints[i + 1].x * w, waypoints[i + 1].y * h);
                ctx.stroke();
            }
        }
        ctx.setLineDash([]);

        waypoints.forEach(wp => {
            const el = document.getElementById(wp.id);
            if (el) {
                el.style.left = (wp.x * 100) + '%';
                el.style.top = (wp.y * 100) + '%';
                el.style.transform = 'translate(-50%, -50%)';
            }
        });
    }

    renderShieldRing() {
        const ctx = this.shieldRingCtx;
        const w = this.shieldRingCanvas._w;
        const h = this.shieldRingCanvas._h;
        if (!w || !h) return;

        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const outerR = Math.min(w, h) * 0.42;
        const innerR = outerR * 0.75;
        const midR = (outerR + innerR) / 2;

        const pulse = Math.sin(this.time * 2) * 0.15 + 0.85;
        const glowPulse = Math.sin(this.time * 1.5) * 0.3 + 0.7;

        ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * glowPulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR + 4, 0, TAU);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, innerR - 4, 0, TAU);
        ctx.stroke();

        const sectors = [
            { name: 'fore', startAngle: -PI / 6, endAngle: PI / 6, val: this.shields.fore },
            { name: 'stbd', startAngle: PI / 6, endAngle: PI / 2, val: this.shields.stbd },
            { name: 'dorsal', startAngle: PI / 2, endAngle: 5 * PI / 6, val: this.shields.dorsal },
            { name: 'aft', startAngle: 5 * PI / 6, endAngle: 7 * PI / 6, val: this.shields.aft },
            { name: 'ventral', startAngle: 7 * PI / 6, endAngle: 3 * PI / 2, val: this.shields.ventral },
            { name: 'port', startAngle: 3 * PI / 2, endAngle: 11 * PI / 6, val: this.shields.port }
        ];

        sectors.forEach(sector => {
            const startA = sector.startAngle - PI / 2;
            const endA = sector.endAngle - PI / 2;
            const fillEnd = startA + (endA - startA) * (sector.val / 100) * pulse;

            ctx.beginPath();
            ctx.arc(cx, cy, midR, startA, endA);
            ctx.arc(cx, cy, innerR, endA, startA, true);
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, outerR, startA, fillEnd);
            ctx.arc(cx, cy, innerR, fillEnd, startA, true);
            ctx.closePath();

            const alpha = 0.3 + (sector.val / 100) * 0.5;
            if (sector.val > 80) {
                ctx.fillStyle = `rgba(0, 240, 255, ${alpha * pulse})`;
            } else if (sector.val > 50) {
                ctx.fillStyle = `rgba(255, 184, 0, ${alpha * pulse})`;
            } else {
                ctx.fillStyle = `rgba(255, 23, 68, ${alpha * pulse})`;
            }
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, midR, startA, fillEnd);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.6 * pulse})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            const gapAngle = startA + (endA - startA) * 0.5;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(gapAngle) * (innerR - 2), cy + Math.sin(gapAngle) * (innerR - 2));
            ctx.lineTo(cx + Math.cos(gapAngle) * (outerR + 2), cy + Math.sin(gapAngle) * (outerR + 2));
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        });

        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, TAU);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 * pulse})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, innerR, 0, TAU);
        ctx.stroke();

        const sweepAngle = this.time * 1.2;
        const sweepGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
        sweepGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        sweepGrad.addColorStop(1, `rgba(0, 240, 255, ${0.15 * glowPulse})`);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, outerR, sweepAngle, sweepAngle + 0.4);
        ctx.closePath();
        ctx.fillStyle = sweepGrad;
        ctx.fill();
    }

    renderTargetLock() {
        const ctx = this.targetLockCtx;
        const w = this.targetLockCanvas._w;
        const h = this.targetLockCanvas._h;
        if (!w || !h) return;

        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#040410';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255, 23, 68, 0.06)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < w; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        const cx = w / 2;
        const cy = h / 2;
        const lock = this.targetLockProgress;
        const maxR = Math.min(w, h) * 0.4;
        const reticleR = maxR * (1 - lock * 0.3);

        if (lock > 0.1) {
            ctx.strokeStyle = `rgba(255, 23, 68, ${0.15 + lock * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, reticleR, 0, TAU);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, reticleR * 0.6, 0, TAU);
            ctx.stroke();

            const bracketSize = 8 + lock * 6;
            const bracketDist = reticleR * 0.85;
            const brackets = [
                { x: cx - bracketDist, y: cy - bracketDist, dx: 1, dy: 0 },
                { x: cx - bracketDist, y: cy - bracketDist, dx: 0, dy: 1 },
                { x: cx + bracketDist, y: cy - bracketDist, dx: -1, dy: 0 },
                { x: cx + bracketDist, y: cy - bracketDist, dx: 0, dy: 1 },
                { x: cx - bracketDist, y: cy + bracketDist, dx: 1, dy: 0 },
                { x: cx - bracketDist, y: cy + bracketDist, dx: 0, dy: -1 },
                { x: cx + bracketDist, y: cy + bracketDist, dx: -1, dy: 0 },
                { x: cx + bracketDist, y: cy + bracketDist, dx: 0, dy: -1 }
            ];

            ctx.strokeStyle = `rgba(255, 23, 68, ${0.4 + lock * 0.6})`;
            ctx.lineWidth = 1.5;
            brackets.forEach(b => {
                ctx.beginPath();
                ctx.moveTo(b.x, b.y);
                ctx.lineTo(b.x + b.dx * bracketSize, b.y + b.dy * bracketSize);
                ctx.stroke();
            });

            const sweepR = reticleR * 1.1;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, sweepR, this.targetScanAngle, this.targetScanAngle + 0.6);
            ctx.closePath();
            const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sweepR);
            sweepGrad.addColorStop(0, 'rgba(255, 23, 68, 0)');
            sweepGrad.addColorStop(0.5, `rgba(255, 23, 68, ${0.08 * lock})`);
            sweepGrad.addColorStop(1, `rgba(255, 23, 68, ${0.02 * lock})`);
            ctx.fillStyle = sweepGrad;
            ctx.fill();

            if (lock > 0.8) {
                const lockAlpha = (lock - 0.8) / 0.2;
                ctx.strokeStyle = `rgba(255, 23, 68, ${lockAlpha * 0.8})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(cx - 6, cy);
                ctx.lineTo(cx + 6, cy);
                ctx.moveTo(cx, cy - 6);
                ctx.lineTo(cx, cy + 6);
                ctx.stroke();

                const lockPulse = Math.sin(this.time * 6) * 0.3 + 0.7;
                ctx.beginPath();
                ctx.arc(cx, cy, 3, 0, TAU);
                ctx.fillStyle = `rgba(255, 23, 68, ${lockAlpha * lockPulse})`;
                ctx.fill();
            }
        } else {
            ctx.strokeStyle = 'rgba(255, 23, 68, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.setLineDash([3, 6]);
            ctx.beginPath();
            ctx.arc(cx, cy, maxR * 0.5, 0, TAU);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(255, 23, 68, 0.3)';
            ctx.font = '9px "Orbitron"';
            ctx.textAlign = 'center';
            ctx.fillText('SCANNING', cx, cy + 3);
        }
    }

    renderFreqDisplay() {
        const ctx = this.freqDisplayCtx;
        const w = this.freqDisplayCanvas._w;
        const h = this.freqDisplayCanvas._h;
        if (!w || !h) return;

        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#040410';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255, 45, 149, 0.08)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < w; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        const midH = h / 2;
        ctx.strokeStyle = 'rgba(255, 45, 149, 0.15)';
        ctx.beginPath();
        ctx.moveTo(0, midH);
        ctx.lineTo(w, midH);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 45, 149, 0.06)';
        ctx.beginPath();
        ctx.moveTo(0, midH - h * 0.25);
        ctx.lineTo(w, midH - h * 0.25);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, midH + h * 0.25);
        ctx.lineTo(w, midH + h * 0.25);
        ctx.stroke();

        const numWaves = 4;
        const waves = [
            { freq: 2.5, amp: 0.3, speed: 1.2, color: 'rgba(255, 45, 149, 0.15)' },
            { freq: 5.0, amp: 0.15, speed: 2.5, color: 'rgba(255, 45, 149, 0.1)' },
            { freq: 8.0, amp: 0.08, speed: 4.0, color: 'rgba(255, 45, 149, 0.08)' },
            { freq: 1.2, amp: 0.35, speed: 0.8, color: 'rgba(255, 45, 149, 0.2)' }
        ];

        waves.forEach(wave => {
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                const t = x / w;
                const y = midH + Math.sin(t * wave.freq * TAU + this.time * wave.speed) * h * wave.amp
                    + Math.sin(t * wave.freq * 1.5 * TAU + this.time * wave.speed * 0.7) * h * wave.amp * 0.3;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const t = x / w;
            const noise = Math.sin(t * 30 + this.time * 5) * 2 + Math.sin(t * 50 + this.time * 8) * 1;
            const y = midH + Math.sin(t * 3 * TAU + this.time * 1.5) * h * 0.25
                + Math.sin(t * 7 * TAU + this.time * 3) * h * 0.08
                + noise;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255, 45, 149, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(255, 45, 149, 0.5)';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const t = x / w;
            const y = midH + Math.sin(t * 3 * TAU + this.time * 1.5) * h * 0.25
                + Math.sin(t * 7 * TAU + this.time * 3) * h * 0.08;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        const fillGrad = ctx.createLinearGradient(0, midH - h * 0.35, 0, midH + h * 0.35);
        fillGrad.addColorStop(0, 'rgba(255, 45, 149, 0.1)');
        fillGrad.addColorStop(0.5, 'rgba(255, 45, 149, 0.02)');
        fillGrad.addColorStop(1, 'rgba(255, 45, 149, 0.1)');
        ctx.lineTo(w, midH);
        ctx.lineTo(0, midH);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();
    }

    renderShieldFreqVis() {
        const container = document.getElementById('shieldFreqVis');
        if (!container || container._canvas) return;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);
        container._canvas = canvas;

        const ctx = canvas.getContext('2d');
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        canvas._w = rect.width;
        canvas._h = rect.height;

        const drawFrame = () => {
            const w = canvas._w;
            const h = canvas._h;
            ctx.clearRect(0, 0, w, h);

            ctx.fillStyle = '#060612';
            ctx.fillRect(0, 0, w, h);

            const mid = h / 2;
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                const t = x / w;
                const y = mid + Math.sin(t * 8 * TAU + this.time * 3) * h * 0.3
                    + Math.sin(t * 12 * TAU + this.time * 5) * h * 0.1;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
            ctx.lineWidth = 1;
            ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
            ctx.shadowBlur = 4;
            ctx.stroke();
            ctx.shadowBlur = 0;

            requestAnimationFrame(drawFrame);
        };
        drawFrame();
    }

    acquireTarget() {
        const targets = [
            { name: 'KLINGON BOP-47', range: (Math.random() * 400 + 100).toFixed(0), bearing: (Math.random() * 360).toFixed(1) },
            { name: 'ROMULAN WARBRD', range: (Math.random() * 600 + 200).toFixed(0), bearing: (Math.random() * 360).toFixed(1) },
            { name: 'UNKNOWN SIG-882', range: (Math.random() * 800 + 300).toFixed(0), bearing: (Math.random() * 360).toFixed(1) },
            { name: 'FREIGHTER T-44', range: (Math.random() * 200 + 50).toFixed(0), bearing: (Math.random() * 360).toFixed(1) },
            { name: 'ORION RAIDER-3', range: (Math.random() * 350 + 80).toFixed(0), bearing: (Math.random() * 360).toFixed(1) }
        ];
        this.currentTarget = targets[Math.floor(Math.random() * targets.length)];
        this.targetLockProgress = 0.05;

        document.getElementById('weaponBadge').textContent = 'TARGET';
        document.getElementById('weaponBadge').className = 'panel-badge active';

        setTimeout(() => {
            if (this.currentTarget && Math.random() < 0.4) {
                this.loseTarget();
            }
        }, 15000 + Math.random() * 15000);
    }

    loseTarget() {
        this.currentTarget = null;
        this.targetLockProgress = 0;
        document.getElementById('weaponBadge').textContent = 'STANDBY';
        document.getElementById('weaponBadge').className = 'panel-badge standby';
    }

    firePhasers() {
        if (this.weapons.phaserA.charge < 20) return;

        this.weapons.phaserA.charge = Math.max(0, this.weapons.phaserA.charge - 35);
        this.weapons.phaserA.status = this.weapons.phaserA.charge < 20 ? 'charging' : 'ready';

        const btn = document.getElementById('btnFirePhaser');
        btn.style.boxShadow = '0 0 20px rgba(255, 23, 68, 0.6), inset 0 0 20px rgba(255, 23, 68, 0.3)';
        btn.style.background = 'rgba(255, 23, 68, 0.4)';
        setTimeout(() => {
            btn.style.boxShadow = '';
            btn.style.background = '';
        }, 150);

        this.addTransmission('outgoing', 'USS CHROMEDRIVE', 'PHASER FIRE — CONFIRMED. CHARGE REMAINING: ' + Math.round(this.weapons.phaserA.charge) + '%');

        if (this.currentTarget && this.targetLockProgress > 0.8) {
            setTimeout(() => {
                this.addTransmission('incoming', 'TACTICAL', 'TARGET HIT. REASSESSING THREAT.');
                setTimeout(() => this.loseTarget(), 2000);
            }, 500);
        }
    }

    fireTorpedo() {
        if (this.weapons.torpedoFwd.ammo <= 0) return;

        this.weapons.torpedoFwd.ammo--;

        const btn = document.getElementById('btnFireTorpedo');
        btn.style.boxShadow = '0 0 20px rgba(255, 184, 0, 0.6), inset 0 0 20px rgba(255, 184, 0, 0.3)';
        btn.style.background = 'rgba(255, 184, 0, 0.4)';
        setTimeout(() => {
            btn.style.boxShadow = '';
            btn.style.background = '';
        }, 150);

        this.addTransmission('outgoing', 'USS CHROMEDRIVE', 'TORPEDO AWAY — FORWARD TUBE. REMAINING: ' + this.weapons.torpedoFwd.ammo);

        if (this.currentTarget && this.targetLockProgress > 0.6) {
            setTimeout(() => {
                this.addTransmission('incoming', 'TACTICAL', 'DIRECT HIT. TARGET NEUTRALIZED.');
                setTimeout(() => this.loseTarget(), 1500);
            }, 800);
        }
    }

    updateShieldMode() {
        const badge = document.getElementById('shieldBadge');
        switch (this.shieldMode) {
            case 'standard':
                badge.textContent = 'ACTIVE';
                badge.className = 'panel-badge active';
                break;
            case 'max':
                badge.textContent = 'MAXIMUM';
                badge.className = 'panel-badge active';
                Object.keys(this.shields).forEach(key => {
                    this.shields[key] = Math.min(100, this.shields[key] + 3);
                });
                break;
            case 'regen':
                badge.textContent = 'REGEN';
                badge.className = 'panel-badge online';
                break;
        }
    }

    updateCommsChannel() {
        const channels = {
            1: { freq: 121.5, label: 'EMERG' },
            2: { freq: 142.3, label: 'FLEET' },
            3: { freq: 156.8, label: 'LOCAL' },
            7: { freq: 247.8, label: 'ENCRYPT' },
            9: { freq: 312.4, label: 'SCOUT' },
            13: { freq: 428.1, label: 'HAIL' }
        };
        const ch = channels[this.commsChannel];
        if (ch) {
            this.commsFreq = ch.freq;
        }
    }

    addTransmission(type, source, text) {
        const log = document.getElementById('transmissionLog');
        const entry = document.createElement('div');
        entry.className = 'log-entry ' + type;

        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        entry.innerHTML = `
            <div class="log-meta">
                <span class="log-source">${source}</span>
                <span class="log-time">${timeStr}</span>
            </div>
            <div class="log-text">${text}</div>
        `;

        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;

        while (log.children.length > 15) {
            log.removeChild(log.firstChild);
        }
    }

    scheduleTransmissions() {
        const incomingMessages = [
            { source: 'STARBASE 47', text: 'CHROMEDRIVE, RESUPPLY AVAILABLE AT DOCK 7. ADVISE.' },
            { source: 'FLEET CMD', text: 'SECTOR ADVISORY: INCREASED PIRATE ACTIVITY GAMMA CORRIDOR.' },
            { source: 'USS NEONDRIFT', text: 'CHROMEDRIVE, WE HAVE VISUAL ON ANOMALY AT MARKER WP-2. PROCEED WITH CAUTION.' },
            { source: 'PROBE SIG-1147', text: 'AUTOMATED REPORT: SUBSPACE FLUCTUATIONS DETECTED BEARING 127.3.' },
            { source: 'STARBASE 47', text: 'PRIORITY MESSAGE: ESCORT VECTOR INBOUND. ETA 4 HOURS.' },
            { source: 'FLEET CMD', text: 'ALL SHIPS: MAINTAIN ENCRYPTED COMMS IN SECTOR GAMMA-7.' },
            { source: 'USS VOXPHANTOM', text: 'CHROMEDRIVE, REQUESTING STATUS UPDATE. WE ARE HOLDING AT BOUNDARY.' },
            { source: 'RELAY STATION 9', text: 'SIGNAL BOOST CONFIRMED. CHANNEL INTEGRITY NOMINAL.' },
            { source: 'SCOUT PROBE X-7', text: 'CONTACT LOST WITH PROBE X-7. LAST KNOWN: SECTOR GAMMA-8.' },
            { source: 'MEDICAL BAY', text: 'DR. CHEN: ALL CREW FIT FOR DUTY. IMMUNOBOOSTERS ADMINISTERED.' }
        ];

        const sendRandom = () => {
            const msg = incomingMessages[Math.floor(Math.random() * incomingMessages.length)];
            this.addTransmission('incoming', msg.source, msg.text);
            setTimeout(sendRandom, 12000 + Math.random() * 25000);
        };
        setTimeout(sendRandom, 8000);
    }

    processTransmissionQueue() {
    }

    updateStardate() {
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BridgeConsole();
});