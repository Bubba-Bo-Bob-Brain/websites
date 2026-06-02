const outlawDatabase = {
    rattlesnake: {
        name: "EL CASCABEL",
        alias: "The Rattlesnake",
        associates: "Seven Devils Gang",
        height: "5'10\"",
        marks: "Coiled snake tattoo on right forearm, missing tip of left index finger.",
        weapons: "Twin Colt Peacemakers, ivory grips.",
        narrative: "Broke out of Yuma Territorial Prison in the spring of '81. Rumored to have holed up in the treacherous desert caves of Blackwood Canyon. Known to strike stagecoaches without warning, leaving a signature rattlesnake tail at the scene of the crime. Shoot to kill.",
        payout: "$5,000 IN GOLD"
    },
    vance: {
        name: "SILAS VANCE",
        alias: "Cold-Eye Silas",
        associates: "None (Lone Wolf)",
        height: "6'2\"",
        marks: "Deep jagged scar across left eye, wears a silver-buckled gunbelt.",
        weapons: "Winchester Model 1873 Rifle, customized long-barrel.",
        narrative: "A cold-blooded mercenary and former military scout wanted for the bank plunder at Fort Worth and the cold-blooded killing of three Marshal deputies. Highly skilled tracker. Do not approach alone.",
        payout: "$12,500 IN CASH"
    },
    cassidy: {
        name: "BELLE CASSIDY",
        alias: "Calamity Belle",
        associates: "Wildwood Bandits",
        height: "5'6\"",
        marks: "Prominent mole on right cheek. Frequently disguised in gentleman's riding attire.",
        weapons: "Smith & Wesson Schofield Revolver.",
        narrative: "Elusive mastermind behind the Great Overland rail robberies. Expert strategist and legendary horsewoman. Known to gather high-society bank intelligence under various aliases. Must be captured alive for interrogation.",
        payout: "$8,000 IN GOLD"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initializeSaloonDoors();
    initializeNavigation();
    initializeAmbientSound();
    initializeTumbleweed();
    initializeDossierModal();
    initializeTelegramForm();
});

function initializeSaloonDoors() {
    const doors = document.getElementById("saloonDoors");
    const creakSfx = document.getElementById("creakSfx");

    setTimeout(() => {
        if (creakSfx) {
            creakSfx.volume = 0.6;
            creakSfx.play().catch(() => {});
        }
        doors.classList.add("open");
        
        setTimeout(() => {
            doors.classList.add("vanished");
        }, 1600);
    }, 500);
}

function initializeNavigation() {
    const spinner = document.getElementById("cylinderSpinner");
    const chambers = document.querySelectorAll(".cylinder-chamber");
    const panels = document.querySelectorAll(".content-panel");
    const gunshotSfx = document.getElementById("gunshotSfx");

    const rotationMap = {
        "bounties-section": 0,
        "dispatch-section": -90,
        "report-section": -180,
        "rules-section": -270
    };

    chambers.forEach(chamber => {
        chamber.addEventListener("click", () => {
            const targetId = chamber.getAttribute("data-target");
            const angle = rotationMap[targetId];

            chambers.forEach(c => c.classList.remove("active"));
            chamber.classList.add("active");

            spinner.style.transform = `rotate(${angle}deg)`;

            if (gunshotSfx) {
                gunshotSfx.currentTime = 0;
                gunshotSfx.volume = 0.4;
                gunshotSfx.play().catch(() => {});
            }

            setTimeout(() => {
                panels.forEach(panel => {
                    if (panel.id === targetId) {
                        panel.classList.add("active");
                    } else {
                        panel.classList.remove("active");
                    }
                });
            }, 300);
        });
    });
}

function initializeAmbientSound() {
    const audioToggle = document.getElementById("audioToggle");
    const ambientWind = document.getElementById("ambientWind");

    let isPlaying = false;

    audioToggle.addEventListener("click", () => {
        if (!isPlaying) {
            ambientWind.volume = 0.25;
            ambientWind.play()
                .then(() => {
                    isPlaying = true;
                    audioToggle.classList.remove("muted");
                })
                .catch(err => {
                    console.log("Audio playback blocked by browser settings.", err);
                });
        } else {
            ambientWind.pause();
            isPlaying = false;
            audioToggle.classList.add("muted");
        }
    });

    audioToggle.classList.add("muted");
}

function initializeTumbleweed() {
    const weed = document.getElementById("tumbleweed");

    function triggerTumbleweed() {
        weed.classList.add("rolling");
        
        weed.addEventListener("animationend", () => {
            weed.classList.remove("rolling");
        }, { once: true });
    }

    setInterval(() => {
        if (Math.random() > 0.4) {
            triggerTumbleweed();
        }
    }, 15000);

    setTimeout(triggerTumbleweed, 4000);
}

