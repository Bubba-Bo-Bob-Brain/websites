// ===== DOM Elements =====
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const runeToggle = document.getElementById("runeToggle");
const realmIndicator = document.getElementById("realmIndicator");
const bifrostOverlay = document.getElementById("bifrostOverlay");
const ravenPath = document.getElementById("ravenPath");
const raven = document.getElementById("raven");
const ravenDelivery = document.getElementById("ravenDelivery");
const godList = document.getElementById("godList");
const branches = document.querySelectorAll(".branch");
const ravenSound = document.getElementById("ravenSound");
const bifrostSound = document.getElementById("bifrostSound");

// ===== State =====
let currentRealm = "asgard";
let useRunes = false;
let isRavenFlying = false;

// ===== Elder Futhark Rune Mapping =====
const runeMap = {
    a: "ᚨ", b: "ᚦ", c: "ᚲ", d: "ᛞ", e: "ᛖ", f: "ᚠ", g: "ᚷ", h: "ᚺ",
    i: "ᛁ", j: "ᛡ", k: "ᚲ", l: "ᛚ", m: "ᛗ", n: "ᚾ", o: "ᚩ", p: "ᚹ",
    q: "ᚻ", r: "ᚱ", s: "ᛋ", t: "ᛏ", u: "ᚢ", v: "ᚢ", w: "ᚹ", x: "ᛝ",
    y: "ᛇ", z: "ᛋ",
    A: "ᚨ", B: "ᚦ", C: "ᚲ", D: "ᛞ", E: "ᛖ", F: "ᚠ", G: "ᚷ", H: "ᚺ",
    I: "ᛁ", J: "ᛡ", K: "ᚲ", L: "ᛚ", M: "ᛗ", N: "ᚾ", O: "ᚩ", P: "ᚹ",
    Q: "ᚻ", R: "ᚱ", S: "ᛋ", T: "ᛏ", U: "ᚢ", V: "ᚢ", W: "ᚹ", X: "ᛝ",
    Y: "ᛇ", Z: "ᛋ",
    " ": " ", ".": ".", ",": ",", "!": "!", "?": "?", "'": "'", "-": "-", "(": "(", ")": ")"
};

// ===== Initialize =====
function init() {
    // Set default realm
    updateRealm(currentRealm);

    // Load previous messages (if any)
    loadMessages();

    // Auto-focus message input
    messageInput.focus();

    // Add event listeners
    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    runeToggle.addEventListener("click", toggleRunes);
    branches.forEach(branch => branch.addEventListener("click", switchRealm));
}

// ===== Send Message =====
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // Create message element
    const message = createMessageElement(text, "sent", currentRealm);
    messagesContainer.appendChild(message);

    // Clear input
    messageInput.value = "";
    messageInput.style.height = "auto";

    // Trigger raven delivery animation
    deliverByRaven(message);

    // Save message
    saveMessage(text, "sent", currentRealm);

    // Scroll to bottom
    scrollToBottom();
}

// ===== Create Message Element =====
function createMessageElement(text, type, realm) {
    const message = document.createElement("div");
    message.className = `message ${type} ${realm}-message`;
    message.innerHTML = `
        <div class="message-meta">
            <span class="sender">${type === "sent" ? "You" : getGodName(realm)}</span>
            <span class="time">${getCurrentTime()}</span>
        </div>
        <div class="message-content">
            <div class="knotwork-frame">
                <p class="text">${text}</p>
                <p class="runes" ${useRunes ? "" : "hidden"}>${transliterateToRunes(text)}</p>
            </div>
        </div>
    `;
    return message;
}

// ===== Deliver Message by Raven =====
function deliverByRaven(message) {
    if (isRavenFlying) return;

    isRavenFlying = true;
    ravenDelivery.classList.add("active");

    // Play raven sound
    ravenSound.currentTime = 0;
    ravenSound.play().catch(e => console.log("Audio error:", e));

    // Animate raven flight
    raven.classList.add("flying");
    ravenPath.style.display = "block";

    setTimeout(() => {
        raven.classList.remove("flying");
        ravenPath.style.display = "none";
        ravenDelivery.classList.remove("active");
        isRavenFlying = false;
    }, 2000);
}

// ===== Transliterate to Runes =====
function transliterateToRunes(text) {
    return text.split("").map(char => runeMap[char] || char).join("");
}

// ===== Toggle Runes =====
function toggleRunes() {
    useRunes = !useRunes;
    const allRunes = document.querySelectorAll(".runes");
    const allTexts = document.querySelectorAll(".text");

    allRunes.forEach(runes => {
        runes.hidden = !useRunes;
    });
    allTexts.forEach(text => {
        text.hidden = useRunes;
    });

    runeToggle.innerHTML = useRunes ? '<i class="fa-solid fa-font"></i>' : '<i class="fa-solid fa-ankh"></i>';
}

