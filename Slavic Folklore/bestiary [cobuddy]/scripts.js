// ============================================
// CREATURE DATA — Slavic Bestiary
// ============================================
const creatures = [
    {
        id: 'leshy',
        name: 'Leshy',
        nameCyrillic: 'Леший',
        domain: 'Deep Forest',
        danger: 3,
        brief: 'The wild shepherd of the woods, who leads travelers into endless circles beneath the canopy.',
        illustration: 'leshy',
        description: 'A towering figure draped in moss and bark, with antlers that stretch toward the canopy like the fingers of an old man reaching for heaven. His eyes are hollow — black as deep wells — and his laughter is the sound of wind through dead branches. He stands twice the height of any man and wears the forest like a second skin, with lichen beards and fern cloaks. He is not evil, but he is not kind. He is ancient, and the forest is his parish.',
        behavior: 'The Leshy protects his domain with cunning and guile. He may appear as a lost traveler to lure the unwary deeper into the woods, or manifest as a giant version of the last person to pass through his grove. He leads prey in endless circles until they collapse from exhaustion. Some say he can shrink to the size of a blade of grass and hide among the undergrowth.',
        weakness: 'Breadcrumbs left at a crossroads can anchor the Leshy, forcing him to count each one before he may pass. Iron bells hung from branches ward him away, and the smell of dogs — particularly wolfhounds — drives him into the deepest shadows.',
        symbol: '⛰'
    },
    {
        id: 'rusalka',
        name: 'Rusalka',
        nameCyrillic: 'Русалка',
        domain: 'Dark Waters',
        danger: 4,
        brief: 'The drowned maiden who rises from still water to lure with song and drag the living beneath the surface.',
        illustration: 'rusalka',
        description: 'She rises from the water at twilight, her pale hair floating like sea weed around a face of terrible beauty. Her body glistens with moisture, and her bare feet never touch the ground — she hovers just above the earth or the waterline. Her song is not heard so much as felt, vibrating in the chest like a second heartbeat. Those who follow her voice into the water find the current pulling them down into black depths where her sisters wait.',
        behavior: 'The Rusalka is most dangerous during the week before Trinity Sunday, when she rises to collect her due. She may appear as a beautiful woman bathing at the river edge, or as a child crying on the bank. Her touch is ice cold, and those she embraces find themselves unable to breathe. She is drawn to loneliness — the grief of the bereaved is her doorway.',
        weakness: 'A wreath of flowers cast into the water can appease her, and she must stop to comb her hair if anyone interrupts her. The sound of human laughter drives her back to the depths. A righteous man who crosses himself may break her hold, but only if his faith is true.',
        symbol: '🌊'
    },
    {
        id: 'baba-yaga',
        name: 'Baba Yaga',
        nameCyrillic: 'Баба Яга',
        domain: 'Threshold Between Worlds',
        danger: 5,
        brief: 'The crone of the iron teeth who flies in a mortar and knows the names of all things — living and dead.',
        illustration: 'baba-yaga',
        description: 'She is enormous, leaning forward on her chicken-legged hut, her nose nearly touching the ground. One eye is larger than the other, and her teeth are of iron. Her hands are long and gnarled, and she stirs her enormous mortar with a pestle that could crush a man. Her fence is made of human bones, and she knows every secret that has ever been whispered. She flies through the sky in a mortar, propelling herself with a broom, and leaves a trail of sparks behind her.',
        behavior: 'Baba Yaga is a threshold guardian — she tests those who come to her for knowledge. She may help or devour, and the difference lies entirely in the supplicant\'s wit. She gives impossible tasks: gather water from a lake without wetting the bucket, pick berries from a tree that keeps moving. Fail, and you become stew. Succeed, and she grants your wish — but the price is always steep.',
        weakness: 'A flattering lie told with perfect conviction can confuse her, for she is proud and old. The words "thank you" and "please" wield unexpected power, as does the simple act of refusing to be afraid. She cannot cross a threshold unless invited.',
        symbol: '🦴'
    },
    {
        id: 'zmey',
        name: 'Zmey',
        nameCyrillic: 'Змей',
        domain: 'Storm & Mountain',
        danger: 5,
        brief: 'The great serpent of three heads who hoards gold and demands tribute from all who pass his mountain.',
        illustration: 'zmey',
        description: 'He coils around a mountain of treasure, his body thick as an ancient oak trunk, scales glinting like black mirrors that reflect not the world but your deepest fears. Three heads crowned with horns rest upon his neck, each speaking with a different voice — one of rage, one of cunning, and one of terrible laughter. Fire curls from his nostrils, and his wings blot out the sun when he rises to fly.',
        behavior: 'The Zmey demands tribute: a maiden, gold, or the firstborn of any village in his shadow. He is not mindless — he is strategic, patient, and willing to bargain. He may appear as a handsome young man to seduce princesses, or as a storm that descends upon the land. His treasure is cursed; none who take from it escape his wrath.',
        weakness: 'The prophecies speak of a hero who will come — one born under a specific star. Until then, villages leave tribute at the mountain pass: a girl, grain, or song. A shield made of pig iron can deflect his fire, and the hero Dobrynya slew him only after three days of battle.',
        symbol: '🐉'
    },
    {
        id: 'vodyanoy',
        name: 'Vodyanoy',
        nameCyrillic: 'Водяной',
        domain: 'Rivers & Wells',
        danger: 3,
        brief: 'The old man of the water who pulls fishermen beneath and drowns those who swim beyond the shallows.',
        illustration: 'vodyanoy',
        description: 'He is ancient and bloated, with skin like wet river clay and a beard that drifts like water weed. His eyes are yellow and bulging, and he wears a hat made of river reeds. He sits at the bottom of every well and river, counting the fish — which are his subjects — and keeping watch over the waters. His voice is the sound of bubbles rising from the deep.',
        behavior: 'The Vodyanoy is territorial and possessive. He takes offense when fishermen cast their nets too far or too deep, and he has been known to capsize boats with a single sweep of his massive hand. He drags the overstepping into the current and holds them until they stop struggling.',
        weakness: 'A fish offered with respect — placed in the water with a whispered apology — will satisfy him for a season. The sign of the cross over a well at dawn temporarily wards him, and he cannot follow you if you walk backward out of his territory.',
        symbol: '💧'
    },
    {
        id: 'domovoy',
        name: 'Domovoy',
        nameCyrillic: 'Домовой',
        domain: 'The Hearth & Home',
        danger: 1,
        brief: 'The small house spirit who guards the hearthfire and blesses the home — or curses it if neglected.',
        illustration: 'domovoy',
        description: 'No taller than a cat, with a beard that reaches his belt and eyes like hot coals. He wears the clothes of the house\'s master and sits by the hearth, invisible to all but the most attentive. His feet are backward — his toes point away from the fire — and he can become as large as the house itself when he is angered. In his true form he is an old man with a long grey beard and wild hair.',
        behavior: 'The Domovoy is a guardian, not a monster. He protects the home, ensures the fire burns, the milk does not sour, and the bread does not mold. In return, he demands respect: a place by the fire, a share of the family\'s food, and never mockery. Neglect him, and the house falls into disrepair — crops fail, animals sicken, and misfortune follows like a shadow.',
        weakness: 'He cannot bear the sound of a stolen object being returned to its proper place. A table set for him — even empty — earns his loyalty for a generation. Salt scattered at the threshold wards off intruders, and his power fades if the hearthfire is allowed to die.',
        symbol: '🏠'
    },
    {
        id: 'kikimora',
        name: 'Kikimora',
        nameCyrillic: 'Кикимора',
        domain: 'Cellars & Nurseries',
        danger: 2,
        brief: 'The infant spirit who unsettles the home — crying in empty rooms and waking the sleeping child.',
        illustration: 'kikimora',
        description: 'She is small, no larger than a newborn, with tangled black hair and a face that shifts between ugly and beautiful depending on the light. She lives in the walls and under the floorboards, and she is most active at the hour between midnight and dawn. Her cry sounds like a baby, but those who follow it find only darkness and the smell of damp earth.',
        behavior: 'The Kikimora does not harm — she unsettles. She moves small objects, knocks things from shelves, and makes sounds that have no source. She is thought to be the soul of an unbaptized child, and her presence in a home is a sign that the family has neglected their spiritual duties.',
        weakness: 'A cradle placed in the corner of the room, rocked but empty, will appease her. She cannot cross a threshold marked with ash from the hearth, and the sound of a church bell — even a recording — sends her retreating into the walls.',
        symbol: '👶'
    },
    {
        id: 'nav',
        name: 'Nav',
        nameCyrillic: 'Навь',
        domain: 'The Boundary of Death',
        danger: 4,
        brief: 'The dead who have not found peace, wandering the twilight between this world and the next.',
        illustration: 'nav',
        description: 'They are the improperly buried — those without crosses, without names spoken, without the water of consolation. They appear as translucent figures at the edge of vision, and when seen clearly, they are terrible: faces twisted in silent screams, mouths open in endless hunger. They gather at crossroads, in empty churches, and at the borders of forests where the tree line meets the darkness.',
        behavior: 'The Nav do not attack but they drain. To stand too close is to feel your life force thinning, your limbs growing cold, your thoughts scattering like leaves. They seek the living to warm themselves, to remember what it feels like to be whole. In some accounts, they can enter a home through an open window and settle in the corners like smoke.',
        weakness: 'The prayers of the living can release them — a name spoken aloud, a candle lit in their memory. They cannot enter a home where the threshold has been marked with meal — flour or grain scattered in a line. The dawn drives them back to their places of rest.',
        symbol: '💀'
    }
];

