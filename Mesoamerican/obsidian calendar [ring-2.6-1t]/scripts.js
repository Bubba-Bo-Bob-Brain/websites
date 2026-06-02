// ============================================
// Tōnalpōhualli — Sacred Ceremonial Calendar
// Main Application Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ===================== DATA =====================

    const DAY_SIGNS = [
        { glyph: '🐊', name: 'Cipactli', translation: 'Crocodile', deity: 'Tonacatecuhtli', deityDomain: 'Creator', element: 'Earth', description: 'The primordial crocodile, representing the first day of creation. Cipactli is the day of beginnings, fertility, and the earth that floats on the cosmic waters. Offerings of food and incense honor the foundation of all things.', tone: 'Power and primordial creation', luckyColor: '#00c9a7', direction: 'East' },
        { glyph: '🌿', name: 'Ehécatl', translation: 'Wind', deity: 'Quetzalcoatl', deityDomain: 'Feathered Serpent', element: 'Air', description: 'The day of Ehecatl, the wind aspect of Quetzalcoatl. Breath of life sweeps across the land. This day favors movement, change, and the scattering of old patterns. Rituals call upon the feathered serpent to carry prayers skyward.', tone: 'Movement and transformation', luckyColor: '#2ec4b6', direction: 'North' },
        { glyph: '🔥', name: 'Calli', translation: 'House', deity: 'Chalchiuhtlicue', deityDomain: 'Running Water', element: 'Water', description: 'The sacred house, a day of shelter and community. Chalchiuhtlicue, goddess of flowing waters, blesses homes and families. Ceremonies focus on protection, domestic harmony, and the blessing of new dwellings.', tone: 'Stability and shelter', luckyColor: '#d4a843', direction: 'West' },
        { glyph: '🌮', name: 'Cuetzpalin', translation: 'Lizard', deity: 'Huehuecóyotl', deityDomain: 'Old Coyote', element: 'Earth', description: 'The quick lizard, a day of unpredictability and sudden change. Huehuecóyotl, the old coyote trickster, dances through chaos bringing hidden wisdom. This day is for revelry, music, and embracing the unexpected.', tone: 'Cunning and surprise', luckyColor: '#e63946', direction: 'South' },
        { glyph: '🐍', name: 'Cōātl', translation: 'Serpent', deity: 'Chalchiuhtlicue', deityDomain: 'Running Water', element: 'Water', description: 'The sacred serpent descends to earth. A powerful day for wisdom, knowledge, and spiritual transformation. The feathered serpent Quetzalcoatl and his twin Xolotl illuminate the path between worlds.', tone: 'Wisdom and duality', luckyColor: '#00c9a7', direction: 'East' },
        { glyph: '', name: 'Miquiztli', translation: 'Death', deity: 'Tonatiuh', deityDomain: 'The Sun', element: 'Fire', description: 'The day of death and transformation. Tonatiuh, the sun god, demands sacrifice to continue his journey through the underworld. This solemn day honors ancestors and the eternal cycle of life, death, and renewal.', tone: 'Sacrifice and transition', luckyColor: '#6b0000', direction: 'North' },
        { glyph: '🦌', name: 'Mazātl', translation: 'Deer', deity: 'Tlazolteotl', deityDomain: 'Purification', element: 'Earth', description: 'The graceful deer brings swiftness and agility. Tlazolteotl, the eater of filth, offers purification on this day. Hunters pray for success, and the sick seek healing. A day of pursuit, both literal and spiritual.', tone: 'Grace and pursuit', luckyColor: '#a0522d', direction: 'West' },
        { glyph: '🌾', name: 'Tōchtli', translation: 'Rabbit', deity: 'Mayahuel', deityDomain: 'Agave', element: 'Water', description: 'The rabbit embodies fertility, pulque, and abundance. Mayahuel, goddess of the maguey plant, presides over this joyful day. Celebrants feast and drink, honoring the intoxicating gifts of the earth.', tone: 'Joy and intoxication', luckyColor: '#f4a261', direction: 'South' },
        { glyph: '💧', name: 'Ātl', translation: 'Water', deity: 'Chalchiuhtlicue', deityDomain: 'Running Water', element: 'Water', description: 'Water floods the sacred calendar. Chalchiuhtlicue, the jade-skirted goddess, commands rivers and rain. This day is for purification rites, baptismal ceremonies, and offerings cast upon the waters.', tone: 'Purification and flow', luckyColor: '#2ec4b6', direction: 'East' },
        { glyph: '🐕', name: 'Itzcuintli', translation: 'Dog', deity: 'Mictlantecuhtli', deityDomain: 'Underworld', element: 'Earth', description: 'The loyal dog guides souls across the river of the underworld. Mictlantecuhtli, lord of Mictlan, watches over this day. Dogs are honored and sometimes sacrificed to accompany the dead on their final journey.', tone: 'Loyalty and the afterlife', luckyColor: '#8b4513', direction: 'North' },
        { glyph: '🐒', name: 'Ozomahtli', translation: 'Monkey', deity: 'Xochipilli', deityDomain: 'Flowers & Art', element: 'Air', description: 'The clever monkey, a day of artistry, music, and games. Xochipilli, the flower prince, inspires creativity and celebration. Performers, artists, and lovers find favor under this playful sign.', tone: 'Creativity and play', luckyColor: '#e9c46a', direction: 'West' },
        { glyph: '🌱', name: 'Malīnalli', translation: 'Grass', deity: 'Patecatl', deityDomain: 'Medicine', element: 'Earth', description: 'The healing grass, presided over by Patecatl, god of pulque and medicine. This day favors herbalists, healers, and those seeking cures. The green vitality of life pushes through the sacred earth.', tone: 'Healing and growth', luckyColor: '#2a9d8f', direction: 'South' },
        { glyph: '🪶', name: 'Ācatl', translation: 'Reed', deity: 'Tezcatlipoca', deityDomain: 'Destiny & Night', element: 'Air', description: 'The tall reed, a day of duality presided by Tezcatlipoca, the smoking mirror. This day brings fate, destiny, and the revealing of hidden truths. Kings are crowned and destinies revealed under the reed\'s sway.', tone: 'Fate and revelation', luckyColor: '#f48c06', direction: 'East' },
        { glyph: '🦎', name: 'Ocēlōtl', translation: 'Jaguar', deity: 'Tezcatlipoca', deityDomain: 'Destiny & Night', element: 'Earth', description: 'The mighty jaguar, warrior of the night. Tezcatlipoca\'s power peaks on this day. Warriors prepare for battle, and sorcerers draw upon the jaguar\'s ferocity. A day of courage, power, and nocturnal magic.', tone: 'Power and warfare', luckyColor: '#6b0000', direction: 'North' },
        { glyph: '✦', name: 'Quiyahuitl', translation: 'Rain', deity: 'Tlaloc', deityDomain: 'Rain & Storms', element: 'Water', description: 'Blessed rain falls upon the sacred count. Tlaloc, the goggle-eyed rain god, opens his celestial jade bowl. Farmers pray for crops, and children are blessed with rainwater for vitality and growth.', tone: 'Fertility and blessing', luckyColor: '#00c9a7', direction: 'West' },
        { glyph: '🌺', name: 'Xōchitl', translation: 'Flower', deity: 'Xochiquetzal', deityDomain: 'Beauty & Love', element: 'Earth', description: 'The sacred flower blooms in the cosmic garden. Xochiquetzal, goddess of beauty and love, presides over art, flowers, and pleasure. This day celebrates beauty in all its fleeting, exquisite forms.', tone: 'Beauty and passion', luckyColor: '#e63946', direction: 'South' },
        { glyph: '🔶', name: 'Tecpatl', translation: 'Flint', deity: 'Chalchiuhtotolin', deityDomain: 'Purification', element: 'Fire', description: 'The sacrificial flint knife, sharp and unyielding. Chalchiuhtotolin, the obsidian turkey, brings purification through trials. This day demands courage and truth. Flints are ritually knapped and offered to the gods.', tone: 'Trial and purification', luckyColor: '#d4a843', direction: 'East' },
        { glyph: '🌍', name: 'Quiahuitl', translation: 'Rain (Storm)', deity: 'Tonatiuh', deityDomain: 'The Sun', element: 'Water', description: 'The storm rain, governed by Tonatiuh\'s solar fire meeting celestial waters. A day of dramatic weather and sudden change. Ceremonies honor the union of fire and water, heaven and earth.', tone: 'Drama and renewal', luckyColor: '#f4a261', direction: 'West' },
        { glyph: '🏔️', name: 'Xōchitl', translation: 'Flower (Sacred)', deity: 'Xochipilli', deityDomain: 'Art & Dance', element: 'Earth', description: 'The second flower sign deepens the sacred bloom. Xochipilli\'s ecstasy fills this day with dance, song, and the intoxication of artistic creation. The boundary between the sacred and profane dissolves.', tone: 'Ecstasy and art', luckyColor: '#e76f51', direction: 'South' },
        { glyph: '🌄', name: 'Ōllīn', translation: 'Movement/Earthquake', deity: 'Xolotl', deityDomain: 'Twin/Guide', element: 'Fire', description: 'The earthquake, the day of movement and cosmic instability. Xolotl, the dark twin of Quetzalcoatl, guides the sun through the dangerous underworld. This day signals upheaval, revolution, and necessary destruction.', tone: 'Chaos and transformation', luckyColor: '#f48c06', direction: 'North' }
    ];

    const SOLAR_MONTHS = [
        { name: 'Atlacualo', days: 20, desc: 'Flood cessation', glyph: '💧' },
        { name: 'Tititl', days: 20, desc: 'Hardening earth', glyph: '🏔️' },
        { name: 'Tozoztontli', days: 20, desc: 'Small vigil', glyph: '🪶' },
        { name: 'Huey Tozoztli', days: 20, desc: 'Great vigil', glyph: '🐦' },
        { name: 'Toxcatl', days: 20, desc: 'Drought & offering', glyph: '🌾' },
        { name: 'Etzalcualiztli', days: 20, desc: 'Meal of corn & beans', glyph: '🌽' },
        { name: 'Tecuilhuitontli', days: 20, desc: 'Small feast', glyph: '🌺' },
        { name: 'Huey Tecuilhuitl', days: 20, desc: 'Great feast', glyph: '🎶' },
        { name: 'Tlaxochimaco', days: 20, desc: 'Flowers offered', glyph: '🌸' },
        { name: 'Xocotlhuetzi', days: 20, desc: 'Fruit falling', glyph: '🍎' },
        { name: 'Ochpaniztli', days: 20, desc: 'Sweeping clean', glyph: '🧹' },
        { name: 'Teotleco', days: 20, desc: 'God arrival', glyph: '✨' },
        { name: 'Tepeilhuitl', days: 20, desc: 'Mountain feast', glyph: '⛰️' },
        { name: 'Quecholli', days: 20, desc: 'Roseate spoonbill', glyph: '🦩' },
        { name: 'Panquetzaliztli', days: 20, desc: 'Flag raising', glyph: '🎏' },
        { name: 'Atemoztli', days: 20, desc: 'Water descent', glyph: '❄️' },
        { name: 'Tititl', days: 20, desc: 'Harvest home', glyph: '🌽' },
        { name: 'Izcalli', days: 20, desc: 'Growth & renewal', glyph: '🌱' }
    ];

    const TRIBUTE_DATA = [
        { icon: '👑', name: 'Quetzal Plumes', offering: '20 bundles of quetzal feathers', deity: 'Quetzalcoatl', frequency: 'Monthly', cycle: '1 Tochtli' },
        { icon: '🥇', name: 'Gold Dust', offering: '2,000 bags of gold dust (teocuitlatl)', deity: 'Huitzilopochtli', frequency: 'Quarterly', cycle: '4 Acatl' },
        { icon: '🩸', name: 'Sacred Blood', offering: 'Ritual blood on amate paper', deity: 'Tonatiuh', frequency: 'Daily', cycle: 'Every 13 days' },
        { icon: '🌶️', name: 'Cacao Beans', offering: '8,000 cacao beans ground to paste', deity: 'Ek Chuaj', frequency: 'Monthly', cycle: '1 Ocelotl' },
        { icon: '🪶', name: 'Jade Beads', offering: '108 jade beads strung on gold', deity: 'Chalchiuhtlicue', frequency: 'Seasonal', cycle: '1 Atlcahualo' },
        { icon: '🌽', name: 'Tamales & Corn', offering: 'Tamales, atole, and dried maize', deity: 'Centeotl', frequency: 'Monthly', cycle: '1 Huey Tozoztli' },
        { icon: '🦅', name: 'Eagle Feathers', offering: 'Captured eagles and their plumage', deity: 'Huitzilopochtli', frequency: 'Quarterly', cycle: '1 Panquetzaliztli' },
        { icon: '🕯️', name: 'Copal Incense', offering: 'Copal resin and smoking braziers', deity: 'Tezcatlipoca', frequency: 'Daily', cycle: 'Every dawn' },
        { icon: '🧵', name: 'Cotton Garments', offering: 'Finely woven tilmatli cloaks', deity: 'Tlazolteotl', frequency: 'Bi-annual', cycle: '1 Ochpaniztli' },
        { icon: '🐚', name: 'Conch Shells', offering: 'Purple-dyed conch trumpets', deity: 'Quetzalcoatl', frequency: 'Seasonal', cycle: '1 Teotleco' },
        { icon: '🍯', name: 'Honey Cakes', offering: 'Honey, amaranth, and maguey syrup', deity: 'Xochiquetzal', frequency: 'Monthly', cycle: '1 Xochimaco' },
        { icon: '🗿', name: 'Obsidian Blades', offering: 'Sacrificial obsidian tecpatl', deity: 'Itzpapalotl', frequency: 'Quarterly', cycle: '1 Tecpatl' }
    ];

    const ASTRONOMICAL_EVENTS = [
        { name: 'Solar Eclipse', icon: '🌑', date: getNextEclipseDate(), status: 'upcoming', description: 'The sun is devoured by darkness' },
        { name: 'Lunar Eclipse', icon: '🌕', date: getNextLunarEclipseDate(), status: 'upcoming', description: 'The moon drinks the shadow' },
        { name: 'Spring Equinox', icon: '🌸', date: getNextEquinox(), status: 'upcoming', description: 'Teotihuacán serpent shadow descends' },
        { name: 'Venus Station', icon: '✨', date: getNextVenusStation(), status: 'upcoming', description: 'Evening star pauses in the sky' },
        { name: 'Pleiades Zenith', icon: '⭐', date: getNextPleiadesZenith(), status: 'upcoming', description: 'The 400 boys return to the zenith' },
        { name: 'Summer Solstice', icon: '☀️', date: getNextSolstice(), status: 'upcoming', description: 'The sun reaches its highest throne' },
        { name: 'Autumn Equinox', icon: '🍂', date: getNextAutumnEquinox(), status: 'pending', description: 'Day and night stand in perfect balance' },
        { name: 'Winter Solstice', icon: '❄️', date: getNextWinterSolstice(), status: 'pending', description: 'The newborn sun begins its ascent' }
    ];

    const DEITIES = [
        { glyph: '🦅', name: 'Huitzilopochtli', domain: 'Sun & War', description: 'The hummingbird of the south, patron of the Aztec people. His hummingbird helmet gleams with iridescent feathers as he wages eternal war against darkness.', color: '#d4a843', offerings: 'Hummingbirds, eagles, warriors\' blood' },
        { glyph: '🐍', name: 'Quetzalcoatl', domain: 'Wind & Wisdom', description: 'The feathered serpent, lord of winds and learning. His emerald plumes cascade across the sky as he bridges heaven and earth.', color: '#2ec4b6', offerings: 'Quetzal feathers, serpentine incense' },
        { glyph: '👁️', name: 'Tezcatlipoca', domain: 'Destiny & Night', description: 'The smoking mirror, lord of the night sky. His obsidian mirror reveals all truths and conceals all lies. He walks between stars as destiny itself.', color: '#1a1a3e', offerings: 'Obsidian mirrors, jaguar pelts' },
        { glyph: '🌊', name: 'Chalchiuhtlicue', domain: 'Running Water', description: 'She of the jade skirt, goddess of rivers and streams. Her cascading waters cleanse all impurities and nurture the crops of the world.', color: '#00c9a7', offerings: 'Jade beads, water lilies' },
        { glyph: '🌺', name: 'Xochiquetzal', domain: 'Beauty & Love', description: 'Flower feather, goddess of love and artistry. Her presence fills the world with flowers, song, and the intoxication of desire.', color: '#e63946', offerings: 'Flowers, butterflies, quail blood' },
        { glyph: '🌽', name: 'Centeotl', domain: 'Maize & Sustenance', description: 'Lord of maize, golden-bodied and generous. His flesh becomes the sacred corn that sustains all civilization.', color: '#f4a261', offerings: 'Tamales, atole, first fruits' },
        { glyph: '💀', name: 'Mictlantecuhtli', domain: 'The Underworld', description: 'Lord of Mictlan, the nine-layered land of the dead. His skeletal frame is adorned with owl feathers and sacrificial blood.', color: '#6b0000', offerings: 'Human sacrifice, jade, obsidian' },
        { glyph: '🔥', name: 'Xiuhtecuhtli', domain: 'Fire & Time', description: 'The old god of fire and time. His turquoise mosaic headdress blazes eternally at the center of the universe, marking the passage of ages.', color: '#f48c06', offerings: 'First fire, copal, new year rites' },
        { glyph: '🐆', name: 'Tlazolteotl', domain: 'Purification', description: 'The eater of filth, goddess of sin and absolution. She devours the impurities of the soul, granting redemption through confession.', color: '#a0522d', offerings: 'Corn dough, confession rites' },
        { glyph: '🌀', name: 'Ehecatl', domain: 'Wind & Breath', description: 'The wind serpent with the beak of a duck. His breath moves the sacred calendar forward and carries the prayers of the faithful to the gods.', color: '#264653', offerings: 'Wind instruments, aromatic herbs' },
        { glyph: '🦎', name: 'Itzpapalotl', domain: 'Obsidian Butterfly', description: 'Obsidian butterfly of the starry sky. Her wings of volcanic glass cut through darkness. She presides over the Tzitzimimeh, the star demons.', color: '#3d0050', offerings: 'Obsidian blades, black copal' },
        { glyph: '🐊', name: 'Cipactli', domain: 'Primordial Earth', description: 'The cosmic crocodile upon whose back the earth rests. In the beginning, the gods sacrificed themselves upon her body to create the world.', color: '#0a3d3a', offerings: 'Crocodile teeth, earth offerings' }
    ];

    const GlyphTranslations = {
        water: { glyph: '💧', name: 'Ātl', translation: 'Water', deity: 'Chalchiuhtlicue', meaning: 'Purification, life, and the primordial waters of creation' },
        jaguar: { glyph: '🐆', name: 'Ocēlōtl', translation: 'Jaguar', deity: 'Tezcatlipoca', meaning: 'Power, the night, and the warrior\'s spirit' },
        wind: { glyph: '🌀', name: 'Ehēcātl', translation: 'Wind', deity: 'Quetzalcoatl', meaning: 'Movement, change, and the breath of the Feathered Serpent' },
        house: { glyph: '🏠', name: 'Calli', translation: 'House', deity: 'Chalchiuhtlicue', meaning: 'Community, stability, and the sheltering embrace of the gods' },
        snake: { glyph: '🐍', name: 'Cōātl', translation: 'Serpent', deity: 'Quetzalcoatl', meaning: 'Wisdom, duality, and the bridge between worlds' },
        death: { glyph: '💀', name: 'Miquiztli', translation: 'Death', deity: 'Tonatiuh', meaning: 'Sacrifice, transformation, and the eternal solar cycle' },
        rain: { glyph: '🌧️', name: 'Quiyahuitl', translation: 'Rain', deity: 'Tlaloc', meaning: 'Fertility, abundance, and the celestial water jar' },
        flower: { glyph: '🌺', name: 'Xōchitl', translation: 'Flower', deity: 'Xochiquetzal', meaning: 'Beauty, art, love, and the fleeting nature of life' },
        flint: { glyph: '🔶', name: 'Tecpatl', translation: 'Flint', deity: 'Chalchiuhtotolin', meaning: 'Sacrifice, trial, and the obsidian blade of truth' },
        rabbit: { glyph: '🐇', name: 'Tōchtli', translation: 'Rabbit', deity: 'Mayahuel', meaning: 'Fertility, pulque, and the intoxicating abundance of life' },
        reeds: { glyph: '🪶', name: 'Ācatl', translation: 'Reed', deity: 'Tezcatlipoca', meaning: 'Fate, kingship, and the revelation of destiny' },
        journey: { glyph: '🌄', name: 'Ōllīn', translation: 'Movement', deity: 'Xolotl', meaning: 'Earthquakes, change, and the sun\'s perilous underworld journey' }
    };

    // ===================== STATE =====================

    const state = {
        currentDayIndex: 0,
        currentDayNumber: 1,
        rotationAngle: 0,
        wheelAnimating: false,
        deityOffset: 0,
        sacredTones: []
    };

    // ===================== CALCULATIONS =====================

    // Calculate current Tōnalpōhualli day
    function calculateCurrentDay() {
        // Known reference: 1 Crocodile (1 Cipactli)
        // Using a correlation where a known date maps to the cycle
        // Julian Day 0 = Jan 1, 4713 BCE
        // We'll use a simplified approach with a known epoch
        
        // Reference: 0 Pop (Mayan) = 1 Crocodile corresponds to a Julian Day count
        // For the Gregorian calendar, we calculate days since a known epoch
        
        // Using reference: December 23, 2012 = 1 Imix (1 Crocodile) in GMT correlation
        const epoch = new Date('2012-12-23T00:00:00Z');
        const now = new Date();
        
        const diffMs = now - epoch;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const cycleDay = ((diffDays % 260) + 260) % 260;
        
        return cycleDay;
    }

    function getCurrentDayInfo() {
        const dayIndex = calculateCurrentDay();
        const signIndex = dayIndex % 20;
        const numberIndex = dayIndex % 13;
        const number = numberIndex + 1;
        const sign = DAY_SIGNS[signIndex];
        
        return {
            dayIndex,
            signIndex,
            number,
            sign,
            fullName: `${number} ${sign.name}`,
            trecena: Math.floor(dayIndex / 13),
            trecenaStartSignIndex: ((20 - (dayIndex % 13) * 13 + dayIndex % 20) % 20) || 0
        };
    }

    function getTrecenaStartSignIndex(dayIndex) {
        const trecenaNum = Math.floor(dayIndex / 13);
        return (trecenaNum * 13) % 20;
    }

    function getNextEclipseDate() {
        const now = new Date();
        const eclipses = [
            new Date('2025-03-29'),
            new Date('2025-09-21'),
            new Date('2026-03-14'),
            new Date('2026-08-12'),
            new Date('2027-02-06'),
            new Date('2027-07-22'),
            new Date('2028-01-12'),
            new Date('2028-07-06')
        ];
        for (const d of eclipses) {
            if (d > now) return d;
        }
        return new Date('2028-07-06');
    }

    function getNextLunarEclipseDate() {
        const now = new Date();
        const eclipses = [
            new Date('2025-03-14'),
            new Date('2025-09-07'),
            new Date('2026-03-03'),
            new Date('2026-08-28'),
            new Date('2027-02-20'),
            new Date('2027-08-17')
        ];
        for (const d of eclipses) {
            if (d > now) return d;
        }
        return new Date('2027-08-17');
    }

    function getNextEquinox() {
        const now = new Date();
        const year = now.getFullYear();
        const springEquinox = new Date(year, 2, 20);
        const autumnEquinox = new Date(year, 8, 22);
        return now < springEquinox ? springEquinox : autumnEquinox;
    }

    function getNextSolstice() {
        const now = new Date();
        const year = now.getFullYear();
        const summerSolstice = new Date(year, 5, 21);
        const winterSolstice = new Date(year, 11, 21);
        return now < summerSolstice ? summerSolstice : winterSolstice;
    }

    function getNextAutumnEquinox() {
        const now = new Date();
        const year = now.getFullYear();
        const autumnEquinox = new Date(year, 8, 22);
        return now < autumnEquinox ? autumnEquinox : new Date(year + 1, 8, 22);
    }

    function getNextWinterSolstice() {
        const now = new Date();
        const year = now.getFullYear();
        const winterSolstice = new Date(year, 11, 21);
        return now < winterSolstice ? winterSolstice : new Date(year + 1, 11, 21);
    }

    function getNextVenusStation() {
        const now = new Date();
        // Venus synodic period ≈ 584 days
        const baseStation = new Date('2023-10-23');
        const nextStation = new Date(baseStation.getTime() + 584 * 24 * 60 * 60 * 1000);
        return nextStation > now ? nextStation : new Date(nextStation.getTime() + 584 * 24 * 60 * 60 * 1000);
    }

    function getNextPleiadesZenith() {
        const now = new Date();
        const year = now.getFullYear();
        // Pleiades zenith at Teotihuacan around May 4-5 and around Nov 13
        const zenith1 = new Date(year, 4, 4);
        const zenith2 = new Date(year, 10, 13);
        if (now < zenith1) return zenith1;
        if (now < zenith2) return zenith2;
        return new Date(year + 1, 4, 4);
    }

    function formatCountdown(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { days, hours, minutes, seconds };
    }

    // ===================== RENDER FUNCTIONS =====================

    function initCalendarWheel() {
        const info = getCurrentDayInfo();
        state.currentDayIndex = info.dayIndex;
        state.currentDayNumber = info.number;
        state.rotationAngle = -(info.signIndex / 20) * 360;

        const daySign = DAY_SIGNS[info.signIndex];

        // Update wheel position
        const dayMarker = document.getElementById('dayMarker');
        const segmentAngle = 360 / 20;
        const markerAngle = info.signIndex * segmentAngle;
        dayMarker.style.transform = `translateX(-50%) rotate(${markerAngle}deg)`;

        // Update info display
        document.getElementById('currentDaySign').textContent = daySign.name;
        document.getElementById('currentDayNumber').textContent = `${info.number} ${daySign.name}`;

        // Center glyph
        document.querySelector('.center-glyph').textContent = daySign.glyph;

        // Add day markers around the wheel
        const wheel = document.getElementById('stoneWheel');
        for (let i = 0; i < 20; i++) {
            const marker = document.createElement('div');
            marker.className = 'wheel-day-marker-marker';
            const angle = (i / 20) * 360;
            const rad = angle * Math.PI / 180;
            const radius = 175;
            const x = 210 + radius * Math.sin(angle * Math.PI / 180) - 4;
            const y = 210 - radius * Math.cos(angle * Math.PI / 180) - 4;
            marker.style.left = `${x}px`;
            marker.style.top = `${y}px`;
            if (i === info.signIndex) {
                marker.style.background = 'var(--fire)';
                marker.style.boxShadow = '0 0 15px var(--blood-glow)';
            } else {
                marker.style.background = 'rgba(212, 168, 67, 0.4)';
            }
            marker.style.position = 'absolute';
            marker.style.width = '8px';
            marker.style.height = '8px';
            marker.style.borderRadius = '50%';
            marker.style.zIndex = '2';
            marker.style.transition = 'all 0.5s ease';
            wheel.appendChild(marker);
        }
    }

    function renderSacredGrid() {
        const grid = document.getElementById('sacredGrid');
        const info = getCurrentDayInfo();
        
        // Show all 20 day signs
        DAY_SIGNS.forEach((sign, index) => {
            const cell = document.createElement('div');
            cell.className = 'sacred-cell' + (index === info.signIndex ? ' active' : '');
            const number = ((index - (info.signIndex % 13) + 20) % 13) + 1;
            
            cell.innerHTML = `
                <span class="day-glyph">${sign.glyph}</span>
                <div class="day-name">${sign.name}</div>
                <div class="day-number">${number}</div>
            `;
            
            cell.addEventListener('mouseenter', (e) => showTooltip(e, sign, number));
            cell.addEventListener('mousemove', moveTooltip);
            cell.addEventListener('mouseleave', hideTooltip);
            
            grid.appendChild(cell);
        });
    }

    function renderSolarCalendar() {
        const container = document.getElementById('solarMonths');
        const now = new Date();
        const currentMonth = now.getMonth();

        SOLAR_MONTHS.forEach((month, index) => {
            const div = document.createElement('div');
            div.className = 'solar-month' + (index === currentMonth ? ' current-month' : '');
            div.innerHTML = `
                <span class="solar-month-number">${index + 1}</span>
                <span class="solar-month-name">${month.name}</span>
                <span class="solar-month-days">${month.days} days</span>
                <span class="solar-month-desc">${month.desc}</span>
            `;
            
            div.addEventListener('click', () => {
                div.classList.toggle('active');
            });
            
            container.appendChild(div);
        });

        // Nemontemi
        const nemontemiContainer = document.getElementById('nemontemiDays');
        for (let i = 1; i <= 5; i++) {
            const day = document.createElement('div');
            day.className = 'nemontemi-day';
            day.textContent = i;
            day.title = `Nameless Day ${i} — Unlucky period`;
            nemontemiContainer.appendChild(day);
        }
    }

    function renderTributeGrid() {
        const grid = document.getElementById('tributeGrid');
        
        TRIBUTE_DATA.forEach(item => {
            const div = document.createElement('div');
            div.className = 'tribute-item';
            div.innerHTML = `
                <span class="tribute-icon">${item.icon}</span>
                <div class="tribute-name">${item.name}</div>
                <div class="tribute-offering">${item.offering}</div>
                <div class="tribute-deity">For ${item.deity} · ${item.frequency}</div>
            `;
            
            div.addEventListener('mouseenter', function(e) {
                this.classList.add('active');
            });
            div.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
            
            grid.appendChild(div);
        });
    }

    function renderAstronomicalEvents() {
        const container = document.getElementById('astroEvents');
        
        ASTRONOMICAL_EVENTS.forEach(event => {
            const div = document.createElement('div');
            div.className = 'astro-event';
            div.innerHTML = `
                <span class="astro-event-icon">${event.icon}</span>
                <div class="astro-event-info">
                    <div class="astro-event-name">${event.name}</div>
                    <div class="astro-event-date">${event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <span class="astro-event-status ${event.status}">${event.status}</span>
            `;
            
            div.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--jade)';
                this.style.boxShadow = '0 0 20px var(--jade-glow)';
            });
            div.addEventListener('mouseleave', function() {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            });
            
            container.appendChild(div);
        });
    }

    function renderVenusTracker() {
        // Venus synodic period = 583.92 days
        const baseDate = new Date('2023-10-23');
        const now = new Date();
        const elapsed = (now - baseDate) / (1000 * 60 * 60 * 24);
        const phase = (elapsed % 584) / 584;
        const percentage = Math.floor(phase * 100);
        
        document.getElementById('venusFill').style.width = `${percentage}%`;
        
        let phaseName;
        if (phase < 0.125) phaseName = 'Evening Star — Appearing';
        else if (phase < 0.375) phaseName = 'Evening Star — Ascending';
        else if (phase < 0.5) phaseName = 'Maximum Brightness';
        else if (phase < 0.625) phaseName = 'Morning Star — Descending';
        else if (phase < 0.875) phaseName = 'Morning Star — Fading';
        else phaseName = 'Inferior Conjunction — Hidden';
        
        document.getElementById('venusPhase').textContent = `${phaseName} (${percentage}% complete)`;
    }

    function renderDeityCarousel() {
        const track = document.getElementById('deityTrack');
        
        // Duplicate deities for infinite scroll effect
        const allDeities = [...DEITIES, ...DEITIES, ...DEITIES];
        
        allDeities.forEach((deity, index) => {
            const card = document.createElement('div');
            card.className = 'deity-card';
            card.innerHTML = `
                <span class="deity-glyph">${deity.glyph}</span>
                <div class="deity-name">${deity.name}</div>
                <div class="deity-domain">${deity.domain}</div>
            `;
            
            card.addEventListener('mouseenter', function() {
                this.querySelector('.deity-glyph').style.color = deity.color;
                this.querySelector('.deity-glyph').style.textShadow = `0 0 15px ${deity.color}88`;
            });
            
            card.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.querySelector('.deity-glyph').style.color = '';
                    this.querySelector('.deity-glyph').style.textShadow = '';
                }
            });
            
            track.appendChild(card);
        });

        // Set the middle set as active
        const cards = track.querySelectorAll('.deity-card');
        if (cards.length > DEITIES.length) {
            cards[DEITIES.length].classList.add('active');
            cards[DEITIES.length].querySelector('.deity-glyph').style.color = DEITIES[0].color;
            cards[DEITIES.length].querySelector('.deity-glyph').style.textShadow = `0 0 15px ${DEITIES[0].color}88`;
        }
    }

    function renderGlyphNav() {
        const container = document.querySelector('.glyph-nav-inner');
        
        Object.entries(GlyphTranslations).forEach(([key, data]) => {
            const span = document.createElement('span');
            span.className = 'nav-glyph';
            span.setAttribute('data-glyph', key);
            span.setAttribute('data-tooltip-glyph', data.glyph);
            span.setAttribute('data-tooltip-name', data.name);
            span.setAttribute('data-tooltip-translation', data.translation);
            span.setAttribute('data-tooltip-deity', data.deity);
            span.setAttribute('data-tooltip-description', data.meaning);
            span.textContent = data.glyph;
            
            span.addEventListener('mouseenter', function(e) {
                this.classList.add('active');
                
                const tooltip = document.getElementById('glyphTooltip');
                const tooltipG = document.getElementById('tooltipGlyph');
                const tooltipN = document.getElementById('tooltipName');
                const tooltipT = document.getElementById('tooltipTranslation');
                const tooltipD = document.getElementById('tooltipDeity');
                const tooltipDesc = document.getElementById('tooltipDescription');
                
                tooltipG.textContent = data.glyph;
                tooltipN.textContent = data.name;
                tooltipT.textContent = data.translation;
                tooltipD.textContent = `Presided by: ${data.deity}`;
                tooltipDesc.textContent = data.meaning;
                
                tooltip.classList.add('visible');
                positionTooltip(e);
            });
            
            span.addEventListener('mousemove', moveTooltip);
            span.addEventListener('mouseleave', function() {
                this.classList.remove('active');
                hideTooltip();
            });
            
            container.appendChild(span);
        });
    }

    function showTooltip(e, sign, number) {
        const tooltip = document.getElementById('glyphTooltip');
        document.getElementById('tooltipGlyph').textContent = sign.glyph;
        document.getElementById('tooltipName').textContent = `${number} ${sign.name}`;
        document.getElementById('tooltipTranslation').textContent = sign.translation;
        document.getElementById('tooltipDeity').textContent = `Presided by: ${sign.deity} (${sign.deityDomain})`;
        document.getElementById('tooltipDescription').textContent = sign.description;
        
        tooltip.classList.add('visible');
        positionTooltip(e);
    }

    function positionTooltip(e) {
        const tooltip = document.getElementById('glyphTooltip');
        const x = e.clientX;
        const y = e.clientY;
        
        tooltip.style.left = `${x + 15}px`;
        tooltip.style.top = `${y - 10}px`;
        
        // Keep tooltip on screen
        const rect = tooltip.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltip.style.left = `${x - rect.width - 15}px`;
        }
        if (rect.bottom > window.innerHeight) {
            tooltip.style.top = `${y - rect.height - 10}px`;
        }
    }

    function moveTooltip(e) {
        positionTooltip(e);
    }

    function hideTooltip() {
        document.getElementById('glyphTooltip').classList.remove('visible');
    }

    // ===================== COUNTDOWN =====================

    function updateEclipseCountdown() {
        const nextEclipse = getNextEclipseDate();
        const now = new Date();
        const diff = nextEclipse - now;
        
        if (diff <= 0) {
            document.getElementById('eclipseCountdown').textContent = '☀️🌑 IT IS HAPPENING';
            return;
        }
        
        const { days, hours, minutes, seconds } = formatCountdown(diff);
        document.getElementById('eclipseCountdown').textContent = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // ===================== WHEEL CONTROLS =====================

    function rotateWheel(direction) {
        if (state.wheelAnimating) return;
        state.wheelAnimating = true;
        
        const segmentAngle = 360 / 20;
        const rotationAmount = segmentAngle * direction;
        state.rotationAngle += rotationAmount;
        
        const wheel = document.getElementById('stoneWheel');
        const dayMarkers = document.querySelectorAll('.wheel-day-marker-marker');
        
        // Animate markers
        dayMarkers.forEach(marker => {
            const currentLeft = parseFloat(marker.style.left);
            const currentTop = parseFloat(marker.style.top);
            const centerX = 210;
            const centerY = 210;
            
            const relX = currentLeft - centerX + 4;
            const relY = centerY - (currentTop - centerY + 4);
            
            const currentAngle = Math.atan2(relY, relX) * 180 / Math.PI;
            const radius = Math.sqrt(relX * relX + relY * relY);
            
            const newAngle = (currentAngle - rotationAmount) * Math.PI / 180;
            const newX = centerX + radius * Math.cos(newAngle) - 4;
            const newY = centerY - radius * Math.sin(newAngle) - 4;
            
            marker.style.left = `${newX}px`;
            marker.style.top = `${newY}px`;
        });
        
        // Update the current day index
        state.currentDayIndex = ((state.currentDayIndex + direction + 260) % 260);
        const signIndex = state.currentDayIndex % 20;
        const number = (state.currentDayIndex % 13) + 1;
        const sign = DAY_SIGNS[signIndex];
        
        document.getElementById('currentDaySign').textContent = sign.name;
        document.getElementById('currentDayNumber').textContent = `${number} ${sign.name}`;
        
        // Update center glyph
        document.querySelector('.center-glyph').textContent = sign.glyph;
        
        // Update active markers
        dayMarkers.forEach((marker, index) => {
            if (index === signIndex) {
                marker.style.background = 'var(--fire)';
                marker.style.boxShadow = '0 0 15px var(--blood-glow)';
            } else {
                marker.style.background = 'rgba(212, 168, 67, 0.4)';
                marker.style.boxShadow = '';
            }
        });
        
        // Update active sacred cell
        const cells = document.querySelectorAll('.sacred-cell');
        cells.forEach((cell, index) => {
            cell.classList.toggle('active', index === signIndex);
            const cellNumber = ((signIndex - (signIndex % 13) + index) % 13) + 1;
            if (index !== signIndex) {
                cell.querySelector('.day-number').textContent = cellNumber;
            }
        });
        
        setTimeout(() => { state.wheelAnimating = false; }, 600);
    }

    function initWheelControls() {
        document.getElementById('rotateLeft').addEventListener('click', () => rotateWheel(-1));
        document.getElementById('rotateRight').addEventListener('click', () => rotateWheel(1));
    }

    // ===================== DEITY CAROUSEL CONTROLS =====================

    function initDeityCarousel() {
        const track = document.getElementById('deityTrack');
        const prevBtn = document.getElementById('deityPrev');
        const nextBtn = document.getElementById('deityNext');
        let scrollPosition = DEITIES.length * 170; // Start in the middle
        
        track.scrollLeft = scrollPosition;
        
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -170, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 170, behavior: 'smooth' });
        });
        
        // Update active card on scroll
        track.addEventListener('scroll', () => {
            const cards = track.querySelectorAll('.deity-card');
            const center = track.scrollLeft + track.clientWidth / 2;
            
            cards.forEach(card => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                if (Math.abs(cardCenter - center) < card.offsetWidth / 2) {
                    cards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    const glyph = card.querySelector('.deity-glyph');
                    glyph.style.color = '';
                    glyph.style.textShadow = '';
                }
            });
        });
    }

    // ===================== AMBIENT EFFECTS =====================

    function initAmbientEffects() {
        // Floating particles
        const surface = document.getElementById('mainSurface');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'ambient-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${8 + Math.random() * 12}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.width = `${2 + Math.random() * 3}px`;
            particle.style.height = particle.style.width;
            particle.style.opacity = `${0.1 + Math.random() * 0.3}`;
            
            const colors = ['var(--jade-glow)', 'var(--gold-glow)', 'var(--blood-glow)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            surface.appendChild(particle);
        }
    }

    // ===================== INITIALIZATION =====================

    function init() {
        initCalendarWheel();
        renderSacredGrid();
        renderSolarCalendar();
        renderTributeGrid();
        renderAstronomicalEvents();
        renderVenusTracker();
        renderDeityCarousel();
        renderGlyphNav();
        initWheelControls();
        initDeityCarousel();
        initAmbientEffects();
        
        // Update eclipse countdown every second
        updateEclipseCountdown();
        setInterval(updateEclipseCountdown, 1000);
        
        // Update Venus tracker periodically
        setInterval(renderVenusTracker, 60000);
        
        // Update current day highlight periodically
        setInterval(() => {
            const info = getCurrentDayInfo();
            const cells = document.querySelectorAll('.sacred-cell');
            cells.forEach((cell, index) => {
                if (index === info.signIndex) {
                    cell.classList.add('active');
                } else {
                    cell.classList.remove('active');
                }
            });
        }, 60000);
    }

    init();
});