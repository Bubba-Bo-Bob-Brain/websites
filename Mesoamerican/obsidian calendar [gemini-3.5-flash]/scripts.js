const daySigns = [
  { name: "CIPACTLI", meaning: "Alligator / Source of Life", desc: "The primordial sea dragon. A day of raw potential, earth energy, and creation. Initiates new spiritual undertakings." },
  { name: "EHECATL", meaning: "Wind / Breath of Sky", desc: "The breath of life and vector of divine inspiration. Ruled by Quetzalcoatl. Excellent for mental agility and cleansing rituals." },
  { name: "CALLI", meaning: "House / Inner Temple", desc: "The sanctuary of the soul. Represents family, safety, and deep internal contemplation. Excellent for anchoring energy." },
  { name: "CUETZPALIN", meaning: "Lizard / Regeneration", desc: "Symbolizes rapid physical recovery, quick reflexes, and biological growth. A highly auspicious day for health." },
  { name: "COATL", meaning: "Serpent / Kundalini & Earth", desc: "The vehicle of cosmic wisdom and raw earthly vitality. Triggers Kundalini movement and links base instincts with high intellect." },
  { name: "MIQUIZTLI", meaning: "Death / Rebirth Cycle", desc: "The transformative threshold. Not physical death, but the shedding of obsolete spiritual shells to welcome new life." },
  { name: "MAZATL", meaning: "Deer / Grace & Hunt", desc: "Represents the sovereign spirits of the deep forest. A day of alertness, protective barriers, and raw instincts." },
  { name: "TOCHTLI", meaning: "Rabbit / Abundance", desc: "Symbolizes rapid fertility, the harvest of efforts, and celebratory intoxication. Associated with the lunar goddess." },
  { name: "ATL", meaning: "Water / Purification", desc: "The dynamic fluid of emotions. Highly volatile but exceptionally purifying. Associated with Tlaloc's life-giving storms." },
  { name: "ITZCUINTLI", meaning: "Dog / Guide to Underworld", desc: "The loyal companion that navigates souls through the dark subterranean trials of Mictlan. Day of deep loyalty." },
  { name: "OZOMAHTLI", meaning: "Monkey / Play & Craft", desc: "The master of arts, trickery, and lighthearted creation. Invites celebration, performance, and breaking rigid boundaries." },
  { name: "MALINALLI", meaning: "Grass / Persistence", desc: "Tough, unyielding mountain grass. Symbolizes the persistent thread of generational lineages and indestructible life force." },
  { name: "ACATL", meaning: "Reed / Authority & Arrow", desc: "The arrow of divine justice and the scepter of governance. Connected to Quetzalcoatl's celestial return." },
  { name: "OCELOTL", meaning: "Jaguar / Nocturnal Power", desc: "The shadow hunter of the cosmos. Symbolizes deep obsidian sight, spiritual sorcery, and mastery of the unknown night." },
  { name: "CUAUHTLI", meaning: "Eagle / Solar Vision", desc: "The ultimate solar flyer. Represents razor-sharp focus, ascending perspective, and high-vibrational celestial victory." },
  { name: "COZCACUAUHTLI", meaning: "Vulture / Wisdom & Age", desc: "The keeper of historical memory and deep planetary age. Cleanses negative karmic remains. Day of profound introspection." },
  { name: "OLLIN", meaning: "Movement / Cosmic Shift", desc: "The force of earthquake and gravity. Demands immediate adjustment to seismic shifts in consciousness. Center of the Fifth Sun." },
  { name: "TECPATL", meaning: "Flint / Razor Intellect", desc: "The sacrificial knife of truth. Slices through self-deception and severs toxic spiritual attachments instantly." },
  { name: "QUIAHUITL", meaning: "Rain / Storm & Cleansing", desc: "The downpour that nourishes and the lightning that transforms. Clears old heavy atmosphere to build pristine fields." },
  { name: "XOCHITL", meaning: "Flower / Artistic Bliss", desc: "The ultimate culmination of beauty, artistic creation, and divine love. Represents the ultimate spiritual blossom." }
];

