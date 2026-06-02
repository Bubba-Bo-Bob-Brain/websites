// Tonalpohualli - Sacred Calendar Scripts
// Carved from Obsidian and Jade

document.addEventListener('DOMContentLoaded', () => {
  // Calendar Data - The 20 Sacred Day Signs
  const daySigns = [
    {
      name: 'Cipactli',
      meaning: 'Crocodile',
      symbol: '🐊',
      direction: 'East',
      element: 'Earth',
      lord: 'Tonacatecuhtli',
      description: 'Day of beginnings and creation. The crocodile floating in the primeval ocean. Favorable for starting new ventures, seeking sustenance, and matters of the earth.',
      pronunciation: 'see-PAHK-tlee'
    },
    {
      name: 'Ehecatl',
      meaning: 'Wind',
      symbol: '💨',
      direction: 'North',
      element: 'Air',
      lord: 'Quetzalcoatl',
      description: 'Day of the divine breath and cosmic wind. Favorable for learning, knowledge, and calling upon the spirits. The breath of life moves through all things.',
      pronunciation: 'eh-eh-KAHTL'
    },
    {
      name: 'Calli',
      meaning: 'House',
      symbol: '🏠',
      direction: 'South',
      element: 'Earth',
      lord: 'Tepeyollotl',
      description: 'Day of the hearth and home. Favorable for rest, family matters, and domestic affairs. A day of comfort but also of confinement.',
      pronunciation: 'KAH-yee'
    },
    {
      name: 'Cuetzpalin',
      meaning: 'Lizard',
      symbol: '🦎',
      direction: 'East',
      element: 'Fire',
      lord: 'Huehuecoyotl',
      description: 'Day of swiftness and transformation. The lizard basks in the sun, always alert. Favorable for quick decisions and adaptability.',
      pronunciation: 'kwehts-pah-LEEN'
    },
    {
      name: 'Coatl',
      meaning: 'Serpent',
      symbol: '🐍',
      direction: 'West',
      element: 'Water',
      lord: 'Chalchiuhtlicue',
      description: 'Day of wisdom and hidden knowledge. The serpent sheds its skin as we shed our past. Favorable for healing and transformation.',
      pronunciation: 'KOH-ahtl'
    },
    {
      name: 'Miquiztli',
      meaning: 'Death',
      symbol: '💀',
      direction: 'North',
      element: 'Earth',
      lord: 'Mictlantecuhtli',
      description: 'Day of endings and transition. Not feared but respected as the gateway to transformation. Favorable for banishing and closure.',
      pronunciation: 'mee-KEEST-lee'
    },
    {
      name: 'Mazatl',
      meaning: 'Deer',
      symbol: '🦌',
      direction: 'South',
      element: 'Earth',
      lord: 'Tlaloc',
      description: 'Day of the forest and swiftness. The deer represents the hunted and the hunter. Favorable for tracking, hunting, and following paths.',
      pronunciation: 'mah-SAHTL'
    },
    {
      name: 'Tochtli',
      meaning: 'Rabbit',
      symbol: '🐰',
      direction: 'West',
      element: 'Water',
      lord: 'Mayahuel',
      description: 'Day of fertility and abundance. The rabbit multiplies and brings forth life. Favorable for arts, music, and celebration.',
      pronunciation: 'TOHCH-tlee'
    },
    {
      name: 'Atl',
      meaning: 'Water',
      symbol: '💧',
      direction: 'East',
      element: 'Water',
      lord: 'Chalchiuhtlicue',
      description: 'Day of the cosmic waters and purification. The life-giving rain and rivers. Favorable for cleansing, healing, and emotional matters.',
      pronunciation: 'AHTL'
    },
    {
      name: 'Itzcuintli',
      meaning: 'Dog',
      symbol: '🐕',
      direction: 'North',
      element: 'Earth',
      lord: 'Mictlantecuhtli',
      description: 'Day of loyalty and guidance. The dog guides souls through the underworld. Favorable for loyalty, companionship, and safe passage.',
      pronunciation: 'eets-KWEENT-lee'
    },
    {
      name: 'Ozomahtli',
      meaning: 'Monkey',
      symbol: '🐵',
      direction: 'West',
      element: 'Earth',
      lord: 'Xochipilli',
      description: 'Day of play and creativity. The monkey dances between worlds. Favorable for arts, games, and joyful celebration.',
      pronunciation: 'oh-soh-MAHT-lee'
    },
    {
      name: 'Malinalli',
      meaning: 'Grass',
      symbol: '🌿',
      direction: 'South',
      element: 'Earth',
      lord: 'Patecatl',
      description: 'Day of healing herbs and resilience. The grass that bends but does not break. Favorable for medicine, weaving, and endurance.',
      pronunciation: 'mah-lee-NAH-yee'
    },
    {
      name: 'Acatl',
      meaning: 'Reed',
      symbol: '🎋',
      direction: 'East',
      element: 'Air',
      lord: 'Tezcatlipoca',
      description: 'Day of knowledge and authority. The reed pen writes history. Favorable for learning, teaching, and judgment.',
      pronunciation: 'AH-kahtl'
    },
    {
      name: 'Ocelotl',
      meaning: 'Jaguar',
      symbol: '🐆',
      direction: 'North',
      element: 'Earth',
      lord: 'Tezcatlipoca',
      description: 'Day of the warrior and night sun. The jaguar prowls in darkness. Favorable for war, strength, and confronting enemies.',
      pronunciation: 'oh-seh-LOHTL'
    },
    {
      name: 'Cuauhtli',
      meaning: 'Eagle',
      symbol: '🦅',
      direction: 'West',
      element: 'Air',
      lord: 'Xipe Totec',
      description: 'Day of vision and sacrifice. The eagle flies highest and sees all. Favorable for leadership, vision, and noble deeds.',
      pronunciation: 'KWAH-tlee'
    },
    {
      name: 'Cozcacuauhtli',
      meaning: 'Vulture',
      symbol: '🌪️',
      direction: 'South',
      element: 'Air',
      lord: 'Itzapapalotl',
      description: 'Day of purification and karma. The vulture cleanses the earth. Favorable for justice, truth, and clearing away the old.',
      pronunciation: 'kohs-kah-KWAH-tlee'
    },
    {
      name: 'Ollin',
      meaning: 'Earthquake',
      symbol: '🌋',
      direction: 'North',
      element: 'Earth',
      lord: 'Xolotl',
      description: 'Day of movement and change. The fifth sun is the sun of earthquakes. Favorable for action, travel, and avoiding indecision.',
      pronunciation: 'OH-leen'
    },
    {
      name: 'Tecpatl',
      meaning: 'Flint',
      symbol: '🗿',
      direction: 'East',
      element: 'Fire',
      lord: 'Chalchiuhtotolin',
      description: 'Day of trial and tribulation. The flint knife cuts and divides. Favorable for trials, tests, and separating truth from falsehood.',
      pronunciation: 'tek-PAHTL'
    },
    {
      name: 'Quiahuitl',
      meaning: 'Rain',
      symbol: '🌧️',
      direction: 'West',
      element: 'Water',
      lord: 'Tlaloc',
      description: 'Day of abundance and divine favor. The rain nourishes the crops. Favorable for growth, wealth, and receiving blessings.',
      pronunciation: 'kee-AH-weetl'
    },
    {
      name: 'Xochitl',
      meaning: 'Flower',
      symbol: '🌸',
      direction: 'South',
      element: 'Earth',
      lord: 'Xochiquetzal',
      description: 'Day of beauty and completion. The flower represents the fullness of life. Favorable for love, art, and completion of cycles.',
      pronunciation: 'SHOH-cheetl'
    }
  ];

  // Glyph translations for tooltip system
  const glyphDictionary = {
    'TONALPOHUALI': { translation: 'The Count of Days', pronunciation: 'toh-nahl-poh-WAH-lee', meaning: 'The sacred 260-day ritual calendar' },
    'NEMONTEMI': { translation: 'Empty Days', pronunciation: 'neh-mohn-TEH-mee', meaning: 'The five unlucky days at year\'s end' },
    'OLLIN': { translation: 'Movement', pronunciation: 'OH-leen', meaning: 'Earthquake, motion, the Fifth Sun' },
    'TEOTL': { translation: 'God', pronunciation: 'teh-OHTL', meaning: 'Divine sacred essence' },
    'QUETZALCOATL': { translation: 'Feathered Serpent', pronunciation: 'ket-sahl-koh-AH-tl', meaning: 'Lord of wind, dawn, knowledge, and merchants' },
    'TLAMACEHUALIZTLI': { translation: 'Penance', pronunciation: 'tlah-mah-seh-wah-LEEST-lee', meaning: 'Ritual offerings and sacrifices' },
    'CIPACTLI': { translation: 'Crocodile', pronunciation: 'see-PAHK-tlee', meaning: 'First day sign, monster of the earth' },
    'EHCATL': { translation: 'Wind', pronunciation: 'eh-KAHTL', meaning: 'Second day sign, breath of life' },
    'CUAUHTLI': { translation: 'Eagle', pronunciation: 'KWAH-tlee', meaning: 'Fifteenth day sign, sun\'s warrior' },
    'MICTLANTECUHTLI': { translation: 'Lord of Mictlan', pronunciation: 'meekt-lahn-teh-KWOO-tlee', meaning: 'Ruler of the underworld' },
    'XILONEN': { translation: 'Young Maize', pronunciation: 'shee-LOH-nen', meaning: 'Goddess of tender corn' },
    'COATL': { translation: 'Serpent', pronunciation: 'KOH-ahtl', meaning: 'Fifth day sign, wisdom and transformation' },
    'METZTLI': { translation: 'Moon', pronunciation: 'MEHTS-tlee', meaning: 'Night silver, the mirror of the sun' },
    'TONATIUH': { translation: 'Sun', pronunciation: 'toh-nah-TEE-oo', meaning: 'The Fifth Sun, Ollin Tonatiuh' },
    'ILHUI': { translation: 'Day', pronunciation: 'EEL-wee', meaning: 'The sacred day count' },
    'COATEQUITL': { translation: 'Serpent Work', pronunciation: 'koh-ah-teh-KEETL', meaning: 'Tribute and labor payments' },
    'TLALOC': { translation: 'He Who Makes Things Sprout', pronunciation: 'TLAH-lohk', meaning: 'Rain god and lord of mountains' },
    'MICTLAN': { translation: 'Place of the Dead', pronunciation: 'MEECT-lahn', meaning: 'The underworld, nine levels deep' },
    'TLALOCAN': { translation: 'Tlaloc\'s Paradise', pronunciation: 'tlah-loh-KAHN', meaning: 'Eastern paradise of eternal spring' },
    'Tamoanchan': { translation: 'We Seek Our Home', pronunciation: 'tah-moh-AHN-chan', meaning: 'Mythical place of origin' },
    'Chichihuapan': { translation: 'Nine Streams', pronunciation: 'chee-chee-WAH-pahn', meaning: 'Western paradise of the afterlife' },
    'IZQUIERDA': { translation: 'Left', pronunciation: 'is-kee-EHR-dah', meaning: 'The direction of the heart' },
    'DERECHA': { translation: 'Right', pronunciation: 'deh-REH-chah', meaning: 'The strong hand' },
    'AXKA': { translation: 'Today', pronunciation: 'AHSH-kah', meaning: 'This very day' },
    'CALLI': { translation: 'House', pronunciation: 'KAH-yee', meaning: 'Third day sign, the hearth' },
    'MAZATL': { translation: 'Deer', pronunciation: 'mah-SAHTL', meaning: 'Seventh day sign, the hunted' },
    'TOCHTL': { translation: 'Rabbit', pronunciation: 'TOHCH-tlee', meaning: 'Eighth day sign, fertility' },
    'ATL': { translation: 'Water', pronunciation: 'AHTL', meaning: 'Ninth day sign, cosmic ocean' },
    'ECLIPSE': { translation: 'Eating', pronunciation: 'tleh-koh', meaning: 'When the sun is devoured' },
    'TZAPOA': { translation: 'Close', pronunciation: 'tzah-POH-ah', meaning: 'To close or finish' },
    'QUAUHTLI': { translation: 'Eagle', pronunciation: 'KWAH-tlee', meaning: 'Solar bird of war' },
    'TIANquizl': { translation: 'Market', pronunciation: 'tee-ahn-KEEST-lee', meaning: 'The gathering place' },
    'Tlahuizcalpantecuhtli': { translation: 'Morning Star Lord', pronunciation: 'tlah-wees-kahl-pahn-teh-KOO-tlee', meaning: 'Venus as herald of dawn' }
  };

  // State
  let currentDayIndex = 13; // Start at Jaguar (Ocelotl)
  let currentNumber = 4; // Start at 4
  let isAnimating = false;

  // DOM Elements
  const dayRing = document.getElementById('day-signs-ring');
  const numberRing = document.getElementById('numbers-ring');
  const yearRing = document.getElementById('year-ring');
  const currentDateDisplay = document.getElementById('current-date-display');
  const rotateLeftBtn = document.getElementById('rotate-left');
  const rotateRightBtn = document.getElementById('rotate-right');
  const todayBtn = document.getElementById('today-btn');
  const tooltip = document.getElementById('glyph-tooltip');
  const modal = document.getElementById('ritual-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');

  // Initialize Calendar Wheels
  function initializeWheels() {
    // Create day sign glyphs on outer ring
    daySigns.forEach((sign, index) => {
      const angle = (index * 18) - 90; // 360/20 = 18 degrees, start at top
      const radian = (angle * Math.PI) / 180;
      const x = 250 + 210 * Math.cos(radian);
      const y = 250 + 210 * Math.sin(radian);

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'day-glyph');
      group.setAttribute('data-index', index);
      group.style.cursor = 'pointer';

      // Glyph circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 18);
      circle.setAttribute('fill', '#1a1a1a');
      circle.setAttribute('stroke', '#d4af37');
      circle.setAttribute('stroke-width', '2');

      // Glyph text (emoji)
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 6);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '16');
      text.textContent = sign.symbol;

      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x);
      label.setAttribute('y', y + 28);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '8');
      label.setAttribute('fill', '#00a86b');
      label.setAttribute('font-family', 'Cinzel Decorative');
      label.textContent = sign.name.substring(0, 3);

      group.appendChild(circle);
      group.appendChild(text);
      group.appendChild(label);

      // Click handler
      group.addEventListener('click', () => {
        selectDay(index);
      });

      dayRing.appendChild(group);
    });

    // Create number glyphs on middle ring
    for (let i = 1; i <= 13; i++) {
      const angle = ((i - 1) * 27.69) - 90; // 360/13 ≈ 27.69 degrees
      const radian = (angle * Math.PI) / 180;
      const x = 250 + 140 * Math.cos(radian);
      const y = 250 + 140 * Math.sin(radian);

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'number-glyph');
      group.setAttribute('data-number', i);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 15);
      circle.setAttribute('fill', '#0d0d0d');
      circle.setAttribute('stroke', '#00a86b');
      circle.setAttribute('stroke-width', '1.5');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#d4af37');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-family', 'Cinzel Decorative');
      text.setAttribute('font-weight', 'bold');
      text.textContent = i;

      group.appendChild(circle);
      group.appendChild(text);
      numberRing.appendChild(group);
    }

    // Update initial display
    updateDisplay();
  }

  // Rotate wheels to specific day
  function rotateToDay(dayIndex) {
    if (isAnimating) return;
    isAnimating = true;

    const dayRotation = -(dayIndex * 18); // Each day is 18 degrees
    const numberRotation = (currentNumber - 1) * 27.69; // Each number is ~27.69 degrees

    dayRing.style.transform = `rotate(${dayRotation}deg)`;
    numberRing.style.transform = `rotate(${numberRotation}deg)`;

    // Highlight current
    document.querySelectorAll('.day-glyph circle').forEach((el, idx) => {
      if (idx === dayIndex) {
        el.setAttribute('fill', '#8b0000');
        el.setAttribute('stroke', '#ffd700');
        el.setAttribute('stroke-width', '3');
      } else {
        el.setAttribute('fill', '#1a1a1a');
        el.setAttribute('stroke', '#d4af37');
        el.setAttribute('stroke-width', '2');
      }
    });

    setTimeout(() => {
      isAnimating = false;
    }, 500);

    currentDayIndex = dayIndex;
    updateDisplay();
  }

  // Select specific day
  function selectDay(index) {
    currentDayIndex = index;
    rotateToDay(index);
  }

  // Navigate days
  function nextDay() {
    currentNumber = currentNumber >= 13 ? 1 : currentNumber + 1;
    currentDayIndex = (currentDayIndex + 1) % 20;
    rotateToDay(currentDayIndex);
  }

  function prevDay() {
    currentNumber = currentNumber <= 1 ? 13 : currentNumber - 1;
    currentDayIndex = (currentDayIndex - 1 + 20) % 20;
    rotateToDay(currentDayIndex);
  }

  function goToToday() {
    // Simulate today's date (4 Jaguar for demo)
    currentNumber = 4;
    currentDayIndex = 13; // Jaguar
    rotateToDay(currentDayIndex);
  }

  // Update all displays
  function updateDisplay() {
    const currentSign = daySigns[currentDayIndex];

    // Update center text
    currentDateDisplay.textContent = `${currentNumber} ${currentSign.name}`;

    // Update detail panel
    document.getElementById('lucky-number').textContent = currentNumber;
    document.getElementById('detail-day-glyph').textContent = currentSign.symbol;
    document.getElementById('detail-glyph-name').textContent = currentSign.meaning;
    document.getElementById('detail-day-name').textContent = `${currentNumber} ${currentSign.name} (${currentSign.name})`;
    document.getElementById('detail-meaning').textContent = currentSign.description;

    // Update attributes
    const directionAttr = document.querySelector('.attribute.direction');
    const elementAttr = document.querySelector('.attribute.element');
    const lordAttr = document.querySelector('.attribute.lord');

    directionAttr.querySelector('.attr-text').textContent = currentSign.direction;
    elementAttr.querySelector('.attr-text').textContent = currentSign.element;
    lordAttr.querySelector('.attr-text').textContent = currentSign.lord;

    // Update deity info based on number
    updateDeityInfo();
  }

  function updateDeityInfo() {
    const deities = [
      { name: 'Xiuhtecuhtli', domain: 'Lord of Fire and Time', glyph: '🔥' },
      { name: 'Tlaltecuhtli', domain: 'Earth Monster, source of life', glyph: '🌍' },
      { name: 'Chalchiuhtlicue', domain: 'She of the Jade Skirt', glyph: '👗' },
      { name: 'Tonatiuh', domain: 'The Sun, Eagle of the South', glyph: '☀️' },
      { name: 'Tlaloc', domain: 'He Who Makes Things Sprout', glyph: '🌧️' },
      { name: 'Quetzalcoatl', domain: 'Lord of Wind, Dawn, Knowledge', glyph: '🐍' },
      { name: 'Tezcatlipoca', domain: 'Smoking Mirror, Lord of Night', glyph: '🪞' },
      { name: 'Mayahuel', domain: 'Goddess of the Maguey', glyph: '🌵' },
      { name: 'Xipe Totec', domain: 'Our Lord the Flayed One', glyph: '🌽' },
      { name: 'Huitzilopochtli', domain: 'Hummingbird of the South', glyph: '🦅' },
      { name: 'Mictlantecuhtli', domain: 'Lord of the Land of the Dead', glyph: '💀' },
      { name: 'Xochiquetzal', domain: 'Precious Feather Flower', glyph: '🌸' },
      { name: 'Itzapapalotl', domain: 'Obsidian Butterfly', glyph: '🦋' }
    ];

    const deity = deities[(currentNumber - 1) % 13];
    document.getElementById('current-deity-glyph').textContent = deity.glyph;
    document.getElementById('deity-name').textContent = deity.name;
    document.getElementById('deity-domain').textContent = deity.domain;
    document.getElementById('deity-progress').style.width = `${(currentNumber / 13) * 100}%`;
    document.querySelector('.cycle-text').textContent = `Day ${currentNumber} of 13`;
  }

  // Eclipse Countdown Timer
  function initEclipseTimer() {
    // Set next eclipse to 4 days, 12 hours, 30 minutes from now
    const nextEclipse = new Date();
    nextEclipse.setDate(nextEclipse.getDate() + 4);
    nextEclipse.setHours(nextEclipse.getHours() + 12);
    nextEclipse.setMinutes(nextEclipse.getMinutes() + 30);

    function updateTimer() {
      const now = new Date();
      const diff = nextEclipse - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
      }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // Tooltip System
  function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-glyph]');
    tooltipElements.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        const glyphKey = el.getAttribute('data-glyph');
        const data = glyphDictionary[glyphKey];
        if (data) {
          showTooltip(e, data);
        }
      });
      el.addEventListener('mouseleave', () => {
        hideTooltip();
      });
      el.addEventListener('mousemove', (e) => {
        moveTooltip(e);
      });
    });
  }

  function showTooltip(e, data) {
    tooltip.querySelector('.tooltip-glyph').textContent = e.target.textContent.charAt(0);
    tooltip.querySelector('.tooltip-translation').textContent = data.translation;
    tooltip.querySelector('.tooltip-pronunciation').textContent = `[${data.pronunciation}]`;
    tooltip.querySelector('.tooltip-meaning').textContent = data.meaning;
    tooltip.classList.remove('hidden');
    setTimeout(() => tooltip.classList.add('visible'), 10);
    moveTooltip(e);
  }

  function moveTooltip(e) {
    const x = e.clientX;
    const y = e.clientY;

    // Keep tooltip on screen
    const rect = tooltip.getBoundingClientRect();
    let left = x - rect.width / 2;
    let top = y - rect.height - 15;

    if (left < 10) left = 10;
    if (left + rect.width > window.innerWidth - 10) left = window.innerWidth - rect.width - 10;
    if (top < 10) top = y + 20;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
    setTimeout(() => tooltip.classList.add('hidden'), 300);
  }

  // Modal System
  function initModals() {
    const ritualItems = document.querySelectorAll('.ritual-item');
    ritualItems.forEach(item => {
      item.addEventListener('click', () => {
        const date = item.getAttribute('data-date');
        const name = item.querySelector('.ritual-name').textContent;
        const glyph = item.querySelector('.ritual-glyph').textContent;
        openModal(name, `
          <div class="ritual-detail-view">
            <div class="ritual-header" style="text-align: center; margin-bottom: 2rem;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">${glyph}</div>
              <h3 style="color: var(--gold-primary); font-family: var(--font-ceremonial); margin-bottom: 0.5rem;">${name}</h3>
              <p style="color: var(--jade-light);">${date}</p>
            </div>
            <div class="ritual-description" style="color: #ccc; line-height: 1.8; margin-bottom: 2rem;">
              <p>This sacred ceremony marks an important juncture in the ritual calendar. Participants should prepare offerings of copal incense and observe the traditional fast from sunrise until the zenith passage.</p>
              <p>The priests will perform the traditional dance and call upon the ancient names to ensure the favor of the gods for the coming cycle.</p>
            </div>
            <div class="ritual-offerings" style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--blood-primary);">
              <h4 style="color: var(--blood-primary); margin-bottom: 0.5rem;">Required Offerings:</h4>
              <ul style="list-style: none; color: #aaa;">
                <li>• Copal incense (20 grains)</li>
                <li>• Paper banners (5 colors)</li>
                <li>• Quetzal feathers (if available)</li>
                <li>• Blood sacrifice (optional)</li>
              </ul>
            </div>
          </div>
        `);
      });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal(title, content) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('visible'), 10);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('visible');
    setTimeout(() => modal.classList.add('hidden'), 300);
    document.body.style.overflow = '';
  }

  // Continuous animations
  function initAnimations() {
    // Year ring slow rotation
    let yearRotation = 0;
    setInterval(() => {
      yearRotation += 0.5;
      yearRing.style.transform = `rotate(${yearRotation}deg)`;
    }, 100);

    // Compass animation
    const compassCenter = document.querySelector('.compass-center');
    setInterval(() => {
      const time = Date.now() / 1000;
      const glow = 20 + Math.sin(time) * 10;
      compassCenter.style.boxShadow = `0 0 ${glow}px rgba(212, 175, 55, 0.5)`;
    }, 50);
  }

  // Event Listeners
  rotateLeftBtn.addEventListener('click', prevDay);
  rotateRightBtn.addEventListener('click', nextDay);
  todayBtn.addEventListener('click', goToToday);

  // Initialize
  initializeWheels();
  initEclipseTimer();
  initTooltips();
  initModals();
  initAnimations();

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevDay();
    if (e.key === 'ArrowRight') nextDay();
    if (e.key === ' ') {
      e.preventDefault();
      goToToday();
    }
  });
});