// ============================================
// DANGER SYMBOLS (Slavic-inspired)
// ============================================
const dangerSymbols = ['◇', '◈', '◉', '☠', '⚱'];

// ============================================
// WOODCUT SVG ILLUSTRATIONS
// ============================================
function getIllustrationSVG(id) {
    const illustrations = {
        'leshy': `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f2e8d5"/>
                <g fill="#2c1810" stroke="#2c1810" stroke-width="1.5" stroke-linejoin="round">
                    <!-- Tree trunk / body -->
                    <rect x="170" y="100" width="60" height="130" rx="4"/>
                    <rect x="160" y="80" width="80" height="40" rx="6"/>
                    <!-- Antlers -->
                    <line x1="180" y1="80" x2="140" y2="30" stroke-width="3"/>
                    <line x1="140" y1="30" x2="120" y2="10"/>
                    <line x1="140" y1="30" x2="150" y2="5"/>
                    <line x1="200" y1="80" x2="240" y2="25" stroke-width="3"/>
                    <line x1="240" y1="25" x2="260" y2="5"/>
                    <line x1="240" y1="25" x2="235" y2="0"/>
                    <line x1="190" y1="70" x2="190" y2="40" stroke-width="2"/>
                    <line x1="190" y1="40" x2="175" y2="20"/>
                    <line x1="190" y1="40" x2="205" y2="15"/>
                    <!-- Eyes -->
                    <circle cx="180" cy="120" r="6" fill="#f2e8d5"/>
                    <circle cx="220" cy="120" r="6" fill="#f2e8d5"/>
                    <circle cx="180" cy="120" r="3" fill="#2c1810"/>
                    <circle cx="220" cy="120" r="3" fill="#2c1810"/>
                    <!-- Moss/texture on body -->
                    <path d="M165 130 Q170 120 175 130 Q180 125 185 132 Q190 128 195 130" fill="none" stroke-width="1.5"/>
                    <path d="M210 140 Q215 130 220 140 Q225 135 230 142" fill="none" stroke-width="1.5"/>
                    <!-- Arms/branches -->
                    <line x1="160" y1="140" x2="100" y2="160" stroke-width="4"/>
                    <line x1="100" y1="160" x2="80" y2="180"/>
                    <line x1="100" y1="160" x2="90" y2="145"/>
                    <line x1="240" y1="140" x2="310" y2="155" stroke-width="4"/>
                    <line x1="310" y1="155" x2="330" y2="170"/>
                    <line x1="310" y1="155" x2="320" y2="140"/>
                    <!-- Ground -->
                    <line x1="50" y1="230" x2="350" y2="230" stroke-width="2"/>
                    <path d="M60 230 Q80 220 100 230 Q120 225 140 230 Q160 222 180 230 Q200 225 220 230 Q240 220 260 230 Q280 225 300 230 Q320 222 340 230" fill="none" stroke-width="1.5"/>
                </g>
                <!-- Woodcut crosshatch shading -->
                <g stroke="#2c1810" stroke-width="0.5" opacity="0.15">
                    <line x1="175" y1="110" x2="185" y2="160"/>
                    <line x1="180" y1="110" x2="190" y2="160"/>
                    <line x1="185" y1="110" x2="195" y2="160"/>
                    <line x1="195" y1="115" x2="205" y2="160"/>
                    <line x1="200" y1="115" x2="210" y2="160"/>
                </g>
            </svg>
        `,
        'rusalka': `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f2e8d5"/>
                <!-- Water -->
                <path d="M0 180 Q50 170 100 180 Q150 190 200 180 Q250 170 300 180 Q350 190 400 180 L400 250 L0 250 Z" fill="#d4c5a9" opacity="0.4"/>
                <path d="M0 190 Q40 185 80 190 Q120 195 160 190 Q200 185 240 190 Q280 195 320 190 Q360 185 400 190 L400 250 L0 250 Z" fill="#c4b89a" opacity="0.3"/>
                <!-- Body -->
                <g fill="#2c1810" stroke="#2c1810" stroke-width="1.5">
                    <!-- Hair flowing -->
                    <path d="M140 60 Q130 80 110 100 Q100 120 90 150 Q85 170 80 190 Q75 200 70 210 L85 200 Q90 180 100 160 Q110 130 130 100 Q140 80 145 65 Z"/>
                    <path d="M260 60 Q270 80 290 100 Q300 120 310 150 Q315 170 320 190 Q325 200 330 210 L315 200 Q310 180 300 160 Q290 130 270 100 Q260 80 255 65 Z"/>
                    <!-- Head -->
                    <ellipse cx="200" cy="75" rx="40" ry="50"/>
                    <!-- Eyes -->
                    <ellipse cx="185" cy="70" rx="5" ry="7" fill="#f2e8d5"/>
                    <ellipse cx="215" cy="70" rx="5" ry="7" fill="#f2e8d5"/>
                    <circle cx="185" cy="70" r="2.5" fill="#2c1810"/>
                    <circle cx="215" cy="70" r="2.5" fill="#2c1810"/>
                    <!-- Mouth -->
                    <path d="M190 88 Q200 93 210 88" fill="none" stroke-width="1.5"/>
                    <!-- Body / dress -->
                    <path d="M170 120 Q160 130 155 160 Q150 200 145 230 L255 230 Q250 200 245 160 Q240 130 230 120 Z"/>
                    <!-- Arms reaching -->
                    <path d="M155 140 Q130 150 110 170 Q100 180 95 190"/>
                    <path d="M245 140 Q270 150 290 170 Q300 180 305 190"/>
                    <!-- Veil -->
                    <path d="M160 50 Q200 35 240 50 Q250 60 245 75" fill="none" stroke-width="1" opacity="0.5"/>
                </g>
                <!-- Ripples around -->
                <g stroke="#2c1810" stroke-width="0.8" fill="none" opacity="0.2">
                    <ellipse cx="200" cy="200" rx="80" ry="15"/>
                    <ellipse cx="200" cy="210" rx="100" ry="18"/>
                    <ellipse cx="200" cy="220" rx="120" ry="20"/>
                </g>
            </svg>
        `,
        'baba-yaga': `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f2e8d5"/>
                <!-- Hut on chicken legs -->
                <g fill="#2c1810" stroke="#2c1810" stroke-width="1.5">
                    <!-- Legs -->
                    <line x1="120" y1="220" x2="110" y2="250" stroke-width="4"/>
                    <line x1="150" y1="220" x2="140" y2="250" stroke-width="4"/>
                    <line x1="180" y1="220" x2="170" y2="250" stroke-width="4"/>
                    <line x1="210" y1="220" x2="200" y2="250" stroke-width="4"/>
                    <line x1="240" y1="220" x2="230" y2="250" stroke-width="4"/>
                    <line x1="270" y1="220" x2="260" y2="250" stroke-width="4"/>
                    <!-- Feet -->
                    <ellipse cx="105" cy="248" rx="12" ry="5"/>
                    <ellipse cx="135" cy="248" rx="12" ry="5"/>
                    <ellipse cx="165" cy="248" rx="12" ry="5"/>
                    <ellipse cx="195" cy="248" rx="12" ry="5"/>
                    <ellipse cx="225" cy="248" rx="12" ry="5"/>
                    <ellipse cx="255" cy="248" rx="12" ry="5"/>
                    <!-- Hut body -->
                    <rect x="100" y="130" width="200" height="90" rx="4"/>
                    <!-- Roof -->
                    <path d="M90 130 L200 60 L310 130 Z"/>
                    <!-- Window -->
                    <rect x="170" y="150" width="60" height="40" rx="2"/>
                    <line x1="200" y1="150" x2="200" y2="190" stroke-width="1"/>
                    <line x1="170" y1="170" x2="230" y2="170" stroke-width="1"/>
                    <!-- Door -->
                    <rect x="120" y="170" width="40" height="50" rx="2"/>
                    <!-- Baba Yaga figure -->
                    <ellipse cx="200" cy="95" rx="35" ry="40"/>
                    <!-- Nose -->
                    <path d="M200 85 L205 100 L195 100 Z"/>
                    <!-- Eyes -->
                    <circle cx="188" cy="80" r="4" fill="#f2e8d5"/>
                    <circle cx="212" cy="78" r="5" fill="#f2e8d5"/>
                    <circle cx="188" cy="80" r="2" fill="#2c1810"/>
                    <circle cx="212" cy="78" r="2.5" fill="#2c1810"/>
                    <!-- Teeth -->
                    <line x1="185" y1="98" x2="215" y2="98" stroke-width="2"/>
                    <line x1="190" y1="98" x2="190" y2="102" stroke-width="1"/>
                    <line x1="195" y1="98" x2="195" y2="102" stroke-width="1"/>
                    <line x1="200" y1="98" x2="200" y2="102" stroke-width="1"/>
                    <line x1="205" y1="98" x2="205" y2="102" stroke-width="1"/>
                    <line x1="210" y1="98" x2="210" y2="102" stroke-width="1"/>
                    <!-- Mortar -->
                    <ellipse cx="320" cy="170" rx="25" ry="10"/>
                    <path d="M295 170 Q295 140 320 135 Q345 140 345 170" fill="none" stroke-width="2"/>
                    <!-- Pestle -->
                    <line x1="310" y1="135" x2="290" y2="90" stroke-width="3"/>
                    <!-- Broom -->
                    <line x1="100" y1="170" x2="70" y2="110" stroke-width="2"/>
                    <line x1="95" y1="165" x2="60" y2="100" stroke-width="1.5"/>
                    <line x1="105" y1="168" x2="75" y2="105" stroke-width="1.5"/>
                </g>
            </svg>
        `,
        'zmey': `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f2e8d5"/>
                <g fill="#2c1810" stroke="#2c1810" stroke-width="1.5">
                    <!-- Body coiled -->
                    <path d="M100 180 Q120 150 150 160 Q180 170 170 140 Q160 110 190 120 Q220 130 200 100 Q180 70 210 80 Q240 90 220 60 Q200 30 230 40 Q260 50 240 80 Q220 110 250 100 Q280 90 260 120 Q240 150 270 140 Q300 130 280 160 Q260 190 290 180 Q320 170 310 200 Q300 230 280 220 Q260 210 250 230 L100 230 Q90 200 100 180 Z"/>
                    <!-- Heads -->
                    <ellipse cx="250" cy="70" rx="18" ry="15"/>
                    <ellipse cx="220" cy="55" rx="16" ry="13"/>
                    <ellipse cx="280" cy="85" rx="16" ry="13"/>
                    <!-- Horns -->
                    <path d="M240 55 Q235 40 230 30" stroke-width="2" fill="none"/>
                    <path d="M245 55 Q250 38 255 28" stroke-width="2" fill="none"/>
                    <path d="M210 45 Q205 30 200 22" stroke-width="2" fill="none"/>
                    <path d="M215 45 Q218 28 222 20" stroke-width="2" fill="none"/>
                    <path d="M275 75 Q278 60 282 48" stroke-width="2" fill="none"/>
                    <path d="M278 75 Q282 58 286 45" stroke-width="2" fill="none"/>
                    <!-- Eyes -->
                    <circle cx="245" cy="67" r="3" fill="#f2e8d5"/>
                    <circle cx="245" cy="67" r="1.5" fill="#2c1810"/>
                    <circle cx="215" cy="52" r="2.5" fill="#f2e8d5"/>
                    <circle cx="215" cy="52" r="1.5" fill="#2c1810"/>
                    <circle cx="275" cy="82" r="2.5" fill="#f2e8d5"/>
                    <circle cx="275" cy="82" r="1.5" fill="#2c1810"/>
                    <!-- Wings -->
                    <path d="M150 140 Q100 100 60 120 Q40 130 50 150 Q60 160 80 155 Q100 150 120 160 Q140 165 150 155 Z"/>
                    <path d="M250 120 Q300 80 340 100 Q360 110 350 130 Q340 140 320 135 Q300 130 280 140 Q260 145 250 135 Z"/>
                    <!-- Fire -->
                    <path d="M200 30 Q205 15 200 5 Q198 15 195 25 Q190 10 192 0" fill="none" stroke="#8b1a1a" stroke-width="1.5" opacity="0.6"/>
                    <path d="M210 25 Q212 12 208 3 Q207 12 205 20 Q202 8 203 0" fill="none" stroke="#d4843a" stroke-width="1" opacity="0.4"/>
                </g>
            </svg>
        `,
        'vodyanoy': `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f2e8d5"/>
                <!-- Water -->
                <path d="M0 180 Q30 170 60 180 Q90 190 120 180 Q150 170 180 180 Q210 190 240 180 Q270 170 300 180 Q330 190 360 180 Q390 170 400 180 L400 250 L0 250 Z" fill="#d4c5a9" opacity="0.4"/>
                <g fill="#2c1810" stroke="#2c1810" stroke-width="1.5">
                    <!-- Body -->
                    <ellipse cx="200" cy="150" rx="60" ry="50"/>
                    <!-- Head -->
                    <ellipse cx="200" cy="100" rx="35" ry="30"/>
                    <!-- Eyes -->
                    <ellipse cx="185" cy="95" rx="8" ry="6" fill="#f2e8d5"/>
                    <ellipse cx="215" cy="95" rx="8" ry="6" fill="#f2e8d5"/>
                    <circle cx="185" cy="95" r="4" fill="#2c1810"/>
                    <circle cx="215" cy="95" r="4" fill="#2c1810"/>
                    <!-- Mouth -->
                    <path d="M180 110 Q200 118 220 110" fill="none" stroke-width="1.5"/>
                    <!-- Beard -->
                    <path d="M175 108 Q170 130 165 155 Q160 170 155 180" fill="none" stroke-width="2"/>
                    <path d="M180 110 Q178 135 172 160" fill="none" stroke-width="1.5"/>
                    <path d="M185 112 Q185 138 182 160" fill="none" stroke-width="1.5"/>
                    <path d="M190 113 Q190 140 188 162" fill="none" stroke-width="1.5"/>
                    <path d="M210 112 Q212 138 215 160" fill="none" stroke-width="1.5"/>
                    <path d="M215 110 Q220 135 225 155" fill="none" stroke-width="1.5"/>
                    <path d="M220 108 Q225 130 230 150" fill="none" stroke-width="1.5"/>
                    <!-- Hat -->
                    <ellipse cx="200" cy="75" rx="30" ry="8"/>
                    <path d="M170 75 Q170 50 200 45 Q230 50 230 75 Z"/>
                    <!-- Arms -->
                    <path d="M140 140 Q110 130 90 140 Q80 145 75 155"/>
                    <path d="M260 140 Q290 130 310 140 Q320 145 325 155"/>
                    <!-- Webbed hands -->
                    <path d="M75 155 Q70 160 72 165 Q78 162 80 158"/>
                    <path d="M80 158 Q85 163 88 160"/>
                    <path d="M325 155 Q330 160 328 165 Q322 162 320 158"/>
                    <path d="M320 158 Q315 163 312 160"/>
                </g>
                <!-- Bubbles -->
                <g stroke="#2c1810" stroke-width="0.5" fill="none" opacity="0.3">
                    <circle cx="150" cy="170" r="4"/>
                    <circle cx="160" cy="175" r="3"/>
                    <circle cx="250" cy="168" r="5"/>
                    <circle cx="260" cy="173" r="3"/>
                    <circle cx="200" cy="178" r="3"/>
                </g>
            </svg>
        `,
        'domovoy': `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f2e8d5"/>
                <!-- Hearthfire glow -->
                <circle cx="200" cy="160" r="50" fill="#d4843a" opacity="0.1"/>
                <circle cx="200" cy="160" r="30" fill="#e8a840" opacity="0.15"/>
                <g fill="#2c1810" stroke="#2c1810" stroke-width="1.5">
                    <!-- Body -->
                    <ellipse cx="200" cy="160" rx="25" ry="35"/>
                    <!-- Head -->
                    <circle cx="200" cy="115" r="20"/>
                    <!-- Eyes -->
                    <circle cx="193" cy="113" r="3" fill="#e8a840"/>
                    <circle cx="207" cy="113" r="3" fill="#e8a840"/>
                    <circle cx="193" cy="113" r="1.5" fill="#2c1810"/>
                    <circle cx="207" cy="113" r="1.5" fill="#2c1810"/>
                    <!-- Beard -->
                    <path d="M190 120 Q185 135 183 150" fill="none" stroke-width="1.5"/>
                    <path d="M195 122 Q192 138 190 152" fill="none" stroke-width="1.5"/>
                    <path d="M200 123 Q200 140 200 155" fill="none" stroke-width="1.5"/>
                    <path d="M205 122 Q208 138 210 152" fill="none" stroke-width="1.5"/>
                    <path d="M210 120 Q215 135 217 150" fill="none" stroke-width="1.5"/>
                    <!-- Hat -->
                    <ellipse cx="200" cy="97" rx="18" ry="5"/>
                    <path d="M182 97 Q182 80 200 76 Q218 80 218 97 Z"/>
                    <!-- Backwards feet -->
                    <ellipse cx="190" cy="195" rx="10" ry="5"/>
                    <ellipse cx="210" cy="195" rx="10" ry="5"/>
                    <!-- Arms -->
                    <path d="M175 150 Q155 145 140 150"/>
                    <path d="M225 150 Q245 145 260 150"/>
                    <!-- Tail -->
                    <path d="M200 195 Q210 210 205 220 Q200 225 195 220" fill="none" stroke-width="1.5"/>
                </g>
                <!-- Fire -->
                <g stroke="#d4843a" stroke-width="1.5" fill="none" opacity="0.6">
                    <path d="M190 130 Q192 115 188 105 Q185 115 186 125"/>
                    <path d="M200 128 Q202 110 198 100 Q195 110 196 120"/>
                    <path d="M210 130 Q208 115 212 105 Q215 115 214 125"/>
                </g>
            </svg>
        `,
        'kikimora': `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f2e8d5"/>
                <g fill="#2c1810" stroke="#2c1810" stroke-width="1.5">
                    <!-- Small body -->
                    <ellipse cx="200" cy="170" rx="20" ry="30"/>
                    <!-- Head -->
                    <circle cx="200" cy="130" r="22"/>
                    <!-- Messy hair -->
                    <path d="M178 120 Q170 100 165 85 Q168 95 175 105"/>
                    <path d="M182 118 Q175 90 172 75 Q176 88 180 100"/>
                    <path d="M222 120 Q230 100 235 85 Q232 95 225 105"/>
                    <path d="M218 118 Q225 90 228 75 Q224 88 220 100"/>
                    <!-- Eyes -->
                    <circle cx="190" cy="128" r="4" fill="#f2e8d5"/>
                    <circle cx="210" cy="128" r="4" fill="#f2e8d5"/>
                    <circle cx="190" cy="128" r="2" fill="#2c1810"/>
                    <circle cx="210" cy="128" r="2" fill="#2c1810"/>
                    <!-- Mouth -->
                    <ellipse cx="200" cy="140" rx="6" ry="4"/>
                    <!-- Tiny arms -->
                    <path d="M180 160 Q160 155 150 160"/>
                    <path d="M220 160 Q240 155 250 160"/>
                    <!-- Tiny legs -->
                    <line x1="190" y1="200" x2="185" y2="220" stroke-width="3"/>
                    <line x1="210" y1="200" x2="215" y2="220" stroke-width="3"/>
                </g>
                <!-- Shadow figure -->
                <g opacity="0.15">
                    <ellipse cx="200" cy="220" rx="40" ry="10"/>
                </g>
            </svg>
        `,
        'nav': `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f2e8d5"/>
                <!-- Mist -->
                <g opacity="0.15">
                    <ellipse cx="100" cy="180" rx="60" ry="15"/>
                    <ellipse cx="300" cy="190" rx="50" ry="12"/>
                    <ellipse cx="200" cy="200" rx="80" ry="18"/>
                </g>
                <g fill="#2c1810" stroke="#2c1810" stroke-width="1.5" opacity="0.7">
                    <!-- First figure -->
                    <ellipse cx="140" cy="150" rx="15" ry="25"/>
                    <circle cx="140" cy="118" r="14"/>
                    <path d="M130 110 Q128 100 132 95" fill="none" stroke-width="1"/>
                    <path d="M140 108 Q140 98 142 93" fill="none" stroke-width="1"/>
                    <path d="M150 110 Q152 100 148 95" fill="none" stroke-width="1"/>
                    <!-- Second figure -->
                    <ellipse cx="220" cy="145" rx="12" ry="22"/>
                    <circle cx="220" cy="117" r="12"/>
                    <path d="M210 108 Q208 98 212 94" fill="none" stroke-width="1"/>
                    <path d="M220 106 Q220 96 222 92" fill="none" stroke-width="1"/>
                    <path d="M230 108 Q232 98 228 94" fill="none" stroke-width="1"/>
                    <!-- Third figure (fainter) -->
                    <ellipse cx="290" cy="155" rx="10" ry="18" opacity="0.5"/>
                    <circle cx="290" cy="131" r="10" opacity="0.5"/>
                </g>
                <!-- Expression lines -->
                <g stroke="#2c1810" stroke-width="1" fill="none" opacity="0.5">
                    <path d="M180 120 Q190 115 200 120"/>
                    <path d="M230 145 Q240 140 250 145"/>
                </g>
            </svg>
        `
    };
    return illustrations[id] || illustrations['leshy'];
}

