const CALENDAR_DATA = {
  daySigns: [
    { name: 'Cipactli', symbol: '☰', short: 'Cip', direction: 'East', deity: 'Tonacatecuhtli', tonal: 'Crocodile', portent: 'favorable' },
    { name: 'Ehecatl', symbol: '◎', short: 'Ehe', direction: 'North', deity: 'Quetzalcoatl', tonal: 'Wind', portent: 'favorable' },
    { name: 'Calli', symbol: '⌂', short: 'Cal', direction: 'West', deity: 'Tepeyollotl', tonal: 'House', portent: 'neutral' },
    { name: 'Cuetzpalin', symbol: '◭', short: 'Cue', direction: 'South', deity: 'Huehuecoyotl', tonal: 'Lizard', portent: 'favorable' },
    { name: 'Coatl', symbol: '∞', short: 'Coa', direction: 'East', deity: 'Chalchiuhtlicue', tonal: 'Serpent', portent: 'neutral' },
    { name: 'Miquiztli', symbol: '☠', short: 'Miq', direction: 'North', deity: 'Tezcatlipoca', tonal: 'Death', portent: 'unfavorable' },
    { name: 'Mazatl', symbol: 'Ƶ', short: 'Maz', direction: 'West', deity: 'Tlaloc', tonal: 'Deer', portent: 'favorable' },
    { name: 'Tochtli', symbol: '◯', short: 'Toch', direction: 'South', deity: 'Mayahuel', tonal: 'Rabbit', portent: 'favorable' },
    { name: 'Atl', symbol: '≈', short: 'Atl', direction: 'East', deity: 'Xiuhtecuhtli', tonal: 'Water', portent: 'unfavorable' },
    { name: 'Itzcuintli', symbol: '◆', short: 'Itz', direction: 'North', deity: 'Mictlantecuhtli', tonal: 'Dog', portent: 'favorable' },
    { name: 'Ozomatli', symbol: '✦', short: 'Ozo', direction: 'West', deity: 'Xōchipilli', tonal: 'Monkey', portent: 'favorable' },
    { name: 'Malinalli', symbol: '⚘', short: 'Mal', direction: 'South', deity: 'Nanahuatzin', tonal: 'Grass', portent: 'neutral' },
    { name: 'Acatl', symbol: '†', short: 'Aca', direction: 'East', deity: 'Tezcatlipoca', tonal: 'Reed', portent: 'neutral' },
    { name: 'Ocelotl', symbol: '◉', short: 'Oce', direction: 'North', deity: 'Tezcatlipoca', tonal: 'Jaguar', portent: 'unfavorable' },
    { name: 'Cuauhtli', symbol: '▲', short: 'Cua', direction: 'West', deity: 'Huitzilopochtli', tonal: 'Eagle', portent: 'favorable' },
    { name: 'Cozcacuauhtli', symbol: '▽', short: 'Coz', direction: 'South', deity: 'Itzpapalotl', tonal: 'Vulture', portent: 'neutral' },
    { name: 'Ollin', symbol: '✤', short: 'Oli', direction: 'Center', deity: 'Xolotl', tonal: 'Movement', portent: 'neutral' },
    { name: 'Tecpatl', symbol: '◇', short: 'Tec', direction: 'North', deity: 'Tezcatlipoca', tonal: 'Flint Knife', portent: 'unfavorable' },
    { name: 'Quiahuitl', symbol: '⌇', short: 'Qui', direction: 'West', deity: 'Tlaloc', tonal: 'Rain', portent: 'unfavorable' },
    { name: 'Xochitl', symbol: '✿', short: 'Xoc', direction: 'South', deity: 'Xōchipilli', tonal: 'Flower', portent: 'favorable' }
  ],
  trecenaDeities: [
    'Tonacatecuhtli', 'Quetzalcoatl', 'Tezcatlipoca', 'Xiuhtecuhtli',
    'Tlaloc', 'Chalchiuhtlicue', 'Huitzilopochtli', 'Xolotl',
    'Mictlantecuhtli', 'Tlazoltéotl', 'Xōchipilli', 'Huehuecoyotl',
    'Itzpapalotl'
  ],
  veintenas: [
    { name: 'Izcalli', meaning: 'Growth' },
    { name: 'Atlcahualo', meaning: 'Water Left' },
    { name: 'Tlacaxipehualiztli', meaning: 'Flaying of Men' },
    { name: 'Tozoztontli', meaning: 'Small Vigil' },
    { name: 'Hueytozoztli', meaning: 'Great Vigil' },
    { name: 'Toxcatl', meaning: 'Drought' },
    { name: 'Etzalcualiztli', meaning: 'Eating of Etzalli' },
    { name: 'Tecuilhuitontli', meaning: 'Small Feast of Lords' },
    { name: 'Hueytecuilhuitl', meaning: 'Great Feast of Lords' },
    { name: 'Tlaxochimaco', meaning: 'Giving of Flowers' },
    { name: 'Xōkohuetzi', meaning: 'Fruit Falls' },
    { name: 'Panquetzaliztli', meaning: 'Raising of Banners' },
    { name: 'Atemoztli', meaning: 'Falling Water' },
    { name: 'Tititl', meaning: 'Contraction' },
    { name: 'Pachtontli', meaning: 'Small Moss' },
    { name: 'Hueypachtli', meaning: 'Great Moss' },
    { name: 'Quecholli', meaning: 'Precious Feather' },
    { name: 'Ochpaniztli', meaning: 'Sweeping of Roads' }
  ],
  yearBearers: ['Calli', 'Tochtli', 'Acatl', 'Tecpatl'],
  nightLords: [
    'Xiuhtecuhtli', 'Tlaloc', 'Tezcatlipoca', 'Quetzalcoatl',
    'Mictlantecuhtli', 'Chalchiuhtlicue', 'Centéotl', 'Tlazoltéotl', 'Xōchipilli'
  ],
  deities: {
    'Huitzilopochtli': { title: 'Lord of the Southern Sun', portrait: '☉' },
    'Quetzalcoatl': { title: 'Feathered Serpent of the Dawn', portrait: '◎' },
    'Tezcatlipoca': { title: 'Lord of the Smoking Mirror', portrait: '◉' },
    'Tlaloc': { title: 'He Who Makes Things Grow', portrait: '≈' },
    'Xiuhtecuhtli': { title: 'Lord of the Center Fire', portrait: '✶' },
    'Xolotl': { title: 'Twilight Dog of the Sun', portrait: '✤' },
    'Mictlantecuhtli': { title: 'Lord of the Underworld', portrait: '☠' },
    'Chalchiuhtlicue': { title: 'She of the Jade Skirt', portrait: '◈' },
    'Tonacatecuhtli': { title: 'Lord of Our Flesh', portrait: '▲' },
    'Tepeyollotl': { title: 'Heart of the Mountain', portrait: '◆' },
    'Huehuecoyotl': { title: 'Old Coyote of Music', portrait: '∆' },
    'Mayahuel': { title: 'She of the Maguey', portrait: '◇' },
    'Nanahuatzin': { title: 'The Pustulous One', portrait: '●' },
    'Itzpapalotl': { title: 'Obsidian Butterfly', portrait: '▽' },
    'Xōchipilli': { title: 'Prince of Flowers', portrait: '✿' },
    'Tlazoltéotl': { title: 'Filth Eater and Confessor', portrait: '⚘' },
    'Centéotl': { title: 'God of the Maize Ear', portrait: '▮' }
  },
  zodiacSigns: [
    { name: 'Cipactli', meaning: 'Crocodile — Primordial Creation', symbol: '☰', startMonth: 3, startDay: 21 },
    { name: 'Ehecatl', meaning: 'Wind — Breath of Spirit', symbol: '◎', startMonth: 4, startDay: 20 },
    { name: 'Calli', meaning: 'House — Shelter of Becoming', symbol: '⌂', startMonth: 5, startDay: 21 },
    { name: 'Cuetzpalin', meaning: 'Lizard — Vitality of the Sun', symbol: '◭', startMonth: 6, startDay: 21 },
    { name: 'Coatl', meaning: 'Serpent — Wisdom Path', symbol: '∞', startMonth: 7, startDay: 23 },
    { name: 'Miquiztli', meaning: 'Death — Transformation Gate', symbol: '☠', startMonth: 8, startDay: 23 },
    { name: 'Mazatl', meaning: 'Deer — Pathfinder of the Wild', symbol: 'Ƶ', startMonth: 9, startDay: 23 },
    { name: 'Tochtli', meaning: 'Rabbit — Fertile Abundance', symbol: '◯', startMonth: 10, startDay: 23 },
    { name: 'Atl', meaning: 'Water — Sacred Purification', symbol: '≈', startMonth: 11, startDay: 22 },
    { name: 'Itzcuintli', meaning: 'Dog — Guide Through Mictlan', symbol: '◆', startMonth: 12, startDay: 22 },
    { name: 'Ozomatli', meaning: 'Monkey — Joyful Creation', symbol: '✦', startMonth: 1, startDay: 20 },
    { name: 'Malinalli', meaning: 'Grass — Enduring Growth', symbol: '⚘', startMonth: 2, startDay: 19 }
  ]
};

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