function initializeDossierModal() {
    const modal = document.getElementById("dossierModal");
    const closeBtn = document.getElementById("closeDossierBtn");
    const claimBtn = document.getElementById("claimBountyTrigger");
    const successOverlay = document.getElementById("successOverlay");
    const successCloseBtn = document.getElementById("successCloseBtn");
    const creakSfx = document.getElementById("creakSfx");

    const dossierPhoto = document.getElementById("dossierPhoto");
    const dossierName = document.getElementById("dossierName");
    const dossierAlias = document.getElementById("dossierAlias");
    const dossierAssociates = document.getElementById("dossierAssociates");
    const dossierHeight = document.getElementById("dossierHeight");
    const dossierMarks = document.getElementById("dossierMarks");
    const dossierWeapons = document.getElementById("dossierWeapons");
    const dossierNarrativeText = document.getElementById("dossierNarrativeText");
    const dossierPayout = document.getElementById("dossierPayout");

    document.querySelectorAll(".wanted-poster-card").forEach(poster => {
        const inspectBtn = poster.querySelector(".view-details-btn");
        const outlawKey = poster.getAttribute("data-outlaw");

        inspectBtn.addEventListener("click", () => {
            const data = outlawDatabase[outlawKey];
            if (!data) return;

            dossierName.textContent = data.name;
            dossierAlias.textContent = data.alias;
            dossierAssociates.textContent = data.associates;
            dossierHeight.textContent = data.height;
            dossierMarks.textContent = data.marks;
            dossierWeapons.textContent = data.weapons;
            dossierNarrativeText.textContent = data.narrative;
            dossierPayout.textContent = data.payout;

            dossierPhoto.style.backgroundImage = "";
            if (outlawKey === "rattlesnake") {
                dossierPhoto.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" fill=\"%232c1a11\"><path d=\"M50,15 C40,15 35,25 35,38 C35,48 42,50 42,55 C42,65 30,68 30,78 L70,78 C70,68 58,65 58,55 C58,50 65,48 65,38 C65,25 60,15 50,15 Z\" /><circle cx=\"50\" cy=\"30\" r=\"4\" fill=\"%23e2cca6\"/><rect x=\"40\" y=\"55\" width=\"20\" height=\"8\" rx=\"2\" fill=\"%232c1a11\"/><line x1=\"30\" y1=\"78\" x2=\"70\" y2=\"78\" stroke=\"%232c1a11\" stroke-width=\"4\"/></svg>')";
            } else if (outlawKey === "vance") {
                dossierPhoto.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" fill=\"%232c1a11\"><rect x=\"30\" y=\"20\" width=\"40\" height=\"40\" rx=\"5\" /><path d=\"M25,60 C25,75 35,80 50,80 C65,80 75,75 75,60 Z\" /><line x1=\"28\" y1=\"35\" x2=\"72\" y2=\"35\" stroke=\"%23e2cca6\" stroke-width=\"6\"/><circle cx=\"50\" cy=\"45\" r=\"3\" fill=\"%23e2cca6\"/></svg>')";
            } else if (outlawKey === "cassidy") {
                dossierPhoto.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" fill=\"%232c1a11\"><path d=\"M50,12 C35,12 30,22 30,40 C30,55 35,60 35,78 L65,78 C65,60 70,55 70,40 C70,22 65,12 50,12 Z\" /><path d=\"M20,38 C25,30 40,25 50,25 C60,25 75,30 80,38 Z\" fill=\"%232c1a11\"/><circle cx=\"43\" cy=\"42\" r=\"3\" fill=\"%23e2cca6\"/><circle cx=\"57\" cy=\"42\" r=\"3\" fill=\"%23e2cca6\"/></svg>')";
            }

            if (creakSfx) {
                creakSfx.currentTime = 0;
                creakSfx.volume = 0.5;
                creakSfx.play().catch(() => {});
            }

            modal.classList.add("open");
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("open");
        }
    });

    claimBtn.addEventListener("click", () => {
        modal.classList.remove("open");
        successOverlay.classList.add("open");
        const gunshotSfx = document.getElementById("gunshotSfx");
        if (gunshotSfx) {
            gunshotSfx.currentTime = 0;
            gunshotSfx.volume = 0.5;
            gunshotSfx.play().catch(() => {});
        }
    });

    successCloseBtn.addEventListener("click", () => {
        successOverlay.classList.remove("open");
    });
}

function initializeTelegramForm() {
    const form = document.getElementById("telegramForm");
    const entriesContainer = document.getElementById("ledgerEntriesContainer");
    const successOverlay = document.getElementById("successOverlay");
    const gunshotSfx = document.getElementById("gunshotSfx");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("informantName").value.trim().toUpperCase();
        const suspectSelect = document.getElementById("targetOutlaw");
        const suspectName = suspectSelect.options[suspectSelect.selectedIndex].text.split(" (")[0];
        const locationInput = document.getElementById("sightingLocation").value.trim().toUpperCase();
        const detailsInput = document.getElementById("sightingDetails").value.trim().toUpperCase();

        const currentDate = getFormattedDate();
        const currentTime = getFormattedTime();

        const newEntry = document.createElement("div");
        newEntry.className = "ledger-entry";
        newEntry.innerHTML = `
            <span class="entry-date">${currentDate}</span>
            <span class="entry-time">${currentTime}</span>
            <p class="entry-text">
                <strong>SIGHTING DISPATCH:</strong> Suspect <strong>${suspectName}</strong> reported at <strong>${locationInput}</strong> by informant code-named <strong>${nameInput}</strong>. 
                <br><em>Telegraph payload: "${detailsInput}"</em>
            </p>
        `;

        entriesContainer.insertBefore(newEntry, entriesContainer.firstChild);

        form.reset();

        successOverlay.classList.add("open");
        if (gunshotSfx) {
            gunshotSfx.currentTime = 0;
            gunshotSfx.volume = 0.5;
            gunshotSfx.play().catch(() => {});
        }
    });
}

function getFormattedDate() {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const d = new Date();
    const month = months[d.getMonth()];
    const day = d.getDate();
    return `${month} ${day}, 1881`;
}

function getFormattedTime() {
    const d = new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}`;
}