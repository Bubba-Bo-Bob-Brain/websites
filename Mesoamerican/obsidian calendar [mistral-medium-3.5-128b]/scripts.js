// ===== DOM Elements =====
const rotatingWheel = document.getElementById('rotating-wheel');
const currentDayGlyph = document.getElementById('current-day-glyph');
const currentDayDate = document.getElementById('current-day-date');
const eclipseTimer = document.getElementById('eclipse-timer');
const tooltip = document.getElementById('tooltip');
const modal = document.getElementById('event-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalDate = document.getElementById('modal-date');
const modalClose = document.querySelector('.modal-close');
const dayMarkers = document.querySelectorAll('.day-marker');
const glyphs = document.querySelectorAll('.glyph, .tribute-item, .ritual-event');

// ===== Aztec Calendar Data =====
const tonalpohualliDays = [
    { glyph: '🗿', name: '1 Reed', deity: 'Tlaloc', description: 'A day of rain and fertility.' },
    { glyph: '🐆', name: '2 Jaguar', deity: 'Tepeyollotl', description: 'A day of strength and power.' },
    { glyph: '🦅', name: '3 Eagle', deity: 'Itzli', description: 'A day of vision and freedom.' },
    { glyph: '🐇', name: '4 Rabbit', deity: 'Mayahuel', description: 'A day of abundance and joy.' },
    { glyph: '💧', name: '5 Water', deity: 'Tlaloque', description: 'A day of cleansing and renewal.' }
];

const eclipseDate = new Date('2024-12-15T00:00:00').getTime();
const venusCycleDate = new Date('2024-12-15');
const solarAlignmentDate = new Date('2024-11-20');

// ===== Event Data =====
const eventData = {
    'Quetzalcoatl': {
        title: 'Feathered Serpent Ceremony',
        description: 'A ritual to honor Quetzalcoatl, the god of wind and wisdom. Offerings of jade and feathers are made.',
        date: '2024-11-25'
    },
    'Huitzilopochtli': {
        title: 'Sun God Tribute',
        description: 'A grand ceremony to honor Huitzilopochtli, the sun god. Warriors perform dances and offer captured enemies.',
        date: '2024-12-01'
    },
    'Tlaloc': {
        title: 'Rain Dance',
        description: 'A ritual to invoke Tlaloc, the rain god. Participants wear blue and green attire and dance in circular patterns.',
        date: '2024-11-18'
    },
    'Corn Tribute to Huitzilopochtli': {
        title: 'Corn Harvest Festival',
        description: 'A celebration of the corn harvest, dedicated to Huitzilopochtli. The community gathers to share food and offerings.',
        date: '2024-11-05'
    },
    'Jade Offering to Quetzalcoatl': {
        title: 'Jade Ritual',
        description: 'A sacred offering of jade to Quetzalcoatl, symbolizing purity and wisdom. Priests perform chants and burn copal incense.',
        date: '2024-11-12'
    },
    'Blood Sacrifice to Tlaloc': {
        title: 'Bloodletting Ceremony',
        description: 'A ritual to appease Tlaloc, the rain god. Participants perform bloodletting to ensure fertile lands and rain.',
        date: '2024-11-18'
    },
    'New Fire Ceremony': {
        title: 'New Fire Ceremony',
        description: 'A major ritual marking the beginning of a new cycle. A new fire is lit, and old fires are extinguished to symbolize renewal.',
        date: '2024-11-25'
    },
    'Feast of the Dead': {
        title: 'Feast of the Dead',
        description: 'A festival to honor the deceased. Families gather to share meals and offer food to the spirits of their ancestors.',
        date: '2024-12-01'
    },
    'Serpent Dance': {
        title: 'Serpent Dance',
        description: 'A ceremonial dance to honor the Feathered Serpent, Quetzalcoatl. Dancers move in serpentine patterns to invoke his blessings.',
        date: '2024-12-10'
    }
};

// ===== Initialize the Calendar =====
function initCalendar() {
    // Set the initial day (default: first day in tonalpohualliDays)
    updateCentralStone(0);

    // Start the eclipse countdown
    startEclipseCountdown();

    // Set Venus and Solar dates
    document.getElementById('venus-date').textContent = formatDate(venusCycleDate);
    document.getElementById('solar-date').textContent = formatDate(solarAlignmentDate);

    // Add event listeners
    setupEventListeners();
}

// ===== Update Central Stone =====
function updateCentralStone(index) {
    const day = tonalpohualliDays[index % tonalpohualliDays.length];
    currentDayGlyph.textContent = day.glyph;
    currentDayDate.textContent = day.name;
}

// ===== Eclipse Countdown Timer =====
function startEclipseCountdown() {
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eclipseDate - now;

        if (distance < 0) {
            eclipseTimer.textContent = 'Eclipse Now!';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        eclipseTimer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Format Date =====
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Wheel rotation (drag)
    let isDragging = false;
    let startAngle = 0;
    let currentAngle = 0;

    const wheelHandle = document.querySelector('.wheel-handle');
    const wheelInner = document.getElementById('rotating-wheel');

    wheelHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = wheelInner.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        startAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const rect = wheelInner.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const currentMouseAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

        const angleDiff = currentMouseAngle - startAngle;
        currentAngle += angleDiff;
        wheelInner.style.transform = `rotate(${currentAngle}deg)`;

        // Update the central stone based on rotation (simplified: snap to nearest day)
        const dayIndex = Math.round((currentAngle % 360) / (360 / tonalpohualliDays.length));
        updateCentralStone(dayIndex);

        startAngle = currentMouseAngle;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Click on day markers
    dayMarkers.forEach((marker, index) => {
        marker.addEventListener('click', () => {
            updateCentralStone(index);
            // Rotate the wheel to align the clicked marker to the top
            const angle = (360 / dayMarkers.length) * index;
            wheelInner.style.transform = `rotate(${-angle}deg)`;
            currentAngle = -angle;
        });
    });

    // Tooltip system
    glyphs.forEach(glyph => {
        glyph.addEventListener('mouseenter', (e) => {
            const tooltipText = glyph.getAttribute('data-tooltip');
            if (tooltipText) {
                tooltip.textContent = tooltipText;
                tooltip.style.opacity = '1';
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
            }
        });

        glyph.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        glyph.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        // Click to open modal (for events)
        glyph.addEventListener('click', () => {
            const eventKey = glyph.getAttribute('data-tooltip') || glyph.textContent.trim();
            const event = eventData[eventKey] || eventData[Object.keys(eventData).find(key => key.includes(eventKey))];

            if (event) {
                modalTitle.textContent = event.title;
                modalDescription.textContent = event.description;
                modalDate.textContent = `Date: ${event.date}`;
                modal.classList.add('active');
            }
        });
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// ===== Feathered Serpent Border Animation Enhancement =====
function enhanceSerpentAnimation() {
    const segments = document.querySelectorAll('.serpent-segment');
    segments.forEach((segment, index) => {
        // Randomize animation duration for organic movement
        segment.style.animationDuration = `${15 + Math.random() * 10}s`;
        segment.style.animationDelay = `${-Math.random() * 20}s`;
    });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    enhanceSerpentAnimation();
});