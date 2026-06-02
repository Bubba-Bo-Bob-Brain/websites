const retroItemsDatabase = [
    { id: "iron_sword", name: "Iron Broadsword", rarity: "rarity-common", icon: "fa-sword", desc: "A heavy iron blade forged in the hearth of Ironwood Tavern.", stats: "+5 Atk, -2 Dex", slot: "weapon" },
    { id: "wizard_hat", name: "Sage's Hood", rarity: "rarity-rare", icon: "fa-hat-wizard", desc: "Smells faintly of lavender and ancient spell dust.", stats: "+4 Int, +15 Mana", slot: "head" },
    { id: "plate_armor", name: "Steel Breastplate", rarity: "rarity-uncommon", icon: "fa-vest", desc: "Dented from battle but polished to a mirror finish.", stats: "+12 Vit, -3 Dex", slot: "chest" },
    { id: "aegis_shield", name: "Sunfire Aegis", rarity: "rarity-epic", icon: "fa-shield-halved", desc: "Blessed by solar clerics. It radiates warmth.", stats: "+15 Vit, +5 Fire Res", slot: "shield" },
    { id: "ruby_ring", name: "Ring of Embers", rarity: "rarity-legendary", icon: "fa-ring", desc: "A fiery ruby that pulses like a beating heart.", stats: "+8 Int, Spell Burn", slot: "ring" },
    { id: "rusty_dagger", name: "Thief's Stiletto", rarity: "rarity-common", icon: "fa-dagger", desc: "Lightweight and easily hidden in a leather sleeve.", stats: "+3 Dex, +5% Crit", slot: "weapon" },
    { id: "leather_cap", name: "Scout Goggles", rarity: "rarity-common", icon: "fa-glasses", desc: "Equipped with brass lenses for tracking tracks.", stats: "+2 Dex", slot: "head" },
    { id: "mana_potion", name: "Starlight Elixir", rarity: "rarity-uncommon", icon: "fa-flask", desc: "A bubbling azure fluid that restores magical energies.", stats: "Restores 50 Mana", slot: "usable" },
    { id: "dragon_scale", name: "Wyrm Scale Shield", rarity: "rarity-legendary", icon: "fa-shield", desc: "Crafted from a crimson dragon slain in the First Age.", stats: "+25 Vit, Fire Immunity", slot: "shield" },
    { id: "robe_magi", name: "Archmage Robes", rarity: "rarity-epic", icon: "fa-shirt", desc: "Woven with silver thread that channels leyline energy.", stats: "+10 Int, Spell Penetration", slot: "chest" }
];

const questNoticesDatabase = {
    "1": {
        title: "The Goblin Cave",
        desc: "Foul goblins have stolen Old Barnaby's prize-winning prize pig. Recover the pig from the southern caverns before they cook it! High danger of tripping over rocks.",
        gold: 150,
        xp: 300
    },
    "2": {
        title: "Sunken Crypt",
        desc: "Undead activity reported in the southern catacombs. Retrieve the Gilded Amulet of the First King. Watch your step, the crypt is flooded with ancient, cursed water.",
        gold: 450,
        xp: 1200
    },
    "3": {
        title: "Lost Alchemy",
        desc: "A lost carriage containing prototype health potions was ambushed in the Forest of Whispers. Locate the carriage and return the undamaged vials to the Alchemist Guild.",
        gold: 220,
        xp: 600
    }
};

const spellsDatabase = {
    fireball: {
        title: "Ignis Sphaera",
        chant: '"Invocare flammam aeternam..."',
        desc: "Unleashes a roaring orb of crackling flame toward the targeted area, causing severe fire damage to all enemies caught within its explosion radius.",
        dmg: "3d6 + Intellect",
        range: "30 meters",
        cost: 15
    },
    lightning: {
        title: "Fulminis",
        chant: '"Tonitruum et fulgur scinde caelum..."',
        desc: "Calls down a jagged bolt of lightning from the heavens, piercing armor and jumping to adjacent targets in a chain reaction.",
        dmg: "2d10 + Intellect",
        range: "45 meters",
        cost: 20
    },
    heal: {
        title: "Anima Restoratio",
        chant: '"Sanitas et lux in corpore..."',
        desc: "Channels sacred celestial light into the caster or an ally, sealing wounds and curing minor poisons instantly.",
        dmg: "2d8 + Vitality (Healing)",
        range: "Touch",
        cost: 12
    }
};