// ===== Switch Realm =====
function switchRealm(e) {
    const newRealm = e.currentTarget.dataset.realm;
    if (newRealm === currentRealm) return;

    // Activate Bifrost overlay
    bifrostOverlay.classList.add("active");
    bifrostSound.currentTime = 0;
    bifrostSound.play().catch(e => console.log("Audio error:", e));

    // Update current realm after animation
    setTimeout(() => {
        currentRealm = newRealm;
        updateRealm(newRealm);
        bifrostOverlay.classList.remove("active");
    }, 1000);
}

// ===== Update Realm UI =====
function updateRealm(realm) {
    // Update realm indicator
    const realmData = getRealmData(realm);
    realmIndicator.innerHTML = `
        <i class="${realmData.icon} realm-icon"></i>
        <h1>${realmData.name}</h1>
    `;

    // Update active branch
    branches.forEach(branch => {
        branch.classList.toggle("active", branch.dataset.realm === realm);
    });

    // Update chat area theme
    document.body.style.setProperty("--current-realm-color", realmData.color);
}

// ===== Get Realm Data =====
function getRealmData(realm) {
    const realms = {
        asgard: { name: "Asgard", icon: "fa-solid fa-sun", color: "#d4af37" },
        valhalla: { name: "Valhalla", icon: "fa-solid fa-shield-halved", color: "#a8a8a8" },
        midgard: { name: "Midgard", icon: "fa-solid fa-tree", color: "#4a3d2e" },
        jotunheim: { name: "Jötunheim", icon: "fa-solid fa-mountain", color: "#5a6a7a" },
        helheim: { name: "Helheim", icon: "fa-solid fa-skull", color: "#0a2e38" },
        niflheim: { name: "Niflheim", icon: "fa-solid fa-snowflake", color: "#a0d0e0" },
        alfheim: { name: "Álfheim", icon: "fa-solid fa-feather", color: "#2e4a3d" },
        svartalfheim: { name: "Svartálfaheim", icon: "fa-solid fa-hammer", color: "#3a3a3a" },
        muspelheim: { name: "Muspelheim", icon: "fa-solid fa-fire", color: "#8b2e2e" }
    };
    return realms[realm] || realms.asgard;
}

// ===== Get God Name for Realm =====
function getGodName(realm) {
    const gods = {
        asgard: "Odin",
        valhalla: "Valkyrie",
        midgard: "Heimdall",
        jotunheim: "Thrym",
        helheim: "Hel",
        niflheim: "Ymir",
        alfheim: "Freyr",
        svartalfheim: "Brokkr",
        muspelheim: "Surt"
    };
    return gods[realm] || "Unknown";
}

// ===== Get Current Time =====
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ===== Auto-Resize Textarea =====
messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";
    messageInput.style.height = `${messageInput.scrollHeight}px`;
});

// ===== Scroll to Bottom =====
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== Save Message to LocalStorage =====
function saveMessage(text, type, realm) {
    const messages = JSON.parse(localStorage.getItem("norseMessages")) || [];
    messages.push({ text, type, realm, time: new Date().toISOString() });
    localStorage.setItem("norseMessages", JSON.stringify(messages));
}

// ===== Load Messages from LocalStorage =====
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem("norseMessages")) || [];
    messages.forEach(msg => {
        const message = createMessageElement(msg.text, msg.type, msg.realm);
        messagesContainer.appendChild(message);
    });
    scrollToBottom();
}

// ===== Simulate Incoming Messages =====
function simulateIncomingMessage() {
    const realms = ["asgard", "valhalla", "midgard", "helheim", "jotunheim"];
    const randomRealm = realms[Math.floor(Math.random() * realms.length)];
    const messages = [
        "The Norns weave fate with unyielding hands.",
        "Ragnarök approaches. Are you ready?",
        "The mead in Valhalla is ever-flowing.",
        "Beware the frost giants of Jötunheim.",
        "Huginn and Muninn bring news from afar.",
        "The Bifrost shimmers with divine light.",
        "Hel awaits those who fall in battle.",
        "Mjölnir strikes with the fury of Thor."
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Create and append message
    const message = createMessageElement(randomMessage, "received", randomRealm);
    messagesContainer.appendChild(message);

    // Trigger raven delivery
    deliverByRaven(message);

    // Save message
    saveMessage(randomMessage, "received", randomRealm);

    // Scroll to bottom
    scrollToBottom();
}

// ===== Random Incoming Messages (Optional) =====
setInterval(simulateIncomingMessage, 10000);

// ===== Initialize App =====
init();