const svgMap = document.getElementById('world-map');
const territoriesGroup = document.getElementById('territories-group');
const routesGroup = document.getElementById('routes-group');
const annotationsGroup = document.getElementById('annotations-group');
const markersGroup = document.getElementById('markers-group');

const modalOverlay = document.getElementById('info-modal');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalLore = document.getElementById('modal-lore');
const modalDetails = document.getElementById('modal-details');
const modalImage = document.getElementById('modal-image');
const closeModalBtn = document.getElementById('close-modal');
const eraSlider = document.getElementById('era-slider');
const eraNameDisplay = document.getElementById('era-name');
const toggleRoutesBtn = document.getElementById('toggle-routes');
const toggleMarkersBtn = document.getElementById('toggle-markers');
const toggleMythsBtn = document.getElementById('toggle-myths');

const eraNames = [
  "Era of the First Dawn",
  "Age of Whispering Stones",
  "The Gilded Concordance",
  "Era of the Sundering Veil"
];

const realmsData = {
  valdris: {
    name: "Valdris Empire",
    capital: "Aurelian Citadel",
    lore: "The iron fist of the central plains. Their legions carved roads through mountains, and their aqueducts still weep with ancient magic. The Empress Eternal sits upon the Onyx Throne, her eyes seeing all trade that crosses the continent.",
    details: "Population: 1.2 million souls. Exports: Mithril-forged steel, enchanted grain.",
    color: "#8b3a3a"
  },
  sylvan: {
    name: "Sylvan Enclave",
    capital: "Elderroot Bastion",
    lore: "Deep within the Whisperwood, the Sylvans sing to the trees and weave light into physical form. They rarely trust outsiders, but their moon-silver arrows and healing sap are priceless across all kingdoms.",
    details: "Population: Unknown. Exports: Moon-silver, Starfall Amber, living wood.",
    color: "#2d5a27"
  },
  kheth: {
    name: "Kheth Dominion",
    capital: "The Golden Spire of Kheth-Set",
    lore: "A desert empire built upon the backs of ancient sand-wyrms. Their scholars mapped the stars long before the other kingdoms learned to write. Their caravans carry spices, silk, and secrets.",
    details: "Population: 800,000. Exports: Sun-glass, wyrm-scale armor, celestial charts.",
    color: "#b8860b"
  },
  north: {
    name: "Northern Holds",
    capital: "Hrothgar's Stand",
    lore: "Fierce clans who navigate the frozen fjords in longships carved from ice-oak. They trade in rune-carved whalebone and the mysterious Aurora Crystals that hum with the voices of ancestors.",
    details: "Population: 400,000. Exports: Aurora Crystals, frost-fur, runic talismans.",
    color: "#4a6fa5"
  },
  sunken: {
    name: "Sunken Realms",
    capital: "Nautilus Throne",
    lore: "The drowned kingdom of the Abyssal Merfolk. Their coral palaces rise only during the eclipse. They control the vital sea trade routes and demand tribute in songs and memories.",
    details: "Population: Subaquatic. Exports: Abyssal pearls, memory-glass, tidal charms.",
    color: "#3b6b6b"
  }
};

const cities = [
  { id: "city1", realm: "valdris", name: "Aurelian Citadel", type: "capital", cx: 450, cy: 380, lore: "Heart of the Empire. The roads converge here." },
  { id: "city2", realm: "valdris", name: "Ironhollow", type: "city", cx: 380, cy: 440, lore: "Mining town famous for mithril alloys." },
  { id: "city3", realm: "sylvan", name: "Elderroot Bastion", type: "capital", cx: 220, cy: 250, lore: "Living city grown from a single World-Tree seed." },
  { id: "city4", realm: "sylvan", name: "Moonshade Glade", type: "city", cx: 170, cy: 310, lore: "Alchemists craft potent healing salves here." },
  { id: "city5", realm: "kheth", name: "Golden Spire", type: "capital", cx: 750, cy: 520, lore: "Towers above the dunes, visible for miles." },
  { id: "city6", realm: "kheth", name: "Oasis of Glass", type: "city", cx: 680, cy: 570, lore: "Water mirrors the sky; home to astrologers." },
  { id: "city7", realm: "north", name: "Hrothgar's Stand", type: "capital", cx: 850, cy: 120, lore: "Built into a frozen waterfall." },
  { id: "city8", realm: "north", name: "Skald's Rest", type: "city", cx: 920, cy: 180, lore: "A port where longships are blessed by rune-priests." },
  { id: "city9", realm: "sunken", name: "Nautilus Throne", type: "capital", cx: 540, cy: 700, lore: "Only visible during the lowest tides." },
  { id: "city10", realm: "sunken", name: "Coral Drift", type: "city", cx: 600, cy: 660, lore: "Floating market for surface dwellers." }
];