const audioContextManager = {
    context: null,
    musicOscillator: null,
    musicGain: null,
    isPlayingMusic: false,
    notes: [220, 261.63, 293.66, 329.63, 392.00, 440],
    noteIndex: 0,
    sequenceInterval: null,

    init() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playSystemSound(frequency, duration, type = "sine") {
        this.init();
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        oscillator.start();
        oscillator.stop(this.context.currentTime + duration);
    },

    playCastSpellSound() {
        this.playSystemSound(150, 0.1, "sawtooth");
        setTimeout(() => this.playSystemSound(300, 0.15, "triangle"), 80);
        setTimeout(() => this.playSystemSound(600, 0.3, "sine"), 180);
    },

    playRollSound() {
        let delay = 0;
        for (let index = 0; index < 6; index++) {
            setTimeout(() => {
                const randomFreq = 400 + Math.random() * 800;
                this.playSystemSound(randomFreq, 0.05, "square");
            }, delay);
            delay += 60;
        }
    },

    playFanfareSound() {
        this.playSystemSound(261.63, 0.15, "triangle");
        setTimeout(() => this.playSystemSound(329.63, 0.15, "triangle"), 150);
        setTimeout(() => this.playSystemSound(392.00, 0.15, "triangle"), 300);
        setTimeout(() => this.playSystemSound(523.25, 0.4, "sine"), 450);
    },

    toggleMusic() {
        this.init();
        if (this.isPlayingMusic) {
            this.stopMusic();
            return false;
        } else {
            this.startMusic();
            return true;
        }
    },

    startMusic() {
        this.isPlayingMusic = true;
        this.musicGain = this.context.createGain();
        this.musicGain.gain.setValueAtTime(0.02, this.context.currentTime);
        this.musicGain.connect(this.context.destination);
        
        this.sequenceInterval = setInterval(() => {
            const currentFreq = this.notes[this.noteIndex];
            const synthOsc = this.context.createOscillator();
            synthOsc.type = "triangle";
            synthOsc.frequency.value = currentFreq;
            
            const synthGain = this.context.createGain();
            synthGain.gain.setValueAtTime(0.03, this.context.currentTime);
            synthGain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.6);
            
            synthOsc.connect(synthGain);
            synthGain.connect(this.musicGain);
            synthOsc.start();
            synthOsc.stop(this.context.currentTime + 0.6);
            
            this.noteIndex = (this.noteIndex + 1) % this.notes.length;
        }, 500);
    },

    stopMusic() {
        this.isPlayingMusic = false;
        clearInterval(this.sequenceInterval);
        if (this.musicGain) {
            this.musicGain.disconnect();
        }
    }
};

const systemLogger = {
    element: document.getElementById("console-log"),
    write(message) {
        this.element.textContent = `Log: ${message}`;
        this.element.style.animation = "none";
        this.element.offsetHeight;
        this.element.style.animation = "fadeInFast 0.2s steps(4) forwards";
    }
};

const crtController = {
    body: document.body,
    toggleButton: document.getElementById("toggle-crt"),
    init() {
        this.toggleButton.addEventListener("click", () => {
            const isCrtOn = this.body.classList.toggle("crt-active");
            this.toggleButton.innerHTML = `<i class="fa-solid fa-tv"></i> CRT: ${isCrtOn ? "ON" : "OFF"}`;
            audioContextManager.playSystemSound(440, 0.05, "sine");
            systemLogger.write(`CRT Display Filter ${isCrtOn ? "Enabled" : "Disabled"}`);
        });
    }
};

