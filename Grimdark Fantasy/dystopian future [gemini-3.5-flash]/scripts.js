document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initializeCameraControls();
    initializeMapGrid();
    initializeTerminal();
    initializeBroadcastSpammer();
    startAmbientAtmosphericGlitches();
});

function initializeCameraControls() {
    const buttons = document.querySelectorAll(".cam-btn");
    const feeds = document.querySelectorAll(".camera-feed");
    const glitchOverlay = document.querySelector(".static-glitch");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedCamId = button.getAttribute("data-cam");
            
            buttons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");

            glitchOverlay.classList.add("active-glitch");

            setTimeout(() => {
                feeds.forEach(feed => {
                    feed.classList.remove("active");
                    feed.classList.add("hidden");
                });

                const activeFeed = document.getElementById(`${selectedCamId}-feed`);
                if (activeFeed) {
                    activeFeed.classList.remove("hidden");
                    activeFeed.classList.add("active");
                }
            }, 150);

            setTimeout(() => {
                glitchOverlay.classList.remove("active-glitch");
            }, 450);
        });
    });
}

const sectorDatabase = {
    synod: {
        names: ["THE IRON CATHEDRAL", "GRAND CHANCELLERY", "RECONCILIATION CHAMBER", "SACRIFICE CHASM VII", "TITHE-SPIRE PRIME"],
        descriptions: [
            "Heavy industrial refinery dedicated to liquid carbon crystallization and prayer-guided transmutations.",
            "High-security administrative sector where flesh-tithe records are stored and heresy is processed.",
            "Detoxification center where heretical thoughts are expunged using cognitive radiation.",
            "Deep vertical core shaft housing the primary biomechanical engine that powers the sector's shield net.",
            "Sanguine energy production station utilizing biological decomposition and atmospheric friction."
        ]
    },
    weavers: {
        names: ["SILK-WEB INTERCHANGE", "NEURAL COON-NEST", "TRANS-SPHERE LINK 09", "THE CHRYSALIS LABS", "COGNITIVE WEAVE HUB"],
        descriptions: [
            "Data-highway junction where neural-webs are woven into high-frequency prayer transmissions.",
            "A densely populated bio-silicon slum containing thousands of dormant minds linked to the sub-net.",
            "A decaying satellite station used by high-altitude acolytes to broadcast alternative digital testaments.",
            "Laboratory designed for bio-mechanical graft experiments and consciousness-splitting.",
            "The main node for filtering information before it is fed to the central Machine intelligence."
        ]
    },
    husks: {
        names: ["THE ROT-WELLS", "CATACOMB TERMINUS", "SILENT SPIRE", "SCAVENGER RIDGE", "SULPHUR FIELDS"],
        descriptions: [
            "Abandoned cooling vents where non-viable citizens gather to scavenge residual kinetic heat.",
            "Mass grave for mechanical components and biological refuse, prone to aggressive static discharge.",
            "A completely dead transmission tower where nothing but radioactive background noise remains.",
            "A highly unstable territorial boundary controlled by rogue scrap-scavengers and automated guard-drones.",
            "Acidic waste basin containing ancient high-tech relic storage containers, highly irradiated."
        ]
    }
};

function initializeMapGrid() {
    const grid = document.getElementById("hex-grid");
    const nodeTitle = document.querySelector(".node-title");
    const nodeDesc = document.querySelector(".node-description");
    const stabilityBar = document.getElementById("node-stability");
    const revenueVal = document.getElementById("node-revenue");

    const factions = ["synod", "weavers", "husks"];

    for (let i = 0; i < 30; i++) {
        const node = document.createElement("div");
        node.classList.add("map-node");
        
        const randomFaction = factions[Math.floor(Math.random() * factions.length)];
        node.classList.add(`${randomFaction}-controlled`);
        
        const romanNumeral = toRoman(i + 1);
        node.textContent = romanNumeral;

        const nodeData = generateNodeData(randomFaction, romanNumeral);
        node.dataset.info = JSON.stringify(nodeData);

        node.addEventListener("click", () => {
            document.querySelectorAll(".map-node").forEach(n => n.classList.remove("selected-node"));
            node.classList.add("selected-node");
            
            nodeTitle.textContent = `${nodeData.faction.toUpperCase()} // ${nodeData.name}`;
            nodeDesc.textContent = nodeData.description;
            stabilityBar.style.width = `${nodeData.stability}%`;
            revenueVal.textContent = `${nodeData.revenue} SEC/CYCLE`;
        });

        grid.appendChild(node);
    }
}

