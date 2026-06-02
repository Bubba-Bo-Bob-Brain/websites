/* ============================================================
   SECTOR 7-G // CLASSIFIED TERMINAL — JAVASCRIPT ENGINE
   DESIGNATION: SCRIPTS.JS
   CLEARANCE: LEVEL 5
   ============================================================ */

(function () {
    "use strict";

    // ===== STATE =====
    const state = {
        sessionActive: false,
        bootComplete: false,
        broadcastPaused: false,
        broadcastSpeed: 1,
        uptimeSeconds: 0,
        threatLevel: "OMEGA",
        activeNodes: 6,
        totalNodes: 11,
    };

    // ===== DOM REFERENCES =====
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const bootScreen = $("#boot-screen");
    const bootText = $("#boot-text");
    const bootBar = $("#boot-bar");
    const bootStatus = $("#boot-status");
    const terminal = $("#terminal");
    const sysClock = $("#sys-clock");
    const sysDate = $("#sys-date");
    const threatLevel = $("#threat-level");
    const uptimeEl = $("#uptime");
    const memUsage = $("#mem-usage");
    const cpuUsage = $("#cpu-usage");
    const nodeCount = $("#node-count");
    const threatCount = $("#threat-count");
    const broadcastTicker = $("#broadcast-ticker");
    const bcPause = $("#bc-pause");
    const bcSpeed = $("#bc-speed");
    const feedStatus = $("#feed-status");
    const territoryUpdate = $("#territory-update");
    const terminalBody = $("#terminal-body");
    const typedText = $("#typed-text");
    const conflictLog = $("#conflict-log");
    const shutdownBtn = $("#shutdown-btn");

    // ===== BOOT SEQUENCE =====
    const bootMessages = [
        { text: "BIOS VERIFICATION... OK", delay: 400 },
        { text: "LOADING KERNEL v6.6.6...", delay: 300 },
        { text: "MEMORY CHECK: 16,384 TB DETECTED", delay: 300 },
        { text: "INITIALIZING NEURAL NETWORK INTERFACE...", delay: 350 },
        { text: "SECURE BOOT: AUTHORIZED", delay: 250 },
        { text: "LOADING SURVEILLANCE MODULES...", delay: 300 },
        { text: "CONNECTING TO SECTOR 7-G MAINFRAME...", delay: 400 },
        { text: "DECRYPTION KEYS LOADED", delay: 250 },
        { text: "GHOST PROTOCOL: STANDBY", delay: 300 },
        { text: "ACCESS GRANTED — WELCOME, OPERATOR", delay: 500 },
    ];

    let bootMsgIndex = 0;
    let bootProgress = 0;

    function typeBootMessage() {
        if (bootMsgIndex >= bootMessages.length) {
            bootComplete();
            return;
        }
        const msg = bootMessages[bootMsgIndex];
        const fullText = msg.text;
        let charIndex = 0;
        bootText.textContent = "";

        const typeInterval = setInterval(() => {
            if (charIndex < fullText.length) {
                bootText.textContent += fullText.charAt(charIndex);
                charIndex++;
                bootProgress = Math.floor(
                    ((bootMsgIndex * fullText.length + charIndex) /
                        (bootMessages.length * fullText.length)) *
                        100
                );
                bootBar.style.width = bootProgress + "%";
            } else {
                clearInterval(typeInterval);
                bootStatus.textContent = `[${msg.text}] — DONE`;
                bootMsgIndex++;
                setTimeout(typeBootMessage, msg.delay);
            }
        }, 25);
    }

    function bootComplete() {
        bootBar.style.width = "100%";
        bootStatus.textContent = "SYSTEM ONLINE";
        setTimeout(() => {
            bootScreen.classList.add("hidden");
            terminal.style.display = "block";
            state.sessionActive = true;
            state.bootComplete = true;
            setTimeout(initAllSystems, 500);
        }, 800);
    }

    // ===== CLOCK =====
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        const s = String(now.getSeconds()).padStart(2, "0");
        sysClock.textContent = `${h}:${m}:${s}`;

        const yr = now.getFullYear();
        const mo = String(now.getMonth() + 1).padStart(2, "0");
        const dy = String(now.getDate()).padStart(2, "0");
        sysDate.textContent = `2077.${mo}.${dy}`;

        if (state.sessionActive) {
            state.uptimeSeconds++;
            const uh = String(Math.floor(state.uptimeSeconds / 3600)).padStart(2, "0");
            const um = String(Math.floor((state.uptimeSeconds % 3600) / 60)).padStart(2, "0");
            const us = String(state.uptimeSeconds % 60).padStart(2, "0");
            uptimeEl.textContent = `${uh}:${um}:${us}`;
        }
    }

    // ===== SURVEILLANCE FEEDS =====
    function initSurveillanceFeeds() {
        const canvases = $$(".feed-canvas");
        canvases.forEach((canvas) => {
            const ctx = canvas.getContext("2d");
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
            drawStatic(ctx, canvas.width, canvas.height);
        });
    }

    function drawStatic(ctx, w, h) {
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255;
            data[i] = val * 0.3;     // R (greenish tint)
            data[i + 1] = val;        // G
            data[i + 2] = val * 0.3;  // B
            data[i + 3] = 255;        // A
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function animateFeedCanvas(canvas) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        if (!w || !h) return;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const flicker = Math.random() < 0.02 ? Math.random() * 255 : 0;
            const val = Math.random() * 255;
            data[i] = flicker * 0.3;
            data[i + 1] = val;
            data[i + 2] = flicker * 0.3;
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function glitchFeed(index) {
        const canvas = $(`.feed-canvas[data-canvas="${index}"]`);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        // RGB split effect
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const offset = Math.floor(Math.random() * 8) - 4;
        for (let y = 0; y < h; y++) {
            if (Math.random() < 0.1) {
                const rowOffset = Math.floor(Math.random() * 6) - 3;
                for (let x = 0; x < w; x++) {
                    const src = (y * w + x) * 4;
                    const dst = (y * w + Math.min(w - 1, Math.max(0, x + rowOffset))) * 4;
                    data[src] = data[dst];
                }
            }
        }
        ctx.putImageData(imageData, offset, 0);
    }

    function updateFeedTimes() {
        $$(".feed-time").forEach((el) => {
            if (el.textContent === "SIGNAL LOST") return;
            const now = new Date();
            const h = String(now.getHours()).padStart(2, "0");
            const m = String(now.getMinutes()).padStart(2, "0");
            const s = String(now.getSeconds()).padStart(2, "0");
            el.textContent = `${h}:${m}:${s}`;
        });
    }

    // ===== NETWORK MAP =====
    function animateNetwork() {
        const links = $$(".net-link[data-active='true']");
        links.forEach((link) => {
            const speed = 1 + Math.random() * 3;
            link.style.strokeDashoffset = `${parseFloat(getComputedStyle(link).strokeDashoffset || 0) - speed}px`;
        });

        // Occasional node flicker
        const nodes = $$(".net-node[data-status='active']");
        if (Math.random() < 0.05 && nodes.length > 0) {
            const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
            const circle = randomNode.querySelector(".net-node-circle");
            if (circle) {
                circle.style.opacity = "0.3";
                setTimeout(() => { circle.style.opacity = "1"; }, 100 + Math.random() * 300);
            }
        }

        requestAnimationFrame(animateNetwork);
    }

    function updateNetworkStatus() {
        // Periodically toggle a link status
        const links = $$(".net-link");
        if (links.length > 0 && Math.random() < 0.02) {
            const link = links[Math.floor(Math.random() * links.length)];
            const current = link.getAttribute("data-active");
            link.setAttribute("data-active", current === "true" ? "false" : "true");
        }
    }

    // ===== FACTION BARS =====
    function animateFactionBars() {
        $$(".faction-bar").forEach((bar) => {
            const target = parseInt(bar.getAttribute("data-target"), 10);
            setTimeout(() => {
                bar.style.width = target + "%";
            }, 300 + Math.random() * 500);
        });
    }

    function updateFactionTerritories() {
        const factions = ["iron-hand", "council", "ember", "unclaimed"];
        const cells = $$(".territory-cell");
        const bars = $$(".faction-bar");
        const vals = $$(".faction-val");
        const pcts = $$(".territory-pct");

        // Slight fluctuation
        let total = 0;
        const newVals = factions.map(() => {
            const base = parseInt(bars[total]?.getAttribute("data-target") || "25", 10);
            const fluctuation = Math.floor(Math.random() * 5) - 2;
            return Math.max(2, base + fluctuation);
        });
        const sum = newVals.reduce((a, b) => a + b, 0);
        // Normalize to 100
        const normalized = newVals.map((v) => Math.round((v / sum) * 100));
        // Fix rounding to exactly 100
        const diff = 100 - normalized.reduce((a, b) => a + b, 0);
        normalized[0] += diff;

        normalized.forEach((val, i) => {
            if (bars[i]) {
                bars[i].style.width = "0%";
                bars[i].setAttribute("data-target", val);
                setTimeout(() => {
                    bars[i].style.width = val + "%";
                }, 100);
            }
            if (vals[i]) vals[i].textContent = val + "%";
            if (pcts[i]) pcts[i].textContent = val + "%";
        });

        // Update territory timestamp
        const now = new Date();
        territoryUpdate.textContent = `UPDATED: ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    }

    // ===== CONFLICT LOG =====
    const conflictTemplates = [
        { text: "IRON HAND patrol ambushed near <b>Sector 7-K perimeter</b> — {cas} losses inflicted", faction: "IRON HAND" },
        { text: "EMBER CELL operative <b>[REDACTED]</b> captured, transferred to <b>Detention Block 9</b>", faction: "EMBER CELL" },
        { text: "UNIFIED COUNCIL imposed <b>curfew 2000-0500</b> on Sectors 3 through 8", faction: "UNIFIED COUNCIL" },
        { text: "Supply convoy destroyed on <b>Highway 7-West</b> — Unknown perpetrators", faction: "UNKNOWN" },
        { text: "Unauthorized broadcast intercepted at <b>frequency 7G.337</b> — Source triangulating", faction: "REBEL" },
        { text: "Peacekeeper unit <b>K-7</b> declared MIA after entering <b>Dead Zone 04</b>", faction: "PEACEKEEPERS" },
        { text: "Food processing plant <b>#22</b> shut down after contamination scare", faction: "MINISTRY OF SUSTENANCE" },
        { text: "DRONE strike leveled compound in <b>Quadrant 15</b> — {cas} structures destroyed", faction: "IRON HAND" },
        { text: "EMBER CELL propaganda broadcast detected in <b>Sectors 7-G through 7-J</b>", faction: "EMBER CELL" },
        { text: "Water purification facility <b>Aqua-6</b> seized by unknown hostile force", faction: "UNKNOWN" },
        { text: "Neural implant <b>compliance rate dropped to 87%</b> in lower quadrants", faction: "COUNCIL" },
        { text: "Arms cache discovered in <b>abandoned metro tunnel 7C</b> — weapons confiscated", faction: "PEACEKEEPERS" },
    ];

    function addConflictEntry() {
        const template = conflictTemplates[Math.floor(Math.random() * conflictTemplates.length)];
        const h = String(Math.floor(Math.random() * 24)).padStart(2, "0");
        const m = String(Math.floor(Math.random() * 60)).padStart(2, "0");
        const text = template.text.replace("{cas}", String(Math.floor(Math.random() * 50) + 5));

        const entry = document.createElement("div");
        entry.className = "conflict-entry";
        entry.innerHTML = `<span class="conflict-time">[${h}:${m}]</span><span class="conflict-text">${text}</span>`;

        conflictLog.prepend(entry);

        // Keep only last 20 entries
        while (conflictLog.children.length > 20) {
            conflictLog.removeChild(conflictLog.lastChild);
        }
    }

    // ===== DATA TERMINAL =====
    const terminalCommands = {
        help: () => {
            return [
                "<span class='term-green'>Available commands:</span>",
                "  help          — Display this help message",
                "  status        — Display system status",
                "  nodes         — List active network nodes",
                "  scan [target] — Scan a target (e.g., scan 192.168.7G.1)",
                "  whoami        — Display current identity",
                "  clear         — Clear terminal output",
                "  decrypt [msg] — Attempt to decrypt a message",
                "  uplink        — Attempt to contact Ember Cell uplink",
                "  purge         — Purge local logs",
            ].join("\n");
        },
        status: () => {
            const mem = (60 + Math.floor(Math.random() * 30));
            const cpu = (30 + Math.floor(Math.random() * 40));
            const temp = (55 + Math.floor(Math.random() * 25));
            return [
                `<span class="term-green">SYSTEM STATUS:</span>`,
                `  Memory:     ${mem}% utilized`,
                `  CPU Load:   ${cpu}%`,
                `  Core Temp:  ${temp}°C`,
                `  Uptime:     ${uptimeEl.textContent}`,
                `  Threads:    ${Math.floor(Math.random() * 100) + 200}`,
                `  Threat:     <span class="term-red">${state.threatLevel}</span>`,
            ].join("\n");
        },
        nodes: () => {
            return [
                `<span class="term-green">NETWORK NODES:</span>`,
                `  Alpha   [HQ]       — <span class="term-green">ACTIVE</span>    Signal: 98%`,
                `  Beta    [Ops]      — <span class="term-green">ACTIVE</span>    Signal: 87%`,
                `  Gamma   [Intel]    — <span class="term-green">ACTIVE</span>    Signal: 74%`,
                `  Delta   [Supply]   — <span class="term-green">ACTIVE</span>    Signal: 65%`,
                `  Epsilon [Medical]  — <span class="term-green">ACTIVE</span>    Signal: 82%`,
                `  Zeta    [Arms]     — <span class="term-green">ACTIVE</span>    Signal: 58%`,
                `  Lambda  [Safehouse]— <span class="term-green">ACTIVE</span>    Signal: 41%`,
                `  Eta     [Unknown]  — <span class="term-yellow">COMPROMISED</span>`,
                `  Theta   [Unknown]  — <span class="term-red">OFFLINE</span>`,
                `  Iota    [Unknown]  — <span class="term-red">BURNED</span>`,
                `  Kappa   [Unknown]  — <span class="term-red">OFFLINE</span>`,
            ].join("\n");
        },
        "scan": (args) => {
            if (!args[1]) return "<span class='term-yellow'>USAGE: scan [target_ip_or_node]</span>";
            const target = args[1];
            return [
                `<span class="term-yellow">SCANNING: ${target}...</span>`,
                `  Port 22:    ${Math.random() < 0.5 ? "OPEN" : "FILTERED"}`,
                `  Port 80:    OPEN`,
                `  Port 443:   ${Math.random() < 0.5 ? "OPEN" : "FILTERED"}`,
                `  Port 7G:    ENCRYPTED`,
                `  OS:         Unknown/Classified`,
                `  Latency:   ${Math.floor(Math.random() * 200) + 20}ms`,
                `  Result:    <span class="term-green">Scan complete</span>`,
            ].join("\n");
        },
        whoami: () => {
            return [
                `<span class="term-green">CURRENT SESSION:</span>`,
                `  Identity:   GHOST_OPERATOR`,
                `  Clearance:  LEVEL 5 — RESTRICTED`,
                `  Location:   UNKNOWN (PROXY CHAIN ACTIVE)`,
                `  Protocol:   ENCRYPTED TUNNEL v3.2`,
                `  Status:     ANONYMIZED`,
            ].join("\n");
        },
        clear: () => {
            terminalBody.innerHTML = "";
            return "";
        },
        decrypt: (args) => {
            if (!args[1]) return "<span class='term-yellow'>USAGE: decrypt [message_id]</span>";
            const id = args[1].toUpperCase();
            const messages = {
                "ALPHA": "DECRYPTED: The meeting is at 2300 hours in Sub-Sector 7-D. Bring the documents. — Ember Cell Command",
                "BETA": "DECRYPTED: Supply drop confirmed for Quadrant 14. Coordinates to follow via dead drop.",
                "GAMMA": "DECRYPTED: The mole is identified. Handler designation: NIGHTINGALE. Compartmentalized.",
                "DELTA": "DECRYPTED: EMP charges placed at Relay Station 12. Detonation window: 0400 hours.",
            };
            if (messages[id]) {
                return `<span class="term-green">◼ DECRYPTION SUCCESSFUL ◼</span>\n${messages[id]}`;
            }
            return `<span class="term-red">DECRYPTION FAILED: Message "${id}" not found or insufficient clearance.</span>`;
        },
        uplink: () => {
            const responses = [
                "Uplink attempt to Ember Cell Command...",
                "Connecting through 7 proxy nodes...",
                "Handshake initiated...",
                "...",
                `<span class="term-green">◼ CONNECTION ESTABLISHED ◼</span>`,
                `<span class="term-green">Operator: You are secure. Proceed.</span>`,
            ];
            return responses.join("\n");
        },
        purge: () => {
            terminalBody.innerHTML = "";
            return `<span class="term-yellow">Local logs purged. Memory wiped.</span>`;
        },
    };

    let userInput = "";
    let terminalInitiated = false;

    function initTerminal() {
        terminalInitiated = true;
        typeTerminalText(`<span class="term-yellow">[SYSTEM] Type "help" for available commands.</span>`, 0);
    }

    function typeTerminalText(text, delay) {
        setTimeout(() => {
            const line = document.createElement("div");
            line.className = "terminal-line";
            line.innerHTML = text;
            terminalBody.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }, delay);
    }

    function processCommand(input) {
        const parts = input.trim().toLowerCase().split(/\s+/);
        const cmd = parts[0];
        const args = parts;

        if (terminalCommands[cmd]) {
            const output = terminalCommands[cmd](args);
            if (output) {
                output.split("\n").forEach((line, i) => {
                    typeTerminalText(line, i * 80);
                });
            }
        } else if (cmd === "") {
            // Empty command
        } else {
            typeTerminalText(`<span class="term-red">ERROR: Unknown command "${cmd}". Type "help" for available commands.</span>`, 0);
        }
    }

    // ===== BROADCAST CONTROLS =====
    function initBroadcast() {
        // Clone ticker for seamless loop
        const ticker = broadcastTicker;
        ticker.innerHTML += ticker.innerHTML;

        bcPause.addEventListener("click", () => {
            state.broadcastPaused = !state.broadcastPaused;
            if (state.broadcastPaused) {
                ticker.style.animationPlayState = "paused";
                bcPause.textContent = "▶ PLAY";
            } else {
                ticker.style.animationPlayState = "running";
                bcPause.textContent = "❚❚ PAUSE";
            }
        });

        bcSpeed.addEventListener("click", () => {
            if (state.broadcastSpeed === 1) {
                state.broadcastSpeed = 2;
                ticker.style.animationDuration = "22.5s";
                bcSpeed.textContent = "SPEED: 2x";
            } else if (state.broadcastSpeed === 2) {
                state.broadcastSpeed = 0.5;
                ticker.style.animationDuration = "90s";
                bcSpeed.textContent = "SPEED: 0.5x";
            } else {
                state.broadcastSpeed = 1;
                ticker.style.animationDuration = "45s";
                bcSpeed.textContent = "SPEED: 1x";
            }
        });
    }

    // ===== SYSTEM METRICS =====
    function updateSystemMetrics() {
        const mem = 65 + Math.floor(Math.random() * 20);
        const cpu = 30 + Math.floor(Math.random() * 35);
        memUsage.textContent = mem + "%";
        cpuUsage.textContent = cpu + "%";

        // Update bar visualizations
        const memBarParent = memUsage.parentElement;
        if (memBarParent) {
            const barText = generateBar(mem, 10);
            memBarParent.innerHTML = `MEM: <span id="mem-usage">${mem}%</span> ${barText}`;
        }
        const cpuBarParent = cpuUsage.parentElement;
        if (cpuBarParent) {
            const barText = generateBar(cpu, 10);
            cpuBarParent.innerHTML = `PROC: <span id="cpu-usage">${cpu}%</span> ${barText}`;
        }
    }

    function generateBar(pct, blocks) {
        const filled = Math.ceil((pct / 100) * blocks);
        let bar = "";
        for (let i = 0; i < blocks; i++) {
            bar += i < filled ? "▓" : "░";
        }
        return bar;
    }

    function updateThreatLevel() {
        const levels = ["ALPHA", "BETA", "GAMMA", "DELTA", "OMEGA"];
        const colors = {
            ALPHA: "var(--green)",
            BETA: "var(--amber)",
            GAMMA: "var(--amber)",
            DELTA: "var(--red)",
            OMEGA: "var(--red)",
        };
        const glows = {
            ALPHA: "var(--green-glow)",
            BETA: "var(--amber-glow)",
            GAMMA: "var(--amber-glow)",
            DELTA: "var(--red-glow)",
            OMEGA: "var(--red-glow)",
        };

        if (Math.random() < 0.03) {
            const newLevel = levels[Math.floor(Math.random() * levels.length)];
            state.threatLevel = newLevel;
            threatLevel.textContent = `THREAT: ${newLevel}`;
            threatLevel.style.color = colors[newLevel];
            threatLevel.style.textShadow = `0 0 8px ${glows[newLevel]}`;
            const dot = document.querySelector(".threat-dot");
            dot.style.background = colors[newLevel];
            dot.style.boxShadow = `0 0 10px ${colors[newLevel]}, 0 0 20px ${glows[newLevel]}`;
        }
    }

    function updateNodeCount() {
        const fluctuation = Math.random() < 0.05;
        if (fluctuation) {
            state.activeNodes = Math.max(3, Math.min(11, state.activeNodes + (Math.random() < 0.5 ? -1 : 1)));
            nodeCount.textContent = `${state.activeNodes}/${state.totalNodes}`;

            // Update feed status
            const online = state.activeNodes >= 6 ? "6/6 ONLINE" : `${state.activeNodes}/6 ONLINE`;
            feedStatus.textContent = `● ${online}`;
            feedStatus.style.color = state.activeNodes < 5 ? "var(--amber)" : "var(--green)";
            feedStatus.style.textShadow = state.activeNodes < 5
                ? `0 0 6px var(--amber-glow)`
                : `0 0 6px var(--green-glow)`;
        }
    }

    // ===== SHUTDOWN =====
    function shutdown() {
        state.sessionActive = false;
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 20000;
            display: flex; align-items: center; justify-content: center;
            flex-direction: column; font-family: var(--font-mono);
            color: var(--red); text-align: center;
            animation: fadeIn 0.5s ease;
        `;
        overlay.innerHTML = `
            <div style="font-family:var(--font-display);font-size:1.5rem;letter-spacing:6px;margin-bottom:20px;text-shadow:0 0 20px var(--red-glow);">
                SESSION TERMINATED
            </div>
            <div style="font-size:0.9rem;color:var(--text-dim);margin-bottom:30px;">
                All connections severed.<br>
                Operator identity scrubbed.<br>
                GHOST PROTOCOL disengaged.
            </div>
            <div style="color:var(--text-dim);font-size:0.8rem;animation: cursorBlink 1s step-end infinite;">
                █ RECONNECT IN PROGRESS...
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
            location.reload();
        }, 5000);
    }

    // ===== GLITCH EFFECTS =====
    function randomGlitch() {
        if (!state.bootComplete) return;

        const glitchFeed = document.querySelector(".feed-card.glitchy .feed-canvas");
        if (glitchFeed && Math.random() < 0.15) {
            glitchFeed(index) // This is index 3
            // Fix: pass the actual canvas
            glitchFeedCanvas(glitchFeed);
        }

        // Random screen glitch
        if (Math.random() < 0.01) {
            const terminal = document.querySelector(".terminal-container");
            terminal.style.transform = `translate(${(Math.random()-0.5)*4}px, ${(Math.random()-0.5)*4}px)`;
            setTimeout(() => { terminal.style.transform = "translate(0,0)"; }, 50);
        }

        // Random feed "loss"
        if (Math.random() < 0.02) {
            const cards = document.querySelectorAll(".feed-card:not(.offline-feed)");
            if (cards.length > 0) {
                const card = cards[Math.floor(Math.random() * cards.length)];
                card.style.filter = "hue-rotate(90deg) saturate(0.2)";
                setTimeout(() => { card.style.filter = ""; }, 200 + Math.random() * 300);
            }
        }
    }

    function glitchFeedCanvas(canvas) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        if (!w || !h) return;
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        // Horizontal glitch band
        const bandY = Math.floor(Math.random() * h);
        const bandH = Math.floor(Math.random() * 10) + 1;
        const offset = Math.floor(Math.random() * 20) - 10;
        for (let y = bandY; y < Math.min(h, bandY + bandH); y++) {
            for (let x = 0; x < w; x++) {
                const src = (y * w + Math.min(w - 1, Math.max(0, x + offset))) * 4;
                const dst = (y * w + x) * 4;
                data[dst] = data[src];
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // ===== KEYBOARD INPUT =====
    function initKeyboard() {
        document.addEventListener("keydown", (e) => {
            if (!state.bootComplete) return;

            if (e.key === "Enter") {
                e.preventDefault();
                const text = userInput;
                if (text.trim()) {
                    // Display the entered command
                    const line = document.createElement("div");
                    line.className = "terminal-line";
                    line.innerHTML = `<span class="term-prompt">&gt;&gt;</span> <span class="term-typed">${escapeHtml(text.trim())}</span>`;
                    terminalBody.appendChild(line);

                    processCommand(text);
                } else {
                    // Empty line
                    const line = document.createElement("div");
                    line.className = "terminal-line";
                    line.innerHTML = `<span class="term-prompt">&gt;&gt;</span>`;
                    terminalBody.appendChild(line);
                }

                userInput = "";
                typedText.textContent = "";
                terminalBody.scrollTop = terminalBody.scrollHeight;
            } else if (e.key === "Backspace") {
                e.preventDefault();
                userInput = userInput.slice(0, -1);
                typedText.textContent = escapeHtml(userInput);
            } else if (e.key === "l" && e.ctrlKey) {
                e.preventDefault();
                terminalBody.innerHTML = "";
            } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                userInput += e.key;
                typedText.textContent = escapeHtml(userInput);
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    // ===== SHUTDOWN BUTTON =====
    shutdownBtn.addEventListener("click", shutdown);

    // ===== INIT ALL =====
    function initAllSystems() {
        initBroadcast();
        initSurveillanceFeeds();
        animateNetwork();
        animateFactionBars();
        initTerminal();
        initKeyboard();

        // Start intervals
        setInterval(updateClock, 1000);
        setInterval(updateFeedTimes, 1000);
        setInterval(updateSystemMetrics, 3000);
        setInterval(addConflictEntry, 15000);
        setInterval(updateFactionTerritories, 25000);
        setInterval(updateThreatLevel, 8000);
        setInterval(updateNodeCount, 5000);
        setInterval(randomGlitch, 800);

        // Animate surveillance canvases
        setInterval(() => {
            const canvases = document.querySelectorAll(".feed-canvas:not(.offline-feed canvas)");
            canvases.forEach((canvas) => {
                if (Math.random() < 0.3) {
                    animateFeedCanvas(canvas);
                }
            });
        }, 2000);

        // Initial clock display
        updateClock();

        // Add initial conflict entries with delay
        setTimeout(addConflictEntry, 3000);
        setTimeout(addConflictEntry, 7000);
    }

    // ===== START =====
    typeBootMessage();

})();