// ============================================
// BUILD CREATURE GRID
// ============================================
function buildCreatureGrid() {
    const grid = document.getElementById('creatureGrid');
    grid.innerHTML = '';

    creatures.forEach((creature, index) => {
        const card = document.createElement('div');
        card.className = 'creature-card birch-bark';
        card.setAttribute('data-creature-id', creature.id);
        card.style.animationDelay = `${index * 0.1}s`;

        const dangerHTML = dangerSymbols.map((symbol, i) => {
            return `<span class="danger-symbol ${i < creature.danger ? 'active-' + creature.danger : ''}" style="color: ${i < creature.danger ? 'var(--danger-' + (i + 1) + ')' : 'var(--ink-faded)'}; opacity: ${i < creature.danger ? '1' : '0.2'}">${symbol}</span>`;
        }).join('');

        card.innerHTML = `
            <div class="creature-card-inner">
                <div class="creature-illustration">
                    ${getIllustrationSVG(creature.illustration)}
                </div>
                <h3 class="creature-name">${creature.name}</h3>
                <span class="creature-name-cyrillic">${creature.nameCyrillic}</span>
                <p class="creature-brief">${creature.brief}</p>
                <div class="danger-rating">
                    <span class="danger-label">Danger</span>
                    <div class="danger-symbols">${dangerHTML}</div>
                </div>
                <span class="creature-domain">${creature.domain}</span>
            </div>
        `;

        card.addEventListener('click', () => openEntry(creature.id));
        grid.appendChild(card);
    });
}