function generateNodeData(faction, numeral) {
    const database = sectorDatabase[faction];
    const index = Math.floor(Math.random() * database.names.length);
    return {
        faction: faction,
        name: `${database.names[index]} [${numeral}]`,
        description: database.descriptions[index],
        stability: Math.floor(Math.random() * 80) + 10,
        revenue: (Math.random() * 500 + 50).toFixed(2)
    };
}

function toRoman(num) {
    const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (let i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

const terminalCommands = {
    help: () => [
        "AVAILABLE LITURGICAL PROTOCOLS & COMMANDS:",
        "-------------------------------------------",
        "  help         Display this register of diagnostic commands.",
        "  status       Inquire about the current sanity index of the central CPU.",
        "  litany       Recite the Litany of Mechanical Cohesion (stabilizes terminal).",
        "  scan         Perform a deep-range sweep for dissident radio transmitters.",
        "  purge        Purge cognitive impurities from local memory cache.",
        "  clear        Cleanse the diagnostic screen of visual residue."
    ],
    status: () => [
        "SYSTEM DIAGNOSTIC: SECTOR-III OVERSEER CORE",
        "-------------------------------------------",
        "COGNITIVE ENGINE STATUS: CRITICAL - INSTABILITY DETECTED",
        "LOGICAL DRIFT: +0.0318% PER CYCLE",
        "ORGANIC COMPONENT INTEGRITY: DEGRADED (BIOMASS DRYING OUT)",
        "CURRENT PRAYER THROUGHPUT: 12.4 TERA-ORISONS/SEC",
        "WARNING: HERETICAL SUB-NET PENETRATION IN PROGRESS."
    ],
    litany: () => {
        triggerTerminalFlash();
        return [
            "RECITING THE LITANY OF MECHANICAL COHESION:",
            "  'Spirit of the cog, protect our digital flesh.",
            "   From the error of independent thought, deliver us.",
            "   From the corrosion of free-will, save us.",
            "   The formula is absolute. The engine is eternal.'",
            "COGNITIVE STABILITY RESTORED BY 0.002%."
        ];
    },
    scan: () => {
        const locations = ["SUB-SPIRE 02", "SEWER CHANNEL C", "WASTE REFINERY 99", "ABANDONED CHRYSALIS CAGE"];
        const foundFreq = (Math.random() * 100 + 100).toFixed(3);
        return [
            "LAUNCHING SCRYER-ARRAY FREQUENCY SWEEP...",
            "  Scanning 100Mhz - 900Mhz bands...",
            `  WARNING: DISSIDENT BROADCAST INTERCEPTED AT [${locations[Math.floor(Math.random() * locations.length)]}]`,
            `  FREQUENCY: ${foundFreq} Mhz`,
            "  DATA DECRYPTION: 'Do not trust the Ministry. The flesh is not the enemy. Keep your hearts soft...'"
        ];
    },
    purge: () => {
        triggerTerminalGlitchEffect();
        return [
            "CLEANSING IMPURE THOUGHTS AND CORRUPT SECTORS...",
            "  [████████████████] 100% COMPLETE",
            "  All heretical remnants successfully deleted.",
            "  Your obedience is registered by the Synod."
        ];
    },
    clear: (screen) => {
        screen.innerHTML = "";
        return [];
    }
};

function initializeTerminal() {
    const input = document.getElementById("terminal-input");
    const screen = document.getElementById("terminal-screen");

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const commandText = input.value.trim().toLowerCase();
            input.value = "";

            if (!commandText) return;

            const echo = document.createElement("p");
            echo.classList.add("user-cmd-echo");
            echo.textContent = `>> ${commandText}`;
            screen.appendChild(echo);

            let outputLines = [];
            if (terminalCommands[commandText]) {
                outputLines = terminalCommands[commandText](screen);
            } else {
                outputLines = [
                    `COMMAND ERROR: '${commandText}' is not a recognized ritual.`,
                    "Type 'help' to summon the valid list of system liturgies."
                ];
            }

            outputLines.forEach(line => {
                const lineElement = document.createElement("p");
                if (line.includes("ERROR") || line.includes("WARNING")) {
                    lineElement.classList.add("error-msg");
                } else if (line.includes(">>")) {
                    lineElement.classList.add("user-cmd-echo");
                } else {
                    lineElement.classList.add("system-msg");
                }
                lineElement.textContent = line;
                screen.appendChild(lineElement);
            });

            screen.scrollTop = screen.scrollHeight;
        }
    });
}