const pantheon = [
  {
    name: "QUETZALCOATL",
    domain: "The Feathered Serpent • Lord of Wisdom & Wind",
    temperament: 85,
    resonance: 62,
    avatarStyle: "radial-gradient(circle, #00ffaa 10%, #043825 80%)",
    tributes: [
      { name: "Liquid Gold Cocoa", qty: "40 Sacred Vessels", status: "fulfilled", statusText: "SECURED", type: "gold" },
      { name: "Polished Jade Spheres", qty: "12 Flawless Orbs", status: "pending", statusText: "9/12 COLLECTED", type: "jade" },
      { name: "Quetzal Feathers", qty: "100 Plumage Blades", status: "critical", statusText: "URGENT", type: "feather" }
    ]
  },
  {
    name: "TEZCATLIPOCA",
    domain: "Lord of the Smoking Mirror • Ruler of Fate & Shadow",
    temperament: 40,
    resonance: 95,
    avatarStyle: "radial-gradient(circle, #ff00ff 10%, #0d1114 80%)",
    tributes: [
      { name: "Obsidian Mirror Blades", qty: "5 Polished Discs", status: "fulfilled", statusText: "SECURED", type: "gold" },
      { name: "Copal Incense", qty: "18 Burning Urns", status: "critical", statusText: "URGENT", type: "feather" },
      { name: "Jaguar Pelts", qty: "3 Sacred Furs", status: "pending", statusText: "1/3 COLLECTED", type: "jade" }
    ]
  },
  {
    name: "TLALOC",
    domain: "Giver of Rain • Master of Thunder & Cultivation",
    temperament: 70,
    resonance: 50,
    avatarStyle: "radial-gradient(circle, #00d2ff 10%, #021d13 80%)",
    tributes: [
      { name: "Mountain Spring Water", qty: "100 Ceramic Jars", status: "fulfilled", statusText: "SECURED", type: "jade" },
      { name: "Maize Kernels", qty: "4 Sacred Sacks", status: "fulfilled", statusText: "SECURED", type: "gold" },
      { name: "Aquamarine Stones", qty: "50 Raw Nuggets", status: "pending", statusText: "25/50 COLLECTED", type: "jade" }
    ]
  },
  {
    name: "HUITZILOPOCHTLI",
    domain: "The Solar Warrior • Defender of the Fifth Sun",
    temperament: 95,
    resonance: 90,
    avatarStyle: "radial-gradient(circle, #ff3333 10%, #5c4314 80%)",
    tributes: [
      { name: "Golden Eagle Shields", qty: "10 Embossed Plates", status: "fulfilled", statusText: "SECURED", type: "gold" },
      { name: "Sacred Fire Fuel", qty: "50 Pine Log Piles", status: "pending", statusText: "40/50 SECURED", type: "jade" },
      { name: "Crimson Banners", qty: "20 Woven Hangings", status: "critical", statusText: "REQUIRED", type: "feather" }
    ]
  }
];

let currentDaySignIndex = 19;
let currentDayNumber = 13;
let cumulativeOuterRotation = 0;
let cumulativeMiddleRotation = 0;

const eclipseTimer = document.getElementById("eclipseTimer");
const ringOuter = document.getElementById("ringOuter");
const ringMiddle = document.getElementById("ringMiddle");
const activeReading = document.getElementById("activeReading");
const btnPrevDay = document.getElementById("btnPrevDay");
const btnNextDay = document.getElementById("btnNextDay");
const deityAvatar = document.getElementById("deityAvatar");
const deityTitle = document.getElementById("deityTitle");
const deityDomain = document.getElementById("deityDomain");
const temperamentBar = document.getElementById("temperamentBar");
const resonanceBar = document.getElementById("resonanceBar");
const tributeList = document.getElementById("tributeList");
const glyphDictionary = document.getElementById("glyphDictionary");
const translationPanel = document.getElementById("translationPanel");
const transTitle = document.getElementById("transTitle");
const transSub = document.getElementById("transSub");
const transBody = document.getElementById("transBody");