const TONALPOHUALLI_REFERENCE_DATE = new Date(2024, 3, 12, 0, 0, 0);
const TONALPOHUALLI_REFERENCE_DAY_NUMBER = 4;
const TONALPOHUALLI_REFERENCE_SIGN_INDEX = 16;

const state = {
  wheelRotation: 0,
  targetRotation: 0,
  currentDayIndex: 0,
  currentNumber: 1,
  isDragging: false,
  dragStartAngle: 0,
  dragStartRotation: 0,
  tooltipVisible: false,
  activeTooltipElement: null
};

function calculateTonalpohualli() {
  const now = new Date();
  const diffMs = now.getTime() - TONALPOHUALLI_REFERENCE_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const signIndex = ((TONALPOHUALLI_REFERENCE_SIGN_INDEX + diffDays) % 20 + 20) % 20;
  const number = ((TONALPOHUALLI_REFERENCE_DAY_NUMBER - 1 + diffDays) % 13 + 13) % 13 + 1;

  const trecenaIndex = (number - 1) % 13;
  const nightLordIndex = diffDays % 9;

  const yearDiff = now.getFullYear() - 2024;
  const yearBearerIndex = ((3 + yearDiff) % 4 + 4) % 4;
  const yearNumber = ((3 + yearDiff) % 13 + 13) % 13 + 1;

  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const veintenaIndex = Math.min(Math.floor(dayOfYear / 20), 17);
  const veintenaDay = dayOfYear % 20;

  return {
    signIndex,
    number,
    trecenaIndex,
    nightLordIndex,
    yearNumber,
    yearBearerIndex,
    veintenaIndex,
    veintenaDay
  };
}