const ruins = [
  { id: "ruin1", name: "Obsidian Ziggurat", cx: 320, cy: 550, lore: "A pre-Empire structure. Whispers emanate from its peak during full moons." },
  { id: "ruin2", name: "Frozen Colossus", cx: 780, cy: 250, lore: "A giant stone warrior half-buried in ice. Its eyes glow when the aurora dances." },
  { id: "ruin3", name: "Sunken Library", cx: 480, cy: 620, lore: "Contains scrolls that rewrite themselves. Merfolk guard it fiercely." }
];

const myths = [
  { id: "myth1", name: "The Weeping Colossus", cx: 550, cy: 180, lore: "A giant petrified god mourning the loss of the old world. Tears are pure mythril." },
  { id: "myth2", name: "Serpent's Gate", cx: 110, cy: 500, lore: "A whirlpool that leads to the underworld. Souls can be heard singing." },
  { id: "myth3", name: "Sky-Mirror Plateau", cx: 900, cy: 450, lore: "Where the sky touches the earth. Visions of other eras appear in the reflections." }
];

const tradeRoutes = [
  { from: "city1", to: "city3", id: "route1" },
  { from: "city1", to: "city5", id: "route2" },
  { from: "city1", to: "city7", id: "route3" },
  { from: "city3", to: "city4", id: "route4" },
  { from: "city5", to: "city6", id: "route5" },
  { from: "city7", to: "city8", id: "route6" },
  { from: "city9", to: "city10", id: "route7" },
  { from: "city2", to: "city1", id: "route8" },
  { from: "city5", to: "city9", id: "route9" },
  { from: "city8", to: "city3", id: "route10" }
];

let currentEra = 0;
let routesVisible = true;
let markersVisible = true;
let mythsVisible = false;

function getCityById(id) {
  return cities.find(c => c.id === id);
}

function drawMap() {
  territoriesGroup.innerHTML = '';
  routesGroup.innerHTML = '';
  markersGroup.innerHTML = '';
  annotationsGroup.innerHTML = '';

  drawTerritories();
  if (routesVisible) drawTradeRoutes();
  if (markersVisible) drawSettlements();
  if (mythsVisible) drawMyths();
}

function drawTerritories() {
  const paths = [
    { d: "M250,100 L600,80 L700,250 L650,450 L450,500 L200,400 L150,200 Z", realm: "valdris" },
    { d: "M80,150 L250,100 L200,400 L100,380 L50,250 Z", realm: "sylvan" },
    { d: "M650,450 L700,250 L950,300 L1000,500 L850,650 L600,550 Z", realm: "kheth" },
    { d: "M600,80 L950,50 L1050,200 L780,250 L700,250 Z", realm: "north" },
    { d: "M400,500 L600,550 L850,650 L750,780 L450,750 L300,650 Z", realm: "sunken" }
  ];

  paths.forEach(p => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", p.d);
    path.setAttribute("fill", realmsData[p.realm].color);
    path.setAttribute("fill-opacity", "0.35");
    path.setAttribute("stroke", "#2b1a0c");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("data-realm", p.realm);
    path.style.cursor = "pointer";
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      openRealmModal(p.realm);
    });
    territoriesGroup.appendChild(path);
  });
}

function drawTradeRoutes() {
  tradeRoutes.forEach(route => {
    const fromCity = getCityById(route.from);
    const toCity = getCityById(route.to);
    if (!fromCity || !toCity) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", fromCity.cx);
    line.setAttribute("y1", fromCity.cy);
    line.setAttribute("x2", toCity.cx);
    line.setAttribute("y2", toCity.cy);
    line.setAttribute("stroke", "#8b4513");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-dasharray", "8 6");
    line.setAttribute("opacity", "0.7");
    line.classList.add("trade-route-line");
    routesGroup.appendChild(line);
  });
}

function drawSettlements() {
  cities.forEach(city => {
    drawMarker(city, city.type === 'capital' ? 'capital' : 'city');
  });
  ruins.forEach(ruin => {
    drawMarker(ruin, 'ruin');
  });
}