const audioController = {
    audioButton: document.getElementById("audio-btn"),
    init() {
        this.audioButton.addEventListener("click", () => {
            const isPlaying = audioContextManager.toggleMusic();
            this.audioButton.innerHTML = `<i class="fa-solid ${isPlaying ? "fa-volume-high" : "fa-volume-xmark"}"></i> MUSIC: ${isPlaying ? "ON" : "OFF"}`;
            systemLogger.write(`Ambient Audio Synthesizer ${isPlaying ? "Activated" : "Silenced"}`);
        });
    }
};

const navigationController = {
    tabs: document.querySelectorAll(".tab-link"),
    contents: document.querySelectorAll(".tab-content"),
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const selectedTabId = tab.getAttribute("data-tab");
                this.tabs.forEach(item => item.classList.remove("active"));
                this.contents.forEach(item => item.classList.remove("active"));
                
                tab.classList.add("active");
                document.getElementById(selectedTabId).classList.add("active");
                
                audioContextManager.playSystemSound(300, 0.08, "sine");
                systemLogger.write(`Accessing ${tab.textContent.trim()} Screen...`);
            });
        });
    }
};

const characterSheetController = {
    avatarElement: document.getElementById("hero-avatar"),
    randomizeButton: document.getElementById("randomize-avatar"),
    rollButton: document.getElementById("roll-stats"),
    nameInput: document.getElementById("char-name"),
    classSelect: document.getElementById("char-class"),
    
    avatarStates: {
        eyes: ["#00ff00", "#ff00ff", "#00ffff", "#ffff00", "#ff0000"],
        hair: ["#3d2314", "#8c1c1c", "#1c3d8c", "#e5c158", "#555555"],
        armor: ["#7a7a7a", "#ffd700", "#8b0000", "#00008b", "#228b22"]
    },

    stats: { STR: 14, INT: 10, DEX: 12, VIT: 15, LCK: 8 },

    init() {
        this.randomizeButton.addEventListener("click", () => this.generateRandomAvatar());
        this.rollButton.addEventListener("click", () => this.rollStatsAction());
        this.nameInput.addEventListener("change", () => {
            systemLogger.write(`Adventurer's name registered as: "${this.nameInput.value}"`);
            audioContextManager.playSystemSound(600, 0.05, "sine");
        });
        this.classSelect.addEventListener("change", () => this.handleClassChange());
        
        this.generateRandomAvatar();
        this.updateStatsDisplay();
    },

    generateRandomAvatar() {
        const randomEye = this.avatarStates.eyes[Math.floor(Math.random() * this.avatarStates.eyes.length)];
        const randomHair = this.avatarStates.hair[Math.floor(Math.random() * this.avatarStates.hair.length)];
        const randomArmor = this.avatarStates.armor[Math.floor(Math.random() * this.avatarStates.armor.length)];

        this.avatarElement.querySelector(".pixel-eye.eye-left").style.backgroundColor = randomEye;
        this.avatarElement.querySelector(".pixel-eye.eye-right").style.backgroundColor = randomEye;
        this.avatarElement.querySelector(".pixel-hair").style.backgroundColor = randomHair;
        this.avatarElement.querySelector(".pixel-armor").style.backgroundColor = randomArmor;

        audioContextManager.playSystemSound(480, 0.06, "triangle");
        systemLogger.write("Avatar canvas generated with randomized cosmetic variables.");
    },

    rollStatsAction() {
        audioContextManager.playRollSound();
        
        let counter = 0;
        const intervalId = setInterval(() => {
            this.stats.STR = Math.floor(Math.random() * 12) + 6;
            this.stats.INT = Math.floor(Math.random() * 12) + 6;
            this.stats.DEX = Math.floor(Math.random() * 12) + 6;
            this.stats.VIT = Math.floor(Math.random() * 12) + 6;
            this.stats.LCK = Math.floor(Math.random() * 12) + 6;
            this.updateStatsDisplay();
            
            counter++;
            if (counter >= 8) {
                clearInterval(intervalId);
                systemLogger.write("Attributes successfully rolled via a 3D20 algorithm.");
            }
        }, 60);
    },

    handleClassChange() {
        const selectedClass = this.classSelect.value;
        if (selectedClass === "Warrior") {
            this.stats = { STR: 18, INT: 6, DEX: 10, VIT: 16, LCK: 8 };
        } else if (selectedClass === "Mage") {
            this.stats = { STR: 6, INT: 18, DEX: 11, VIT: 9, LCK: 12 };
        } else if (selectedClass === "Rogue") {
            this.stats = { STR: 10, INT: 10, DEX: 18, VIT: 10, LCK: 14 };
        } else if (selectedClass === "Cleric") {
            this.stats = { STR: 12, INT: 13, DEX: 9, VIT: 14, LCK: 10 };
        }
        
        this.updateStatsDisplay();
        audioContextManager.playSystemSound(350, 0.12, "sawtooth");
        systemLogger.write(`Class changed to ${selectedClass}. Base attributes rebalanced.`);
    },

    updateStatsDisplay() {
        document.getElementById("val-str").textContent = this.stats.STR;
        document.getElementById("val-int").textContent = this.stats.INT;
        document.getElementById("val-dex").textContent = this.stats.DEX;
        document.getElementById("val-vit").textContent = this.stats.VIT;
        document.getElementById("val-lck").textContent = this.stats.LCK;

        document.getElementById("bar-str").style.width = `${(this.stats.STR / 20) * 100}%`;
        document.getElementById("bar-int").style.width = `${(this.stats.INT / 20) * 100}%`;
        document.getElementById("bar-dex").style.width = `${(this.stats.DEX / 20) * 100}%`;
        document.getElementById("bar-vit").style.width = `${(this.stats.VIT / 20) * 100}%`;
        document.getElementById("bar-lck").style.width = `${(this.stats.LCK / 20) * 100}%`;

        const maxHp = this.stats.VIT * 8;
        const maxMp = this.stats.INT * 4;
        document.getElementById("hp-display").textContent = `${maxHp}/${maxHp}`;
        document.getElementById("mp-display").textContent = `${maxMp}/${maxMp}`;
    }
};