function updateEclipseCountdown() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 34);
  targetDate.setHours(targetDate.getHours() + 14);
  targetDate.setMinutes(targetDate.getMinutes() + 22);

  function tick() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, "0");
    const padDays = (num) => String(num).padStart(3, "0");

    eclipseTimer.textContent = `${padDays(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  tick();
  setInterval(tick, 1000);
}

function updateDeityCard(signIndex) {
  const deityIndex = Math.floor(signIndex / 5) % pantheon.length;
  const deity = pantheon[deityIndex];

  deityTitle.textContent = deity.name;
  deityDomain.textContent = deity.domain;
  temperamentBar.style.width = `${deity.temperament}%`;
  resonanceBar.style.width = `${deity.resonance}%`;
  deityAvatar.style.background = deity.avatarStyle;

  tributeList.innerHTML = "";
  deity.tributes.forEach(tribute => {
    const li = document.createElement("li");
    li.className = "tribute-item";

    let iconClass = "gold-glyph";
    if (tribute.type === "jade") iconClass = "jade-glyph";
    if (tribute.type === "feather") iconClass = "feather-glyph";

    li.innerHTML = `
      <div class="tribute-icon ${iconClass}"></div>
      <div class="tribute-info">
        <span class="tribute-name">${tribute.name}</span>
        <span class="tribute-qty">${tribute.qty}</span>
      </div>
      <span class="tribute-status ${tribute.status}">${tribute.statusText}</span>
    `;
    tributeList.appendChild(li);
  });
}

function updateWheelVisuals() {
  const segments = ringOuter.querySelectorAll(".glyph-segment");
  segments.forEach((seg, index) => {
    if (index === currentDaySignIndex) {
      seg.classList.add("active-glyph");
    } else {
      seg.classList.remove("active-glyph");
    }
  });

  const numbers = ringMiddle.querySelectorAll(".number-segment");
  numbers.forEach((numSeg, index) => {
    const segNumber = parseInt(numSeg.getAttribute("data-number"), 10);
    if (segNumber === currentDayNumber) {
      numSeg.classList.add("active-number");
    } else {
      numSeg.classList.remove("active-number");
    }
  });

  activeReading.innerHTML = `
    <div class="active-day-number">${currentDayNumber}</div>
    <div class="active-day-name">${daySigns[currentDaySignIndex].name}</div>
  `;

  updateDeityCard(currentDaySignIndex);
}

function rotateWheelToState() {
  cumulativeOuterRotation = -currentDaySignIndex * 18;
  cumulativeMiddleRotation = -(currentDayNumber - 1) * 27.692;

  ringOuter.style.transform = `rotate(${cumulativeOuterRotation}deg)`;
  ringMiddle.style.transform = `rotate(${cumulativeMiddleRotation}deg)`;

  updateWheelVisuals();
}

function setupWheelInteractions() {
  const outerSegments = ringOuter.querySelectorAll(".glyph-segment");
  outerSegments.forEach((seg, idx) => {
    seg.addEventListener("click", () => {
      currentDaySignIndex = idx;
      rotateWheelToState();
      displayTranslation(daySigns[idx].name, daySigns[idx].meaning, daySigns[idx].desc);
    });

    seg.addEventListener("mouseenter", () => {
      displayTranslation(daySigns[idx].name, daySigns[idx].meaning, daySigns[idx].desc);
    });
  });

  const middleSegments = ringMiddle.querySelectorAll(".number-segment");
  middleSegments.forEach((numSeg) => {
    numSeg.addEventListener("click", () => {
      currentDayNumber = parseInt(numSeg.getAttribute("data-number"), 10);
      rotateWheelToState();
    });
  });

  btnPrevDay.addEventListener("click", () => {
    currentDaySignIndex = (currentDaySignIndex - 1 + 20) % 20;
    currentDayNumber = (currentDayNumber - 2 + 13) % 13 + 1;
    rotateWheelToState();
  });

  btnNextDay.addEventListener("click", () => {
    currentDaySignIndex = (currentDaySignIndex + 1) % 20;
    currentDayNumber = (currentDayNumber % 13) + 1;
    rotateWheelToState();
  });
}

function displayTranslation(title, subtitle, body) {
  transTitle.textContent = title;
  transSub.textContent = subtitle;
  transBody.textContent = body;
}

function setupDictionaryInteractions() {
  const items = glyphDictionary.querySelectorAll(".glyph-item");
  items.forEach(item => {
    item.addEventListener("mouseenter", () => {
      const label = item.querySelector(".glyph-label").textContent;
      const translation = item.getAttribute("data-translate");
      const description = item.getAttribute("data-desc");
      displayTranslation(label, translation, description);
    });

    item.addEventListener("click", () => {
      const label = item.querySelector(".glyph-label").textContent;
      const indexInSigns = daySigns.findIndex(sign => sign.name === label);
      if (indexInSigns !== -1) {
        currentDaySignIndex = indexInSigns;
        rotateWheelToState();
      }
    });
  });
}

function setupTimelineNavigation() {
  const steps = document.querySelectorAll(".timeline-step");
  steps.forEach(step => {
    step.addEventListener("click", () => {
      steps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");
      
      const dateText = step.querySelector(".timeline-date").textContent;
      const match = dateText.match(/DAY (\d+) (\w+)/);
      if (match) {
        const numVal = parseInt(match[1], 10);
        const nameVal = match[2];
        
        const signIdx = daySigns.findIndex(sign => sign.name === nameVal);
        if (signIdx !== -1) {
          currentDaySignIndex = signIdx;
          currentDayNumber = numVal;
          rotateWheelToState();
        }
      }
    });
  });
}

function initializeCeremonialSystem() {
  updateEclipseCountdown();
  rotateWheelToState();
  setupWheelInteractions();
  setupDictionaryInteractions();
  setupTimelineNavigation();
}

document.addEventListener("DOMContentLoaded", initializeCeremonialSystem);