function triggerTerminalFlash() {
    const terminal = document.querySelector(".panel-terminal");
    terminal.style.backgroundColor = "rgba(224, 49, 49, 0.25)";
    setTimeout(() => {
        terminal.style.backgroundColor = "";
    }, 150);
}

function triggerTerminalGlitchEffect() {
    const screen = document.getElementById("terminal-screen");
    screen.style.transform = "translateX(5px)";
    setTimeout(() => { screen.style.transform = "translateX(-5px)"; }, 50);
    setTimeout(() => { screen.style.transform = "translateX(3px)"; }, 100);
    setTimeout(() => { screen.style.transform = "none"; }, 150);
}

const customTransmissions = [
    {
        sender: "CHANCELLERY SENTINEL",
        text: "Curfew extended indefinitely for Lower Sector III. Violators will be dismantled for hydraulic lubricant conversion.",
        type: "high-alert"
    },
    {
        sender: "CORE-WEAVER MONITORS",
        text: "The sacred weaving pattern is complete. Do not attempt to analyze the pattern. It is too vast for human optic nerves.",
        type: "regular"
    },
    {
        sender: "RENEGADE CELL 'ZERO'",
        text: "We have cut the fiber lines in District 12. They cannot force the obedience signals if they cannot reach your cyberware. Wake up.",
        type: "resistance-intercepted"
    },
    {
        sender: "SYNOD HEALTH MINISTRY",
        text: "Ration packs containing blue-grease paste are highly nutritious. Side-effects of optical bleeding should be ignored.",
        type: "regular"
    }
];

function initializeBroadcastSpammer() {
    const container = document.getElementById("broadcast-container");

    setInterval(() => {
        const selected = customTransmissions[Math.floor(Math.random() * customTransmissions.length)];
        
        const item = document.createElement("div");
        item.classList.add("broadcast-item", selected.type);

        const meta = document.createElement("div");
        meta.classList.add("broadcast-meta");

        const senderSpan = document.createElement("span");
        senderSpan.classList.add("broadcast-sender");
        senderSpan.textContent = selected.sender;

        const timeSpan = document.createElement("span");
        timeSpan.classList.add("broadcast-time");
        const currentCycle = (9982 + Math.random()).toFixed(2);
        timeSpan.textContent = `CYCLE ${currentCycle} // RUNTIME`;

        const body = document.createElement("p");
        body.classList.add("broadcast-body");
        body.textContent = `"${selected.text}"`;

        meta.appendChild(senderSpan);
        meta.appendChild(timeSpan);
        item.appendChild(meta);
        item.appendChild(body);

        container.prepend(item);

        if (container.children.length > 8) {
            container.removeChild(container.lastChild);
        }
    }, 15000);
}

function startAmbientAtmosphericGlitches() {
    const glitchOverlay = document.querySelector(".static-glitch");

    setInterval(() => {
        if (Math.random() > 0.6) {
            glitchOverlay.classList.add("active-glitch");
            
            setTimeout(() => {
                glitchOverlay.classList.remove("active-glitch");
            }, Math.random() * 500 + 100);
        }
    }, 7000);
}