const inventoryController = {
    gridElement: document.getElementById("backpack-grid"),
    inspectorElement: document.getElementById("item-inspector"),
    inspectorDetails: document.querySelector(".inspector-details"),
    inspectorPrompt: document.querySelector(".inspector-prompt"),
    
    backpackCapacity: 20,
    slots: [],
    equippedGear: {
        head: null,
        weapon: null,
        chest: null,
        shield: null,
        ring: null
    },

    init() {
        this.renderBackpackSlots();
        this.populateInitialItems();
        this.setupEquipmentListeners();
    },

    renderBackpackSlots() {
        this.gridElement.innerHTML = "";
        this.slots = [];
        
        for (let index = 0; index < this.backpackCapacity; index++) {
            const slotElement = document.createElement("div");
            slotElement.classList.add("inv-slot");
            slotElement.setAttribute("data-index", index);
            
            this.gridElement.appendChild(slotElement);
            this.slots.push({ element: slotElement, item: null });
        }
    },

    populateInitialItems() {
        retroItemsDatabase.forEach((item, index) => {
            if (index < this.backpackCapacity) {
                this.addItemToSlot(index, item);
            }
        });
    },

    addItemToSlot(slotIndex, item) {
        const slot = this.slots[slotIndex];
        slot.item = item;
        slot.element.classList.add("occupied");
        slot.element.innerHTML = `<span class="item-sprite ${item.rarity}"><i class="fa-solid ${item.icon}"></i></span>`;
        
        slot.element.addEventListener("mouseenter", () => this.inspectItem(item));
        slot.element.addEventListener("mouseleave", () => this.clearInspector());
        slot.element.addEventListener("click", () => this.handleSlotClick(slotIndex));
    },

    removeItemFromSlot(slotIndex) {
        const slot = this.slots[slotIndex];
        slot.item = null;
        slot.element.classList.remove("occupied");
        slot.element.innerHTML = "";
        
        const clone = slot.element.cloneNode(true);
        slot.element.parentNode.replaceChild(clone, slot.element);
        this.slots[slotIndex].element = clone;
    },

    inspectItem(item) {
        this.inspectorPrompt.classList.add("hidden");
        this.inspectorDetails.classList.remove("hidden");
        
        const nameNode = document.getElementById("inspect-name");
        const rarityNode = document.getElementById("inspect-rarity");
        const descNode = document.getElementById("inspect-desc");
        const statsNode = document.getElementById("inspect-stats");

        nameNode.textContent = item.name;
        rarityNode.textContent = item.rarity.replace("rarity-", "");
        rarityNode.className = `item-rarity ${item.rarity}`;
        descNode.textContent = item.desc;
        statsNode.textContent = item.stats;
    },

    clearInspector() {
        this.inspectorPrompt.classList.remove("hidden");
        this.inspectorDetails.classList.add("hidden");
    },

    handleSlotClick(slotIndex) {
        const slot = this.slots[slotIndex];
        if (!slot.item) return;

        const targetSlot = slot.item.slot;
        if (targetSlot === "usable") {
            audioContextManager.playSystemSound(500, 0.25, "sine");
            systemLogger.write(`Consumed ${slot.item.name}. Restoring attributes.`);
            this.removeItemFromSlot(slotIndex);
            this.clearInspector();
            return;
        }

        this.equipItem(slotIndex, targetSlot);
    },

    equipItem(slotIndex, targetSlot) {
        const itemToEquip = this.slots[slotIndex].item;
        const currentlyEquipped = this.equippedGear[targetSlot];

        this.removeItemFromSlot(slotIndex);

        if (currentlyEquipped) {
            this.addItemToSlot(slotIndex, currentlyEquipped);
        }

        this.equippedGear[targetSlot] = itemToEquip;
        this.updateEquipmentUI(targetSlot);
        
        audioContextManager.playSystemSound(400, 0.15, "triangle");
        systemLogger.write(`Equipped ${itemToEquip.name} into ${targetSlot.toUpperCase()} slot.`);
        this.clearInspector();
    },

    updateEquipmentUI(targetSlot) {
        const equipSlotElement = document.getElementById(`slot-${targetSlot}`);
        const iconWrapper = equipSlotElement.querySelector(".item-icon-wrapper");
        const placeholder = equipSlotElement.querySelector(".slot-placeholder");
        const item = this.equippedGear[targetSlot];

        if (item) {
            placeholder.style.display = "none";
            iconWrapper.innerHTML = `<span class="item-sprite ${item.rarity}"><i class="fa-solid ${item.icon}"></i></span>`;
            equipSlotElement.setAttribute("title", `${item.name} (${item.stats})`);
        } else {
            placeholder.style.display = "block";
            iconWrapper.innerHTML = "";
            equipSlotElement.removeAttribute("title");
        }
    },

    setupEquipmentListeners() {
        Object.keys(this.equippedGear).forEach(slotType => {
            const element = document.getElementById(`slot-${slotType}`);
            element.addEventListener("click", () => this.unequipItem(slotType));
        });
    },

    unequipItem(slotType) {
        const itemToUnequip = this.equippedGear[slotType];
        if (!itemToUnequip) return;

        const openSlotIndex = this.findFirstEmptyBackpackSlot();
        if (openSlotIndex === -1) {
            systemLogger.write("Inventory is fully loaded. Cannot unequip items.");
            audioContextManager.playSystemSound(150, 0.2, "sawtooth");
            return;
        }

        this.equippedGear[slotType] = null;
        this.updateEquipmentUI(slotType);
        this.addItemToSlot(openSlotIndex, itemToUnequip);

        audioContextManager.playSystemSound(300, 0.15, "triangle");
        systemLogger.write(`Unequipped ${itemToUnequip.name} and placed back into your bag.`);
    },

    findFirstEmptyBackpackSlot() {
        for (let index = 0; index < this.slots.length; index++) {
            if (!this.slots[index].item) {
                return index;
            }
        }
        return -1;
    }
};