// ============================================
// OPEN ENTRY OVERLAY
// ============================================
function openEntry(creatureId) {
    const creature = creatures.find(c => c.id === creatureId);
    if (!creature) return;

    const overlay = document.getElementById('entryOverlay');
    const content = document.getElementById('entryContent');
    const entryPage = document.getElementById('entryPage');

    const dangerHTML = dangerSymbols.map((symbol, i) => {
        return `<span class="entry-danger-symbol ${i < creature.danger ? 'active-' + creature.danger : ''}" style="color: ${i < creature.danger ? 'var(--danger-' + (i + 1) + ')' : 'var(--ink-faded)'}; opacity: ${i < creature.danger ? '1' : '0.2'}">${symbol}</span>`;
    }).join('');

    const dangerDesc = [
        'Harmless to the watchful',
        'Caution advised in twilight',
        'A known threat to the careless',
        'Deadly to the unwary',
        'Apocalypse in bark and bone'
    ];

    content.innerHTML = `
        <div class="entry-illustration">
            ${getIllustrationSVG(creature.illustration)}
        </div>

        <div class="entry-header">
            <h2 class="entry-name">${creature.name}</h2>
            <span class="entry-name-cyrillic">${creature.nameCyrillic}</span>
            <span class="entry-domain-tag">${creature.domain}</span>
        </div>

        <div class="entry-danger">
            <span class="entry-danger-label">Peril</span>
            <div class="entry-danger-symbols">${dangerHTML}</div>
            <span class="entry-danger-desc">${dangerDesc[creature.danger - 1]}</span>
        </div>

        <div class="entry-section">
            <h3 class="entry-section-title">Description</h3>
            <div class="entry-text">
                <p>${creature.description}</p>
            </div>
        </div>

        <div class="woodcut-border"></div>

        <div class="entry-section">
            <h3 class="entry-section-title">Behavior</h3>
            <div class="entry-text">
                <p>${creature.behavior}</p>
            </div>
        </div>

        <div class="woodcut-border"></div>

        <div class="entry-section">
            <h3 class="entry-section-title">Weakness & Warding</h3>
            <div class="entry-text">
                <p>${creature.weakness}</p>
            </div>
        </div>

        <div class="feather-divider">❧ ❧ ❧</div>

        <div class="entry-section" style="text-align: center; margin-top: 20px;">
            <span class="entry-domain-tag" style="font-size: 1.2rem; padding: 8px 20px;">${creature.symbol}</span>
        </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// CLOSE ENTRY OVERLAY
// ============================================
function closeEntry() {
    const overlay = document.getElementById('entryOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Build the creature grid
    buildCreatureGrid();

    // Open compendium button
    document.getElementById('openCompendium').addEventListener('click', () => {
        document.getElementById('index').scrollIntoView({ behavior: 'smooth' });
    });

    // Close entry
    document.getElementById('closeEntry').addEventListener('click', closeEntry);

    // Close on overlay click
    document.getElementById('entryOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeEntry();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEntry();
        }
    });

    // Scroll indicator fade
    const scrollIndicator = document.getElementById('scrollIndicator');
    let scrolled = false;
    window.addEventListener('scroll', () => {
        if (!scrolled && window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transition = 'opacity 0.8s ease';
            scrolled = true;
        }
    }, { passive: true });

    // Parallax on forest overlay
    window.addEventListener('scroll', () => {
        const overlay = document.querySelector('.forest-overlay');
        const scrolled = window.scrollY;
        overlay.style.transform = `translateY(${scrolled * 0.1}px)`;
    }, { passive: true });
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all creature cards after they're built
setTimeout(() => {
    document.querySelectorAll('.creature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}, 100);