function updateCurrentDay(calc) {
  const sign = CALENDAR_DATA.daySigns[calc.signIndex];
  const deityInfo = CALENDAR_DATA.deities[sign.deity] || { title: 'Unknown Deity', portrait: '?' };
  const trecenaDeity = CALENDAR_DATA.trecenaDeities[calc.trecenaIndex];
  const veintena = CALENDAR_DATA.veintenas[calc.veintenaIndex];
  const yearBearer = CALENDAR_DATA.yearBearers[calc.yearBearerIndex];

  state.currentDayIndex = calc.signIndex;
  state.currentNumber = calc.number;

  const dayNumberLarge = document.getElementById('dayNumberLarge');
  const daySignLarge = document.getElementById('daySignLarge');
  const dayDescription = document.getElementById('dayDescription');
  const dayDirection = document.getElementById('dayDirection');
  const dayDeity = document.getElementById('dayDeity');
  const dayTonal = document.getElementById('dayTonal');
  const portentIndicator = document.getElementById('portentIndicator');
  const portentText = document.getElementById('portentText');

  if (dayNumberLarge) dayNumberLarge.textContent = calc.number;
  if (daySignLarge) daySignLarge.textContent = sign.name;

  const descriptions = {
    'Cipactli': 'The day of the Primordial Earth Monster — when the foundations of creation stir beneath the waters, and new beginnings emerge from the ancient depths.',
    'Ehecatl': 'The day of Wind — when the breath of Quetzalcoatl moves unseen through the world, carrying the seeds of change and the whispers of the gods.',
    'Calli': 'The day of the House — when the temple of becoming opens its doors, and transformation finds shelter in the womb of night.',
    'Cuetzpalin': 'The day of the Lizard — when vitality surges like sunlight on stone, and the agile one carries the fire of growth to all creation.',
    'Coatl': 'The day of the Serpent — when the feathered path of wisdom connects earth to sky, and Chalchiuhtlicue\'s waters flow with serpentine grace.',
    'Miquiztli': 'The day of Death — when the skull of transformation reveals the threshold between worlds. Not an ending, but a passage to renewal.',
    'Mazatl': 'The day of the Deer — when the fleet-footed messenger of Tlaloc runs through the forest, guiding the hunter and the hunted alike.',
    'Tochtli': 'The day of the Rabbit — when fertility and abundance overflow like pulque from the maguey, and the rabbit in the moon grins upon the earth.',
    'Atl': 'The day of Water — when the blood of the earth rises, a day of dangerous purification and the sacred medium of all transformation.',
    'Itzcuintli': 'The day of the Dog — when the faithful guide of Mictlantecuhtli leads the dead through the underworld\'s nine rivers, companion of all souls.',
    'Ozomatli': 'The day of the Monkey — when the playful spirit of Xōchipilli dances through creation, and art flows like water from the hands of the maker.',
    'Malinalli': 'The day of Grass — when endurance takes root in the cracked earth, and the healing herbs reveal their power to those who listen.',
    'Acatl': 'The day of the Reed — when authority stands tall as the hollow stem of knowledge, and Tezcatlipoca\'s standard rises over the battlefield.',
    'Ocelotl': 'The day of the Jaguar — when the spotted lord of the night emerges from the sacred caves, a fearsome omen and a warrior\'s sign.',
    'Cuauhtli': 'The day of the Eagle — when the sun\'s own warrior soars highest, witnessing the world from above and carrying prayers to Huitzilopochtli.',
    'Cozcacuauhtli': 'The day of the Vulture — when the great purifier transforms decay into renewal, and Itzpapalotl\'s obsidian wings flash in the sun.',
    'Ollin': 'The day of Movement — when the earth trembles and the Fifth Sun reveals its power to transform and renew all things. The center holds.',
    'Tecpatl': 'The day of the Flint Knife — when the sacrificial blade of truth cuts through illusion, and Tezcatlipoca\'s mirror reflects the unvarnished real.',
    'Quiahuitl': 'The day of Rain — when the celestial fire falls from Tlaloc\'s hand, both nourishment and wrath, the lightning of divine judgment.',
    'Xochitl': 'The day of the Flower — when beauty blooms in its brief brilliant hour, and Xōchipilli\'s paradise opens to those who create and dream.'
  };

  if (dayDescription) dayDescription.textContent = descriptions[sign.name] || 'The day unfolds according to the will of the gods.';
  if (dayDirection) dayDirection.textContent = sign.direction;
  if (dayDeity) dayDeity.textContent = sign.deity;
  if (dayTonal) dayTonal.textContent = sign.tonal;

  if (portentIndicator) {
    portentIndicator.className = 'portent-indicator ' + sign.portent;
  }
  if (portentText) {
    portentText.textContent = sign.portent.charAt(0).toUpperCase() + sign.portent.slice(1);
    portentText.className = 'portent-text ' + sign.portent;
  }

  const currentTrecena = document.getElementById('currentTrecena');
  const currentTrecenaDeity = document.getElementById('currentTrecenaDeity');
  if (currentTrecena) currentTrecena.textContent = ROMAN_NUMERALS[calc.number - 1] + ' — ' + numberToWord(calc.number);
  if (currentTrecenaDeity) currentTrecenaDeity.textContent = 'Governed by ' + trecenaDeity;

  const currentVeintena = document.getElementById('currentVeintena');
  const currentVeintenaMeaning = document.getElementById('currentVeintenaMeaning');
  if (currentVeintena) currentVeintena.textContent = veintena.name;
  if (currentVeintenaMeaning) currentVeintenaMeaning.textContent = veintena.meaning;

  const currentYear = document.getElementById('currentYear');
  const yearBearerEl = document.getElementById('yearBearer');
  if (currentYear) currentYear.textContent = calc.yearNumber + '-' + yearBearer;
  if (yearBearerEl) yearBearerEl.textContent = 'Year Bearer: ' + yearBearer;

  const rulingDeityName = document.getElementById('rulingDeityName');
  const rulingDeityTitle = document.getElementById('rulingDeityTitle');
  const rulingDeityPortrait = document.getElementById('rulingDeityPortrait');
  const deityAscendancy = document.getElementById('deityAscendancy');
  const deityAscendancyValue = document.getElementById('deityAscendancyValue');

  const rulingDeity = CALENDAR_DATA.deities[sign.deity] || { title: '', portrait: '?' };
  if (rulingDeityName) rulingDeityName.textContent = sign.deity;
  if (rulingDeityTitle) rulingDeityTitle.textContent = rulingDeity.title;
  if (rulingDeityPortrait) {
    const sunFace = rulingDeityPortrait.querySelector('.deity-sun-face');
    if (sunFace) sunFace.textContent = rulingDeity.portrait;
  }

  const ascendancy = 30 + Math.floor(Math.sin(Date.now() / 50000) * 30 + 40);
  if (deityAscendancy) deityAscendancy.style.width = ascendancy + '%';
  if (deityAscendancyValue) deityAscendancyValue.textContent = ascendancy + '%';

  updateNightLords(calc.nightLordIndex);
}