const questBoardController = {
    noticeCards: document.querySelectorAll(".quest-notice"),
    modal: document.getElementById("quest-modal"),
    closeBtn: document.querySelector(".close-modal-btn"),
    acceptBtn: document.getElementById("accept-quest-btn"),
    
    currentActiveQuestId: null,

    init() {
        this.noticeCards.forEach(card => {
            card.addEventListener("click", () => {
                const questId = card.getAttribute("data-quest-id");
                this.openQuestDetails(questId);
            });
        });

        this.closeBtn.addEventListener("click", () => this.closeModal());
        this.acceptBtn.addEventListener("click", () => this.acceptCurrentQuest());
        
        this.modal.addEventListener("click", (event) => {
            if (event.target === this.modal) this.closeModal();
        });
    },

    openQuestDetails(questId) {
        const questData = questNoticesDatabase[questId];
        if (!questData) return;

        this.currentActiveQuestId = questId;
        
        document.getElementById("modal-quest-title").textContent = questData.title;
        document.getElementById("modal-quest-desc").textContent = questData.desc;
        document.getElementById("modal-quest-gold").textContent = `${questData.gold} gp`;
        document.getElementById("modal-quest-xp").textContent = `${questData.xp} XP`;

        this.modal.classList.add("active");
        audioContextManager.playSystemSound(400, 0.1, "sine");
    },

    closeModal() {
        this.modal.classList.remove("active");
        this.currentActiveQuestId = null;
        audioContextManager.playSystemSound(250, 0.08, "sine");
    },

    acceptCurrentQuest() {
        const questData = questNoticesDatabase[this.currentActiveQuestId];
        if (!questData) return;

        audioContextManager.playFanfareSound();
        systemLogger.write(`Notice Accepted: "${questData.title}". Journey to completion starts.`);
        
        const cardToRemove = document.querySelector(`.quest-notice[data-quest-id="${this.currentActiveQuestId}"]`);
        if (cardToRemove) {
            cardToRemove.style.opacity = "0.4";
            cardToRemove.style.pointerEvents = "none";
            cardToRemove.querySelector(".notice-difficulty").textContent = "ACCEPTED";
            cardToRemove.querySelector(".notice-difficulty").style.color = "var(--gold-bright)";
        }

        this.closeModal();
    }
};