function drawMyths() {
  myths.forEach(myth => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${myth.cx}, ${myth.cy})`);
    g.classList.add("myth-marker");
    g.style.cursor = "pointer";

    const outer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outer.setAttribute("r", "14");
    outer.setAttribute("fill", "none");
    outer.setAttribute("stroke", "#d4af37");
    outer.setAttribute("stroke-width", "2");
    outer.setAttribute("stroke-dasharray", "4 3");
    g.appendChild(outer);

    const inner = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    inner.setAttribute("points", "0,-10 9,5 -9,5");
    inner.setAttribute("fill", "#d4af37");
    inner.setAttribute("opacity", "0.9");
    g.appendChild(inner);

    g.addEventListener('click', (e) => {
      e.stopPropagation();
      openLocationModal(myth);
    });
    markersGroup.appendChild(g);
  });
}

function drawMarker(location, type) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${location.cx}, ${location.cy})`);
  g.classList.add("map-marker");
  g.style.cursor = "pointer";

  if (type === 'capital') {
    const star = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    star.setAttribute("points", "0,-12 3,-4 12,-4 5,2 7,10 0,6 -7,10 -5,2 -12,-4 -3,-4");
    star.setAttribute("fill", "#b8860b");
    star.setAttribute("stroke", "#2b1a0c");
    star.setAttribute("stroke-width", "1.5");
    g.appendChild(star);
  } else if (type === 'city') {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "7");
    circle.setAttribute("fill", "#8b4513");
    circle.setAttribute("stroke", "#2b1a0c");
    circle.setAttribute("stroke-width", "1.5");
    g.appendChild(circle);
  } else if (type === 'ruin') {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    rect.setAttribute("points", "0,-9 8,6 -8,6");
    rect.setAttribute("fill", "#4a3822");
    rect.setAttribute("stroke", "#2b1a0c");
    rect.setAttribute("stroke-width", "1.2");
    g.appendChild(rect);
  }

  g.addEventListener('click', (e) => {
    e.stopPropagation();
    openLocationModal(location);
  });
  markersGroup.appendChild(g);
}

function openRealmModal(realmKey) {
  const realm = realmsData[realmKey];
  if (!realm) return;
  modalTitle.textContent = realm.name;
  modalSubtitle.textContent = `Capital: ${realm.capital}`;
  modalLore.textContent = realm.lore;
  modalDetails.textContent = realm.details;
  modalImage.textContent = `🏛️ ${realm.name} Banner`;
  modalOverlay.classList.remove('hidden');
}

function openLocationModal(location) {
  modalTitle.textContent = location.name;
  modalSubtitle.textContent = location.type ? location.type.toUpperCase() : 'MYTHIC SITE';
  modalLore.textContent = location.lore;
  modalDetails.textContent = '';
  modalImage.textContent = `🗺️ ${location.name}`;
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

eraSlider.addEventListener('input', (e) => {
  currentEra = parseInt(e.target.value, 10);
  eraNameDisplay.textContent = eraNames[currentEra];
  updateEraVisuals();
});

function updateEraVisuals() {
  const territories = document.querySelectorAll('#territories-group path');
  territories.forEach(path => {
    const realm = path.getAttribute('data-realm');
    let opacity = 0.35;
    if (currentEra === 1 && realm === 'sylvan') opacity = 0.6;
    if (currentEra === 2 && realm === 'kheth') opacity = 0.65;
    if (currentEra === 3 && realm === 'sunken') opacity = 0.7;
    if (currentEra === 3 && realm === 'north') opacity = 0.2;
    path.setAttribute('fill-opacity', opacity);
  });
  const routes = document.querySelectorAll('.trade-route-line');
  routes.forEach((line, idx) => {
    line.setAttribute('opacity', currentEra === 3 && idx > 5 ? 0.2 : 0.7);
  });
}

toggleRoutesBtn.addEventListener('click', () => {
  routesVisible = !routesVisible;
  toggleRoutesBtn.classList.toggle('active', routesVisible);
  drawMap();
});

toggleMarkersBtn.addEventListener('click', () => {
  markersVisible = !markersVisible;
  toggleMarkersBtn.classList.toggle('active', markersVisible);
  drawMap();
});

toggleMythsBtn.addEventListener('click', () => {
  mythsVisible = !mythsVisible;
  toggleMythsBtn.classList.toggle('active', mythsVisible);
  drawMap();
});

const legendRealmItems = document.querySelectorAll('.realm-item');
legendRealmItems.forEach(item => {
  item.addEventListener('click', () => {
    const realm = item.getAttribute('data-realm');
    if (realm && realmsData[realm]) {
      openRealmModal(realm);
    }
  });
});

drawMap();