function numberToWord(n) {
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen'];
  return words[n] || n.toString();
}

function updateNightLords(activeIndex) {
  const lords = document.querySelectorAll('.night-lord');
  lords.forEach((lord, index) => {
    lord.classList.toggle('active', index === activeIndex);
  });
}

function positionWheelElements() {
  const daySigns = document.querySelectorAll('#dayRing .day-sign');
  const dayRingSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--day-ring-size'));
  const dayRadius = dayRingSize / 2 - 30;

  daySigns.forEach((sign, index) => {
    const angle = (index / 20) * 360 - 90;
    const radian = angle * (Math.PI / 180);
    const x = Math.cos(radian) * dayRadius;
    const y = Math.sin(radian) * dayRadius;
    sign.style.transform = `translate(${x}px, ${y}px)`;
    sign.style.position = 'absolute';
    sign.style.top = '50%';
    sign.style.left = '50%';
    sign.style.marginLeft = '-' + (sign.offsetWidth / 2) + 'px';
    sign.style.marginTop = '-' + (sign.offsetHeight / 2) + 'px';
  });

  const numbers = document.querySelectorAll('#numberRing .wheel-number');
  const numberRingSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--number-ring-size'));
  const numberRadius = numberRingSize / 2 - 22;

  numbers.forEach((num, index) => {
    const angle = (index / 13) * 360 - 90;
    const radian = angle * (Math.PI / 180);
    const x = Math.cos(radian) * numberRadius;
    const y = Math.sin(radian) * numberRadius;
    num.style.transform = `translate(${x}px, ${y}px)`;
    num.style.position = 'absolute';
    num.style.top = '50%';
    num.style.left = '50%';
    num.style.marginLeft = '-' + (num.offsetWidth / 2) + 'px';
    num.style.marginTop = '-' + (num.offsetHeight / 2) + 'px';
  });

  const cardinalMarkers = document.querySelectorAll('.cardinal-marker');
  const cardinalRingSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cardinal-ring-size'));
  const cardinalRadius = cardinalRingSize / 2 - 10;

  const cardinalAngles = { 'cardinal-east': 0, 'cardinal-north': 270, 'cardinal-west': 180, 'cardinal-south': 90 };
  cardinalMarkers.forEach((marker) => {
    marker.style.position = 'absolute';
    marker.style.top = '50%';
    marker.style.left = '50%';
    for (const [cls, angleDeg] of Object.entries(cardinalAngles)) {
      if (marker.classList.contains(cls)) {
        const radian = (angleDeg - 90) * (Math.PI / 180);
        const x = Math.cos(radian) * cardinalRadius;
        const y = Math.sin(radian) * cardinalRadius;
        marker.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      }
    }
  });
}