const spellbookController = {
    spellItems: document.querySelectorAll(".spell-item"),
    castBtn: document.getElementById("cast-spell-btn"),
    currentSpellKey: "fireball",

    init() {
        this.spellItems.forEach(item => {
            item.addEventListener("click", () => {
                const spellKey = item.getAttribute("data-spell");
                this.switchSpell(spellKey);
            });
        });

        this.castBtn.addEventListener("click", () => this.castCurrentSpell());
        this.switchSpell("fireball");
    },

    switchSpell(spellKey) {
        const spell = spellsDatabase[spellKey];
        if (!spell) return;

        this.currentSpellKey = spellKey;

        this.spellItems.forEach(item => {
            if (item.getAttribute("data-spell") === spellKey) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        const detailContainer = document.getElementById("spell-detail-content");
        detailContainer.style.animation = "none";
        detailContainer.offsetHeight;
        detailContainer.style.animation = "pageFlipEffect 0.25s ease-out";

        document.getElementById("spell-title").textContent = spell.title;
        document.getElementById("spell-chant").textContent = spell.chant;
        document.getElementById("spell-desc").textContent = spell.desc;
        document.getElementById("spell-dmg").textContent = spell.dmg;
        document.getElementById("spell-range").textContent = spell.range;

        audioContextManager.playSystemSound(350, 0.06, "triangle");
    },

    castCurrentSpell() {
        const spell = spellsDatabase[this.currentSpellKey];
        if (!spell) return;

        audioContextManager.playCastSpellSound();
        systemLogger.write(`Casting Spell: "${spell.title}". Manifesting ${spell.dmg} to the target.`);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    crtController.init();
    audioController.init();
    navigationController.init();
    characterSheetController.init();
    inventoryController.init();
    questBoardController.init();
    spellbookController.init();
    
    systemLogger.write("Emulation sequence initialized. Ready for heroic adventures.");
});