function highlightCurrentDay(signIndex) {
  const daySigns = document.querySelectorAll('#dayRing .day-sign');
  daySigns.forEach((sign, index) => {
    sign.classList.toggle('active', index === signIndex);
  });
}

function rotateWheel(direction) {
  const increment = direction === 'left' ? -18 : 18;
  state.targetRotation += increment;
  const wheel = document.getElementById('calendarWheel');
  if (wheel) {
    wheel.classList.add('spinning');
    wheel.style.transform = `rotate(${state.targetRotation}deg)`;
    setTimeout(() => wheel.classList.remove('spinning'), 800);
  }
}

function initWheelDrag() {
  const wheel = document.getElementById('calendarWheel');
  if (!wheel) return;

  const container = wheel.closest('.wheel-container');
  if (!container) return;

  function getAngle(e, rect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }

  function onDragStart(e) {
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    state.isDragging = true;
    state.dragStartAngle = getAngle(e, rect);
    state.dragStartRotation = state.targetRotation;
    wheel.style.transition = 'none';
  }

  function onDragMove(e) {
    if (!state.isDragging) return;
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const currentAngle = getAngle(e, rect);
    const delta = currentAngle - state.dragStartAngle;
    state.targetRotation = state.dragStartRotation + delta;
    wheel.style.transform = `rotate(${state.targetRotation}deg)`;
  }

  function onDragEnd() {
    if (!state.isDragging) return;
    state.isDragging = false;
    wheel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
    const snapAngle = Math.round(state.targetRotation / 18) * 18;
    state.targetRotation = snapAngle;
    wheel.style.transform = `rotate(${state.targetRotation}deg)`;
  }

  wheel.addEventListener('mousedown', onDragStart);
  wheel.addEventListener('touchstart', onDragStart, { passive: false });
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('touchmove', onDragMove, { passive: false });
  document.addEventListener('mouseup', onDragEnd);
  document.addEventListener('touchend', onDragEnd);

  wheel.addEventListener('click', (e) => {
    const daySign = e.target.closest('.day-sign');
    if (daySign) {
      const allSigns = document.querySelectorAll('#dayRing .day-sign');
      const index = Array.from(allSigns).indexOf(daySign);
      if (index !== -1) {
        selectDaySign(index);
      }
    }
  });
}

function selectDaySign(index) {
  const calc = calculateTonalpohualli();
  calc.signIndex = index;
  calc.number = ((calc.number + index - state.currentDayIndex + 13 - 1) % 13) + 1;
  updateCurrentDay(calc);
  highlightCurrentDay(index);
}

function initGlyphTooltips() {
  const tooltip = document.getElementById('glyphTooltip');
  if (!tooltip) return;

  const tooltipGlyph = tooltip.querySelector('.tooltip-glyph');
  const tooltipName = tooltip.querySelector('.tooltip-name');
  const tooltipBody = tooltip.querySelector('.tooltip-body');

  let hideTimeout = null;

  function showTooltip(element) {
    const glyphText = element.getAttribute('data-glyph');
    if (!glyphText) return;

    const parts = glyphText.split(' — ');
    const name = parts[0] || '';
    const body = parts.slice(1).join(' — ') || '';

    if (tooltipName) tooltipName.textContent = name;
    if (tooltipBody) tooltipBody.textContent = body;

    const firstSymbol = element.querySelector('.sign-symbol, .aspect-symbol, .event-icon, .tribute-icon, .zodiac-symbol, .lord-number, .cardinal-glyph, .section-icon, .panel-icon');
    if (tooltipGlyph && firstSymbol) {
      tooltipGlyph.textContent = firstSymbol.textContent;
    } else if (tooltipGlyph) {
      tooltipGlyph.textContent = element.textContent.charAt(0) || '◆';
    }

    tooltip.classList.add('visible');
    state.tooltipVisible = true;
    state.activeTooltipElement = element;

    positionTooltip(element);
  }

  function positionTooltip(element) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + 12;
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;

    if (top + tooltipRect.height > viewportHeight - 20) {
      top = rect.top - tooltipRect.height - 12;
    }

    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }

    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }

  function hideTooltip() {
    hideTimeout = setTimeout(() => {
      tooltip.classList.remove('visible');
      state.tooltipVisible = false;
      state.activeTooltipElement = null;
    }, 150);
  }

  function cancelHide() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }

  document.addEventListener('mouseover', (e) => {
    const glyphElement = e.target.closest('[data-glyph]');
    if (glyphElement) {
      cancelHide();
      showTooltip(glyphElement);
    } else if (state.tooltipVisible && !tooltip.contains(e.target)) {
      hideTooltip();
    }
  });

  document.addEventListener('mouseout', (e) => {
    const glyphElement = e.target.closest('[data-glyph]');
    if (glyphElement && state.tooltipVisible) {
      const relatedGlyph = e.relatedTarget ? e.relatedTarget.closest('[data-glyph]') : null;
      if (!relatedGlyph || relatedGlyph !== state.activeTooltipElement) {
        hideTooltip();
      }
    }
  });

  tooltip.addEventListener('mouseenter', cancelHide);
  tooltip.addEventListener('mouseleave', hideTooltip);
}

function updateEclipseCountdown() {
  const eclipseDate = new Date('2025-10-02T17:45:00Z');
  const now = new Date();
  const diff = eclipseDate.getTime() - now.getTime();

  if (diff <= 0) {
    document.getElementById('eclipseDays').textContent = '0';
    document.getElementById('eclipseHours').textContent = '0';
    document.getElementById('eclipseMins').textContent = '0';
    document.getElementById('eclipseSecs').textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('eclipseDays').textContent = String(days);
  document.getElementById('eclipseHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('eclipseMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('eclipseSecs').textContent = String(secs).padStart(2, '0');
}

function updateVenusCycle() {
  const venusSynodicPeriod = 584;
  const venusReferenceDate = new Date(2024, 5, 4, 0, 0, 0);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - venusReferenceDate.getTime()) / (1000 * 60 * 60 * 24));
  const venusDay = ((diffDays % venusSynodicPeriod) + venusSynodicPeriod) % venusSynodicPeriod;

  let phase, station;
  let progressPercent;

  if (venusDay < 236) {
    phase = 'Morning Star';
    station = 'morning';
    progressPercent = (venusDay / venusSynodicPeriod) * 100;
  } else if (venusDay < 326) {
    phase = 'Superior Conjunction';
    station = 'superior';
    progressPercent = (venusDay / venusSynodicPeriod) * 100;
  } else if (venusDay < 576) {
    phase = 'Evening Star';
    station = 'evening';
    progressPercent = (venusDay / venusSynodicPeriod) * 100;
  } else {
    phase = 'Inferior Conjunction';
    station = 'inferior';
    progressPercent = (venusDay / venusSynodicPeriod) * 100;
  }

  const venusPhaseEl = document.getElementById('venusPhase');
  const venusDaysEl = document.getElementById('venusDays');
  const venusProgressBar = document.getElementById('venusProgressBar');
  const venusOrb = document.getElementById('venusOrb');

  if (venusPhaseEl) venusPhaseEl.textContent = phase;
  if (venusDaysEl) venusDaysEl.textContent = 'Day ' + (venusDay + 1) + ' of ' + venusSynodicPeriod;
  if (venusProgressBar) venusProgressBar.style.width = progressPercent + '%';

  if (venusOrb) {
    if (station === 'morning') {
      venusOrb.style.background = 'radial-gradient(circle at 35% 35%, var(--gold-light), var(--gold-deep), var(--obsidian-mid))';
      venusOrb.style.boxShadow = '0 0 12px rgba(230, 180, 34, 0.3)';
    } else if (station === 'evening') {
      venusOrb.style.background = 'radial-gradient(circle at 65% 35%, var(--jade-pale), var(--jade-deep), var(--obsidian-mid))';
      venusOrb.style.boxShadow = '0 0 12px rgba(0, 155, 120, 0.2)';
    } else {
      venusOrb.style.background = 'radial-gradient(circle at 50% 50%, var(--obsidian-glow), var(--obsidian-dark))';
      venusOrb.style.boxShadow = '0 0 6px rgba(42, 42, 78, 0.3)';
    }
  }

  const stations = document.querySelectorAll('.venus-station');
  stations.forEach((el) => {
    el.classList.toggle('active', el.getAttribute('data-station') === station);
  });
}

function updateMoonPhase() {
  const moonOrb = document.getElementById('moonOrb');
  const moonPhaseName = document.getElementById('moonPhaseName');
  const moonIllumination = document.getElementById('moonIllumination');

  const synodicMonth = 29.53059;
  const knownNewMoon = new Date(2024, 0, 11, 11, 57, 0);
  const now = new Date();
  const diffDays = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const moonAge = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

  const illumination = (1 - Math.cos((moonAge / synodicMonth) * 2 * Math.PI)) / 2;
  const illuminationPercent = Math.round(illumination * 100);

  let phaseName;
  if (moonAge < 1.85) phaseName = 'New Moon';
  else if (moonAge < 7.38) phaseName = 'Waxing Crescent';
  else if (moonAge < 9.23) phaseName = 'First Quarter';
  else if (moonAge < 14.77) phaseName = 'Waxing Gibbous';
  else if (moonAge < 16.61) phaseName = 'Full Moon';
  else if (moonAge < 22.15) phaseName = 'Waning Gibbous';
  else if (moonAge < 23.99) phaseName = 'Last Quarter';
  else if (moonAge < 29.53) phaseName = 'Waning Crescent';
  else phaseName = 'New Moon';

  if (moonPhaseName) moonPhaseName.textContent = phaseName;
  if (moonIllumination) moonIllumination.textContent = illuminationPercent + '% Illuminated';

  if (moonOrb) {
    const shadowPosition = 100 - (illumination * 100);
    if (moonAge < synodicMonth / 2) {
      moonOrb.style.background = `radial-gradient(circle at ${50 + (1 - illumination) * 40}% 40%, var(--bone-pale), var(--bone-dark) ${shadowPosition}%, var(--obsidian-mid) ${shadowPosition + 15}%)`;
    } else {
      moonOrb.style.background = `radial-gradient(circle at ${50 - (1 - illumination) * 40}% 40%, var(--bone-pale), var(--bone-dark) ${shadowPosition}%, var(--obsidian-mid) ${shadowPosition + 15}%)`;
    }
  }
}

function updateSolarZodiac() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  let currentSign = CALENDAR_DATA.zodiacSigns[0];
  for (let i = CALENDAR_DATA.zodiacSigns.length - 1; i >= 0; i--) {
    const sign = CALENDAR_DATA.zodiacSigns[i];
    if (currentMonth > sign.startMonth || (currentMonth === sign.startMonth && currentDay >= sign.startDay)) {
      currentSign = sign;
      break;
    }
  }

  const zodiacSymbol = document.getElementById('zodiacSymbol');
  const zodiacName = document.getElementById('zodiacName');
  const zodiacMeaning = document.getElementById('zodiacMeaning');

  if (zodiacSymbol) zodiacSymbol.textContent = currentSign.symbol;
  if (zodiacName) zodiacName.textContent = currentSign.name;
  if (zodiacMeaning) zodiacMeaning.textContent = currentSign.meaning;
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.classList.remove('hidden-scroll');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const animatedElements = document.querySelectorAll('.ritual-event, .tribute-item, .codex-entry, .astro-event');
  animatedElements.forEach((el, index) => {
    el.classList.add('hidden-scroll');
    el.style.transitionDelay = (index % 6) * 80 + 'ms';
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    .hidden-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

function initSerpentHead() {
  const serpentHead = document.getElementById('serpentHead');
  if (!serpentHead) return;

  let lastScrollY = 0;
  let scrollVelocity = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollVelocity = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    const offset = Math.min(Math.max(currentScrollY * 0.05, -20), 20);
    serpentHead.style.transform = `translateX(calc(-50% + ${offset}px))`;

    const scale = 1 + Math.min(Math.abs(scrollVelocity) * 0.001, 0.15);
    serpentHead.style.transform += ` scale(${scale})`;
  });
}

function initWheelButtons() {
  const leftBtn = document.getElementById('wheelLeft');
  const rightBtn = document.getElementById('wheelRight');

  if (leftBtn) {
    leftBtn.addEventListener('click', () => rotateWheel('left'));
    let leftInterval;
    leftBtn.addEventListener('mousedown', () => {
      leftInterval = setInterval(() => rotateWheel('left'), 150);
    });
    leftBtn.addEventListener('mouseup', () => clearInterval(leftInterval));
    leftBtn.addEventListener('mouseleave', () => clearInterval(leftInterval));
  }

  if (rightBtn) {
    rightBtn.addEventListener('click', () => rotateWheel('right'));
    let rightInterval;
    rightBtn.addEventListener('mousedown', () => {
      rightInterval = setInterval(() => rotateWheel('right'), 150);
    });
    rightBtn.addEventListener('mouseup', () => clearInterval(rightInterval));
    rightBtn.addEventListener('mouseleave', () => clearInterval(rightInterval));
  }
}

function initDaySignClicks() {
  const daySigns = document.querySelectorAll('#dayRing .day-sign');
  daySigns.forEach((sign, index) => {
    sign.addEventListener('click', (e) => {
      e.stopPropagation();
      selectDaySign(index);
    });
  });
}

function initParallaxEffect() {
  const wheelContainer = document.querySelector('.wheel-container');
  if (!wheelContainer) return;

  window.addEventListener('mousemove', (e) => {
    const rect = wheelContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / window.innerWidth;
    const deltaY = (e.clientY - centerY) / window.innerHeight;

    const wheel = document.getElementById('calendarWheel');
    if (wheel && !state.isDragging) {
      const baseRotation = state.targetRotation;
      const parallaxTilt = deltaX * 2;
      wheel.style.boxShadow = `
        0 0 0 3px var(--gold-deep),
        0 0 0 6px var(--obsidian-dark),
        0 0 0 8px rgba(201, 149, 42, 0.2),
        ${deltaX * -8}px ${deltaY * -8}px 40px rgba(0, 0, 0, 0.8),
        inset 0 0 60px rgba(0, 0, 0, 0.5)
      `;
    }
  });
}

function initAmbientPulse() {
  const wheelCenter = document.querySelector('.wheel-center');
  if (!wheelCenter) return;

  function pulseCenter() {
    const now = Date.now();
    const intensity = 0.08 + Math.sin(now / 3000) * 0.04;
    wheelCenter.style.boxShadow = `
      0 0 20px rgba(0, 0, 0, 0.6),
      inset 0 0 20px rgba(0, 0, 0, 0.4),
      0 0 ${30 + Math.sin(now / 2000) * 10}px rgba(201, 149, 42, ${intensity})
    `;
    requestAnimationFrame(pulseCenter);
  }

  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    pulseCenter();
  }
}

function initSerpentFlow() {
  const segments = document.querySelectorAll('.serpent-segment');
  segments.forEach((segment, index) => {
    segment.style.animationDuration = (8 + index * 0.5) + 's';
  });
}

function initTributeCountdowns() {
  const tributeItems = document.querySelectorAll('.tribute-item');
  tributeItems.forEach((item) => {
    const statusText = item.querySelector('.status-text');
    if (statusText && statusText.textContent.includes('Due in')) {
      const match = statusText.textContent.match(/(\d+)/);
      if (match) {
        let daysLeft = parseInt(match[1]);
        setInterval(() => {
          if (daysLeft > 0) {
            daysLeft--;
            if (daysLeft === 0) {
              statusText.textContent = 'Due today';
              const statusDiv = item.querySelector('.tribute-status');
              if (statusDiv) {
                statusDiv.classList.remove('due-soon', 'due-later');
                statusDiv.classList.add('overdue');
              }
            } else {
              statusText.textContent = 'Due in ' + daysLeft + ' days';
            }
          }
        }, 60000);
      }
    }
  });
}

function initRitualCountdowns() {
  const ritualEvents = document.querySelectorAll('.ritual-event');
  ritualEvents.forEach((event) => {
    const dayCount = event.querySelector('.ritual-day-count');
    if (dayCount) {
      const match = dayCount.textContent.match(/(\d+)/);
      if (match) {
        let days = parseInt(match[1]);
        setInterval(() => {
          if (days > 0) {
            days--;
            dayCount.textContent = days + ' days';
          }
        }, 60000);
      }
    }
  });
}

function initAspectAnimations() {
  const aspects = document.querySelectorAll('.aspect-item');
  aspects.forEach((aspect) => {
    const status = aspect.querySelector('.aspect-status');
    if (status) {
      const originalClass = status.className;
      setInterval(() => {
        status.style.opacity = '0.7';
        setTimeout(() => {
          status.style.opacity = '1';
        }, 300);
      }, 5000 + Math.random() * 3000);
    }
  });
}

function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      rotateWheel('left');
    } else if (e.key === 'ArrowRight') {
      rotateWheel('right');
    }
  });
}

function initResponsiveResize() {
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      positionWheelElements();
    }, 200);
  });
}

function init() {
  const calc = calculateTonalpohualli();
  updateCurrentDay(calc);

  requestAnimationFrame(() => {
    positionWheelElements();
    highlightCurrentDay(calc.signIndex);
  });

  setTimeout(() => {
    positionWheelElements();
  }, 100);

  initWheelDrag();
  initWheelButtons();
  initGlyphTooltips();
  initScrollAnimations();
  initSerpentHead();
  initSerpentFlow();
  initDaySignClicks();
  initParallaxEffect();
  initAmbientPulse();
  initTributeCountdowns();
  initRitualCountdowns();
  initAspectAnimations();
  initKeyboardNavigation();
  initResponsiveResize();

  updateEclipseCountdown();
  updateVenusCycle();
  updateMoonPhase();
  updateSolarZodiac();

  setInterval(updateEclipseCountdown, 1000);
  setInterval(updateVenusCycle, 60000);
  setInterval(updateMoonPhase, 60000);

  setInterval(() => {
    const calc = calculateTonalpohualli();
    updateNightLords(calc.nightLordIndex);
    const ascendancy = 30 + Math.floor(Math.sin(Date.now() / 50000) * 30 + 40);
    const deityAscendancy = document.getElementById('deityAscendancy');
    const deityAscendancyValue = document.getElementById('deityAscendancyValue');
    if (deityAscendancy) deityAscendancy.style.width = ascendancy + '%';
    if (deityAscendancyValue) deityAscendancyValue.textContent = ascendancy + '%';
  }, 10000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}