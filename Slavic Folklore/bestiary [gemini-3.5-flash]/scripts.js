/**
 * ==========================================================================
 * CHRONICLES OF THE WILD LANDS: Slavic Bestiary
 * Interactive Tome Mechanism & Lore Compendium
 * ==========================================================================
 */

// --- Creature Database ---
const bestiaryData = {
    leshy: {
        name: "Leshy",
        nativeName: "Леший • Lord of the Green Wilds",
        threatClass: "High",
        threatSigil: "ᚦ",
        category: "forest",
        svgArt: `
            <svg viewBox="0 0 300 300" class="woodcut-svg">
                <defs>
                    <filter id="woodcut-filter-leshy">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill="#EBDCB9"/>
                <g filter="url(#woodcut-filter-leshy)" class="woodcut-lines">
                    <!-- Tree backdrop -->
                    <path d="M10 280 L50 180 L90 280 Z" fill="none" stroke="#231E1B" stroke-width="3" />
                    <path d="M60 280 L110 140 L160 280 Z" fill="none" stroke="#231E1B" stroke-width="4" />
                    <path d="M130 280 L180 160 L230 280 Z" fill="none" stroke="#231E1B" stroke-width="3.5" />
                    <path d="M200 280 L250 190 L290 280 Z" fill="none" stroke="#231E1B" stroke-width="3" />
                    
                    <circle cx="150" cy="110" r="45" fill="none" stroke="#231E1B" stroke-width="2" stroke-dasharray="8,4" />
                    
                    <!-- Antlered Forest Guardian Entity -->
                    <path d="M125 100 Q100 60 70 80 Q90 100 120 105" fill="none" stroke="#231E1B" stroke-width="4" />
                    <path d="M95 73 Q80 40 60 55" fill="none" stroke="#231E1B" stroke-width="3" />
                    <path d="M175 100 Q200 60 230 80 Q210 100 180 105" fill="none" stroke="#231E1B" stroke-width="4" />
                    <path d="M205 73 Q220 40 240 55" fill="none" stroke="#231E1B" stroke-width="3" />
                    
                    <polygon points="120,105 180,105 165,190 135,190" fill="#EBDCB9" stroke="#231E1B" stroke-width="4" />
                    <path d="M130 130 L140 135 M170 130 L160 135" stroke="#231E1B" stroke-width="3" />
                    <path d="M138 165 Q150 175 162 165" fill="none" stroke="#231E1B" stroke-width="3" />
                    <path d="M140 105 L140 190 M160 105 L160 190" stroke="#231E1B" stroke-width="1.5" stroke-dasharray="4,4" />
                    
                    <path d="M100 190 Q60 220 70 280" fill="none" stroke="#231E1B" stroke-width="4" />
                    <path d="M200 190 Q240 220 230 280" fill="none" stroke="#231E1B" stroke-width="4" />
                    <path d="M120 190 L110 280 M180 190 L190 280" stroke="#231E1B" stroke-width="3.5" />
                    
                    <line x1="20" y1="260" x2="60" y2="260" stroke="#231E1B" stroke-width="1.5" />
                    <line x1="15" y1="270" x2="80" y2="270" stroke="#231E1B" stroke-width="1.5" />
                    <line x1="240" y1="260" x2="280" y2="260" stroke="#231E1B" stroke-width="1.5" />
                    <line x1="220" y1="270" x2="285" y2="270" stroke="#231E1B" stroke-width="1.5" />
                </g>
            </svg>
        `,
        lore: `
            <p class="first-letter">T</p>
            <p class="lore-text">The Leshy is the sovereign master of the deep forests. Capable of altering his stature to match either a blade of grass or the tallest pine, he rules over all beasts and woodland pathways. Travellers who do not show proper respect to his dominion are doomed to wander in endless circles, led astray by mimicking voices.</p>
            <p class="lore-text">He is neither wholly evil nor benign; he protects his woods fiercely from greedy loggers and hunters who slay more than they need to survive.</p>
        `,
        traits: `
            <ul class="runic-list">
                <li><span class="bullet-rune">ᚹ</span><strong>The Salt Circle:</strong> Spreading dry salt around a campsite keeps the forest guardian from stepping over your boundary.</li>
                <li><span class="bullet-rune">ᚱ</span><strong>Inverted Garments:</strong> If hopelessly lost in his woods, strip off all clothing and put them on backwards and inside-out. This breaks his illusions.</li>
                <li><span class="bullet-rune">ᚺ</span><strong>Fire & Iron:</strong> He fears the scent of forged steel and sparks of pure, clean fire.</li>
            </ul>
        `,
        encounter: `
            <blockquote class="journal-entry">
                "We heard grandfather's voice calling from the cedar grove. Yet grandfather had died three winters past. When Pyotr stepped into the mist to seek him, the tree canopy seemed to stretch and shift. He did not return."
                <cite>— Journal of a Taiga Hunter, 1842</cite>
            </blockquote>
        `
    },
    rusalka: {
        name: "Rusalka",
        nativeName: "Русалка • The Drowned Maiden",
        threatClass: "Medium",
        threatSigil: "ᚢ",
        category: "water",
        svgArt: `
            <svg viewBox="0 0 300 300" class="woodcut-svg">
                <defs>
                    <filter id="woodcut-filter-rusalka">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill="#EBDCB9"/>
                <g filter="url(#woodcut-filter-rusalka)" class="woodcut-lines">
                    <!-- Swirling dark lake waves -->
                    <path d="M 0 200 Q 75 180 150 200 T 300 200" fill="none" stroke="#231E1B" stroke-width="3" />
                    <path d="M 0 230 Q 75 210 150 230 T 300 230" fill="none" stroke="#231E1B" stroke-width="4" />
                    <path d="M 0 260 Q 75 240 150 260 T 300 260" fill="none" stroke="#231E1B" stroke-width="5" />
                    
                    <!-- Weeping Willow branches hanging down -->
                    <path d="M 30 0 Q 40 80 20 150" fill="none" stroke="#231E1B" stroke-width="2" />
                    <path d="M 70 0 Q 90 100 80 170" fill="none" stroke="#231E1B" stroke-width="1.5" />
                    <path d="M 230 0 Q 210 90 240 160" fill="none" stroke="#231E1B" stroke-width="2" />
                    
                    <!-- Rusalka entity: Spectral maiden emerging from water -->
                    <path d="M 110 200 Q 110 130 150 110 Q 190 130 190 200" fill="#EBDCB9" stroke="#231E1B" stroke-width="3.5" />
                    
                    <!-- Long flowing hair -->
                    <path d="M 150 80 Q 110 100 120 180" fill="none" stroke="#231E1B" stroke-width="3" />
                    <path d="M 150 80 Q 190 100 180 180" fill="none" stroke="#231E1B" stroke-width="3" />
                    <path d="M 150 80 Q 130 120 140 195" fill="none" stroke="#231E1B" stroke-width="2" />
                    <path d="M 150 80 Q 170 120 160 195" fill="none" stroke="#231E1B" stroke-width="2" />
                    
                    <!-- Head & Crown of reeds -->
                    <circle cx="150" cy="85" r="15" fill="#EBDCB9" stroke="#231E1B" stroke-width="3" />
                    <path d="M 138 73 L 142 80 L 150 70 L 158 80 L 162 73" fill="none" stroke="#231E1B" stroke-width="2" />
                    
                    <!-- Haunting Face Details -->
                    <circle cx="145" cy="85" r="1.5" fill="#231E1B" />
                    <circle cx="155" cy="85" r="1.5" fill="#231E1B" />
                    <path d="M 146 93 Q 150 90 154 93" fill="none" stroke="#231E1B" stroke-width="2" />
                </g>
            </svg>
        `,
        lore: `
            <p class="first-letter">U</p>
            <p class="lore-text">Rusalkas are the spirits of young women who drowned under tragic circumstances, bound to the dark waters of lakes and marshes. On warm summer nights, they emerge onto the shores to comb their wet hair, singing melodies of devastating beauty to entrap passing youths.</p>
            <p class="lore-text">Any traveler lured into their embrace is dragged into the depths, or tickled to death in a fit of hysterical, fatal laughter.</p>
        `,
        traits: `
            <ul class="runic-list">
                <li><span class="bullet-rune">ᛚ</span><strong>Wormwood:</strong> Carrying wormwood (Polyn) acts as a powerful deterrent. Throwing it in their path forces them to flee.</li>
                <li><span class="bullet-rune">ᚦ</span><strong>Iron Comb:</strong> Stealing or binding her wet hair with a forged iron comb neutralizes her magic instantly.</li>
                <li><span class="bullet-rune">ᛟ</span><strong>The Cross:</strong> Holy artifacts can sever her connection to the physical plane, releasing her soul to rest.</li>
            </ul>
        `,
        encounter: `
            <blockquote class="journal-entry">
                "The river-song was like honey. I saw Clara sitting on a weeping root, her skin pale as birch bark. Her eyes were wide, black, and completely empty of life. I only survived because I held a leaf of wormwood tight in my fist."
                <cite>— Fisher's Log, Dnieper Basin</cite>
            </blockquote>
        `
    },
    "baba-yaga": {
        name: "Baba Yaga",
        nativeName: "Баба Яга • The Wild Witch of the Woods",
        threatClass: "High",
        threatSigil: "ᚦ",
        category: "shadow",
        svgArt: `
            <svg viewBox="0 0 300 300" class="woodcut-svg">
                <defs>
                    <filter id="woodcut-filter-yaga">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill="#EBDCB9"/>
                <g filter="url(#woodcut-filter-yaga)" class="woodcut-lines">
                    <!-- Dense forest roots background -->
                    <path d="M 10 290 Q 50 200 100 290" stroke="#231E1B" stroke-width="3" fill="none" />
                    <path d="M 200 290 Q 250 180 290 290" stroke="#231E1B" stroke-width="3" fill="none" />
                    
                    <!-- The Mortar in flight -->
                    <ellipse cx="150" cy="200" rx="35" ry="15" fill="#EBDCB9" stroke="#231E1B" stroke-width="4" />
                    <path d="M 115 200 L 130 270 L 170 270 L 185 200" fill="none" stroke="#231E1B" stroke-width="4" />
                    <path d="M 115 200 Q 150 215 185 200" fill="none" stroke="#231E1B" stroke-width="2" />
                    
                    <!-- Baba Yaga's hunchback silhouette -->
                    <path d="M 125 140 Q 150 110 165 200" fill="none" stroke="#231E1B" stroke-width="4.5" />
                    
                    <!-- Pointy long nose & chin -->
                    <path d="M 135 125 Q 110 120 130 135" fill="none" stroke="#231E1B" stroke-width="3.5" />
                    
                    <!-- Wild tangled hair -->
                    <path d="M 140 115 Q 175 90 170 145" fill="none" stroke="#231E1B" stroke-width="3" />
                    <path d="M 140 115 Q 185 110 160 155" fill="none" stroke="#231E1B" stroke-width="2" />
                    
                    <!-- The Pestle steering tool -->
                    <line x1="175" y1="130" x2="210" y2="240" stroke="#231E1B" stroke-width="5" />
                    
                    <!-- Flying broom/sweep trailing behind -->
                    <path d="M 115 180 Q 70 160 40 140" fill="none" stroke="#231E1B" stroke-width="2.5" />
                    <line x1="40" y1="140" x2="50" y2="155" stroke="#231E1B" stroke-width="1.5" />
                    <line x1="35" y1="135" x2="45" y2="150" stroke="#231E1B" stroke-width="1.5" />
                </g>
            </svg>
        `,
        lore: `
            <p class="first-letter">B</p>
            <p class="lore-text">Baba Yaga is an ancient, enigmatic witch of boundless, terrifying power. She lives in a legendary hut that stands on giant chicken legs, deep within the dark birch woods, surrounded by a fence made of human bones topped with glowing skulls.</p>
            <p class="lore-text">She travels through the air not on a broom, but in a giant stone mortar, steering with a pestle and sweeping away her tracks with a silver birch broom.</p>
        `,
        traits: `
            <ul class="runic-list">
                <li><span class="bullet-rune">ᚦ</span><strong>True Names:</strong> Addressing her with absolute, fearless politeness as "Grandmother" may appease her temporarily.</li>
                <li><span class="bullet-rune">ᚱ</span><strong>The Skull Torch:</strong> Fire from one of her fence-skulls can burn through any physical binding or hex.</li>
                <li><span class="bullet-rune">ᛞ</span><strong>The Iron Key:</strong> Her magic is tied to the hearth of her chicken-legged cabin; damaging the stove breaks her control.</li>
            </ul>
        `,
        encounter: `
            <blockquote class="journal-entry">
                "The house spun on yellow-scaled legs, creaking like old timber. In the window sat the Hag, her long nose touching the ceiling. 'I smell Russian bone!' she rasped, and the fire in the bone fence flared bright."
                <cite>— Legend of Vassilisa the Brave</cite>
            </blockquote>
        `
    },
    zmey: {
        name: "Zmey Gorynych",
        nativeName: "Змей Горыныч • The Three-Headed Terror",
        threatClass: "Critical",
        threatSigil: "ᚱ",
        category: "shadow",
        svgArt: `
            <svg viewBox="0 0 300 300" class="woodcut-svg">
                <defs>
                    <filter id="woodcut-filter-zmey">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill="#EBDCB9"/>
                <g filter="url(#woodcut-filter-zmey)" class="woodcut-lines">
                    <!-- Mountain/Cave backdrop -->
                    <polygon points="10,280 150,120 290,280" fill="none" stroke="#231E1B" stroke-width="3" />
                    
                    <!-- Three serpentine necks branching out -->
                    <!-- Left Neck -->
                    <path d="M120 240 Q70 180 90 130" fill="none" stroke="#231E1B" stroke-width="6" />
                    <!-- Center Neck -->
                    <path d="M150 240 Q150 160 150 110" fill="none" stroke="#231E1B" stroke-width="6" />
                    <!-- Right Neck -->
                    <path d="M180 240 Q230 180 210 130" fill="none" stroke="#231E1B" stroke-width="6" />
                    
                    <!-- Dragon Heads -->
                    <!-- Left Head -->
                    <circle cx="90" cy="120" r="12" fill="#EBDCB9" stroke="#231E1B" stroke-width="4" />
                    <path d="M 90 115 L 75 110 M 90 125 L 75 128" stroke="#231E1B" stroke-width="3" />
                    <!-- Center Head -->
                    <circle cx="150" cy="100" r="14" fill="#EBDCB9" stroke="#231E1B" stroke-width="4" />
                    <path d="M 150 94 L 150 80 M 145 106 Q 150 115 155 106" stroke="#231E1B" stroke-width="3" />
                    <!-- Right Head -->
                    <circle cx="210" cy="120" r="12" fill="#EBDCB9" stroke="#231E1B" stroke-width="4" />
                    <path d="M 210 115 L 225 110 M 210 125 L 225 128" stroke="#231E1B" stroke-width="3" />
                    
                    <!-- Flames breathing out -->
                    <path d="M 75 110 Q 30 100 20 120" stroke="#231E1B" stroke-width="2" fill="none" />
                    <path d="M 225 110 Q 270 100 280 120" stroke="#231E1B" stroke-width="2" fill="none" />
                    
                    <!-- Scaled body base -->
                    <path d="M 90 280 Q 150 210 210 280" fill="none" stroke="#231E1B" stroke-width="8" />
                    <path d="M 110 260 L 120 270 M 130 250 L 140 260 M 170 250 L 160 260" stroke="#231E1B" stroke-width="2" />
                </g>
            </svg>
        `,
        lore: `
            <p class="first-letter">Z</p>
            <p class="lore-text">The Zmey Gorynych is a colossal, multi-headed dragon of catastrophic might, representing the raw, destructive forces of nature. His wings are made of shadow and flame, and when he breathes, entire towns are turned to ash. He hoards golden treasures in deep caverns and demands tributes of cattle and maidens.</p>
            <p class="lore-text">Slaying him requires severing all three heads in quick succession, for they possess a sinister ability to regenerate if even one is left intact.</p>
        `,
        traits: `
            <ul class="runic-list">
                <li><span class="bullet-rune">ᚱ</span><strong>Severing Strike:</strong> Steel blades must be blessed by a Bogatyr (epic warrior) to successfully cauterize the stump of his severed heads.</li>
                <li><span class="bullet-rune">ᛗ</span><strong>Water-Vulnerability:</strong> Directing a running river or heavy rain onto his blazing core dampens his fire breath for several hours.</li>
                <li><span class="bullet-rune">ᚠ</span><strong>Golden Slumber:</strong> He falls into a heavy, deep sleep if fed an entire bull stuffed with soporific meadow herbs.</li>
            </ul>
        `,
        encounter: `
            <blockquote class="journal-entry">
                "The sky turned black as pitch, smelling of brimstone. Three roars shook the earth, splitting the castle walls. Our arrows bounced from his scales like rain from a slate roof."
                <cite>— Chronicles of Ryazan, 1237</cite>
            </blockquote>
        `
    },
    domovoy: {
        name: "Domovoy",
        nativeName: "Домовой • Hearth and Home Spirit",
        threatClass: "Safe",
        threatSigil: "ᚷ",
        category: "house",
        svgArt: `
            <svg viewBox="0 0 300 300" class="woodcut-svg">
                <defs>
                    <filter id="woodcut-filter-domovoy">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill="#EBDCB9"/>
                <g filter="url(#woodcut-filter-domovoy)" class="woodcut-lines">
                    <!-- Rustic Stove / Hearth backdrop -->
                    <rect x="50" y="100" width="200" height="180" fill="none" stroke="#231E1B" stroke-width="4" />
                    <path d="M 50 140 L 250 140 M 100 100 L 100 280" stroke="#231E1B" stroke-width="2" />
                    
                    <!-- Glowing hearth arch inside stove -->
                    <path d="M 120 280 A 30 30 0 0 1 180 280" fill="none" stroke="#231E1B" stroke-width="3" />
                    
                    <!-- Domovoy: Small hairy creature silhouette -->
                    <circle cx="150" cy="190" r="22" fill="#EBDCB9" stroke="#231E1B" stroke-width="3" />
                    <path d="M 120 240 Q 150 200 180 240" fill="none" stroke="#231E1B" stroke-width="4" />
                    
                    <!-- Long bushy beard details -->
                    <path d="M 135 195 Q 150 250 165 195" fill="none" stroke="#231E1B" stroke-width="3" />
                    <path d="M 140 200 Q 150 240 160 200" fill="none" stroke="#231E1B" stroke-width="2" />
                    <path d="M 145 190 L 142 192 M 155 190 L 158 192" stroke="#231E1B" stroke-width="3" />
                    
                    <!-- Small glowing eyes -->
                    <circle cx="144" cy="184" r="2" fill="#231E1B" />
                    <circle cx="156" cy="184" r="2" fill="#231E1B" />
                    
                    <!-- Little hands resting -->
                    <path d="M 128 220 Q 140 225 142 215" stroke="#231E1B" stroke-width="2.5" fill="none" />
                    <path d="M 172 220 Q 160 225 158 215" stroke="#231E1B" stroke-width="2.5" fill="none" />
                </g>
            </svg>
        `,
        lore: `
            <p class="first-letter">D</p>
            <p class="lore-text">The Domovoy is the tiny, bearded guardian spirit of the Slavic household, residing under the stove, thresholds, or in the stables. He is deeply connected to the prosperity and health of the family, performing chores at night and protecting the livestock.</p>
            <p class="lore-text">However, if the family is lazy, messy, or speaks with disrespect, he turns mischievous, spoiling milk, knocking over pots, and tangling horse manes.</p>
        `,
        traits: `
            <ul class="runic-list">
                <li><span class="bullet-rune">ᚷ</span><strong>Bread & Salt:</strong> Leaving a slice of salted bread near the stove every Sunday keeps him incredibly content.</li>
                <li><span class="bullet-rune">ᛞ</span><strong>The House Warming:</strong> When moving to a new home, you must formally invite your Domovoy to travel with you in an old boot.</li>
                <li><span class="bullet-rune">ᚹ</span><strong>Polite Apologies:</strong> If he begins throwing items, speaking an apology out loud immediately calms his spirit.</li>
            </ul>
        `,
        encounter: `
            <blockquote class="journal-entry">
                "Last night, I woke to a soft purring near the stove. I saw a tiny old man, no taller than a boot, grooming our grey horse with a wooden comb. He vanished when the candle flickered."
                <cite>— Babushka's Tales, Kiev Governorate</cite>
            </blockquote>
        `
    },
    likho: {
        name: "Likho",
        nativeName: "Лихо • The One-Eyed Misfortune",
        threatClass: "High",
        threatSigil: "ᚦ",
        category: "forest",
        svgArt: `
            <svg viewBox="0 0 300 300" class="woodcut-svg">
                <defs>
                    <filter id="woodcut-filter-likho">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill="#EBDCB9"/>
                <g filter="url(#woodcut-filter-likho)" class="woodcut-lines">
                    <!-- Gnarled dead forest branches -->
                    <path d="M 30 280 L 30 150 L 10 100 M 30 170 L 60 130" stroke="#231E1B" stroke-width="4" fill="none" />
                    <path d="M 270 280 L 270 140 L 290 80 M 270 180 L 240 140" stroke="#231E1B" stroke-width="4" fill="none" />
                    
                    <!-- Gaunt, skeletal figure outline -->
                    <path d="M 120 280 L 130 180 L 150 140 L 170 180 L 180 280" stroke="#231E1B" stroke-width="5" fill="none" />
                    
                    <!-- Head & Single central eye -->
                    <circle cx="150" cy="115" r="18" fill="#EBDCB9" stroke="#231E1B" stroke-width="4.5" />
                    
                    <!-- The single massive eye -->
                    <path d="M 140 115 Q 150 105 160 115 Q 150 125 140 115" fill="none" stroke="#231E1B" stroke-width="3" />
                    <circle cx="150" cy="115" r="4.5" fill="#231E1B" />
                    
                    <!-- Bony, elongated arms -->
                    <path d="M 132 145 L 90 200 L 80 250" stroke="#231E1B" stroke-width="3.5" fill="none" />
                    <path d="M 168 145 L 210 200 L 220 250" stroke="#231E1B" stroke-width="3.5" fill="none" />
                    
                    <!-- Shading hatches on body -->
                    <line x1="135" y1="200" x2="145" y2="200" stroke="#231E1B" stroke-width="2" />
                    <line x1="133" y1="220" x2="147" y2="220" stroke="#231E1B" stroke-width="2" />
                    <line x1="165" y1="200" x2="155" y2="200" stroke="#231E1B" stroke-width="2" />
                    <line x1="167" y1="220" x2="153" y2="220" stroke="#231E1B" stroke-width="2" />
                </g>
            </svg>
        `,
        lore: `
            <p class="first-letter">L</p>
            <p class="lore-text">Likho is the physical embodiment of evil fate, misfortune, and grief. Appearing as a tall, gaunt, one-eyed hag or giant, she stalks those who are already struggling, clinging to their backs and feeding on their despair.</p>
            <p class="lore-text">To encounter Likho is to invite tragedy; she cannot be simply outrun, for she clings to her victims' shadows and whispers dark thoughts directly into their minds.</p>
        `,
        traits: `
            <ul class="runic-list">
                <li><span class="bullet-rune">ᚦ</span><strong>Blinding Strike:</strong> Likho only has one eye; blinding her is the only way to break her pursuit.</li>
                <li><span class="bullet-rune">ᚺ</span><strong>Avoid Her Offerings:</strong> She often leaves golden treasures on paths to entice victims. Taking them seals your bond with her.</li>
                <li><span class="bullet-rune">ᛟ</span><strong>Sacrificial Trickery:</strong> You can trick her into holding onto a heavy object (like an anvil) and throw it in water to drown her.</li>
            </ul>
        `,
        encounter: `
            <blockquote class="journal-entry">
                "I felt a sudden weight upon my neck as I crossed the old bridge. It was cold as snow. For seven weeks, my cows dried, my fields burned, and my wife fell sick. Likho was riding my shoulders."
                <cite>— Tales of the Voronezh Steppes</cite>
            </blockquote>
        `
    }
};

// --- DOM References ---
const filterButtons = document.querySelectorAll(".filter-chip");
const searchInput = document.getElementById("search-input");
const creatureListContainer = document.getElementById("creature-list");
const detailTarget = document.getElementById("creature-details-target");
const displayPage = document.getElementById("display-page");
const nextPageTrigger = document.getElementById("next-page-trigger");

// Atmosphere Buttons
const toggleGlowBtn = document.getElementById("toggle-glow");
const toggleAmbientBtn = document.getElementById("toggle-ambient");
const hearthGlowOverlay = document.querySelector(".hearth-glow");
const ambientAudio = document.getElementById("ambient-audio");

// State Variables
let currentCreatureId = "leshy";
let activeFilter = "all";
let searchQuery = "";

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    // Start hearth flicker loop
    hearthGlowOverlay.classList.add("active");
    
    // Bind Event Listeners
    setupTabListeners();
    setupFilterListeners();
    setupSearch();
    setupCreatureSelection();
    setupPageNavigation();
    setupAtmosphereControls();
});

// --- Tab System (Within Detail View) ---
function setupTabListeners() {
    // Dynamic delegation since details container gets overwritten
    detailTarget.addEventListener("click", (e) => {
        if (e.target.classList.contains("tab-btn")) {
            const tabs = detailTarget.querySelectorAll(".tab-btn");
            const contents = detailTarget.querySelectorAll(".tab-content");
            const selectedTabId = e.target.getAttribute("data-tab");

            tabs.forEach(tab => tab.classList.remove("active"));
            contents.forEach(content => content.classList.remove("active"));

            e.target.classList.add("active");
            detailTarget.querySelector(`#tab-${selectedTabId}`).classList.add("active");
        }
    });
}

// --- Dynamic Creature Switching with Page Flip Visual Effect ---
function switchCreature(id) {
    if (!bestiaryData[id]) return;
    currentCreatureId = id;

    // Trigger visual flip page animation on right page
    displayPage.classList.add("page-flip-flash");

    // Update active highlight in list
    const listItems = document.querySelectorAll(".creature-item");
    listItems.forEach(item => {
        if (item.getAttribute("data-id") === id) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Timeout to swap content in the middle of page-flip effect brightness drop
    setTimeout(() => {
        const data = bestiaryData[id];
        const newContent = `
            <article class="creature-detail" data-creature="${id}">
                <div class="detail-header">
                    <div class="title-block">
                        <span class="runic-seal-header">᚛ ᛉ ᚜</span>
                        <h2 class="creature-name">${data.name}</h2>
                        <h3 class="creature-native-name">${data.nativeName}</h3>
                    </div>
                    <div class="threat-badge-container">
                        <div class="threat-sigil ${data.threatClass.toLowerCase()}" title="${data.threatClass} Threat">${data.threatSigil}</div>
                        <span class="threat-label">Threat Class: ${data.threatClass}</span>
                    </div>
                </div>

                <div class="woodcut-frame">
                    <div class="corner-flourish tl"></div>
                    <div class="corner-flourish tr"></div>
                    <div class="corner-flourish bl"></div>
                    <div class="corner-flourish br"></div>
                    <div class="woodcut-art">
                        ${data.svgArt}
                    </div>
                </div>

                <div class="lore-tabs">
                    <button class="tab-btn active" data-tab="lore">Lore & Myth</button>
                    <button class="tab-btn" data-tab="traits">Vulnerabilities</button>
                    <button class="tab-btn" data-tab="encounter">Encounter Journal</button>
                </div>

                <div class="tab-wrapper">
                    <div class="tab-content active" id="tab-lore">
                        ${data.lore}
                    </div>
                    <div class="tab-content" id="tab-traits">
                        ${data.traits}
                    </div>
                    <div class="tab-content" id="tab-encounter">
                        ${data.encounter}
                    </div>
                </div>
            </article>
        `;
        detailTarget.innerHTML = newContent;
    }, 250);

    // Clean up animation class
    setTimeout(() => {
        displayPage.classList.remove("page-flip-flash");
    }, 600);
}

// --- Selection Handler for Left-Page List Items ---
function setupCreatureSelection() {
    creatureListContainer.addEventListener("click", (e) => {
        const item = e.target.closest(".creature-item");
        if (item) {
            const creatureId = item.getAttribute("data-id");
            switchCreature(creatureId);
        }
    });
}

// --- Runic Category Filters ---
function setupFilterListeners() {
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");

            activeFilter = button.getAttribute("data-filter");
            filterAndRenderList();
        });
    });
}

// --- Search Filter Logic ---
function setupSearch() {
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterAndRenderList();
    });
}

// --- Unified Filter & Search Execution ---
function filterAndRenderList() {
    const items = creatureListContainer.querySelectorAll(".creature-item");
    let visibleItems = [];

    items.forEach(item => {
        const category = item.getAttribute("data-category");
        const titleEn = item.querySelector(".creature-title-en").textContent.toLowerCase();
        const titleRu = item.querySelector(".creature-title-ru").textContent.toLowerCase();

        const matchesCategory = (activeFilter === "all" || category === activeFilter);
        const matchesSearch = (titleEn.includes(searchQuery) || titleRu.includes(searchQuery));

        if (matchesCategory && matchesSearch) {
            item.style.display = "flex";
            visibleItems.push(item);
        } else {
            item.style.display = "none";
        }
    });

    // If active selected item was hidden, auto-select first visible
    if (visibleItems.length > 0) {
        const currentlyActiveVisible = visibleItems.find(item => item.classList.contains("active"));
        if (!currentlyActiveVisible) {
            const firstId = visibleItems[0].getAttribute("data-id");
            switchCreature(firstId);
        }
    }
}

// --- "Turn Leaf" Page-Flip Simulator ---
function setupPageNavigation() {
    nextPageTrigger.addEventListener("click", () => {
        const visibleItems = Array.from(creatureListContainer.querySelectorAll(".creature-item"))
            .filter(item => item.style.display !== "none");

        if (visibleItems.length === 0) return;

        const currentIndex = visibleItems.findIndex(item => item.getAttribute("data-id") === currentCreatureId);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= visibleItems.length) {
            nextIndex = 0; // Wrap back to beginning
        }

        const nextCreatureId = visibleItems[nextIndex].getAttribute("data-id");
        switchCreature(nextCreatureId);
    });
}

// --- Ambient Controls (Glow & Forest Whispers) ---
function setupAtmosphereControls() {
    toggleGlowBtn.addEventListener("click", () => {
        if (hearthGlowOverlay.classList.contains("active")) {
            hearthGlowOverlay.classList.remove("active");
            hearthGlowOverlay.style.opacity = "0";
            toggleGlowBtn.classList.remove("active");
        } else {
            hearthGlowOverlay.classList.add("active");
            hearthGlowOverlay.style.opacity = "0.15";
            toggleGlowBtn.classList.add("active");
        }
    });

    toggleAmbientBtn.addEventListener("click", () => {
        if (ambientAudio.paused) {
            ambientAudio.play().then(() => {
                toggleAmbientBtn.classList.add("active");
            }).catch(err => {
                console.log("Audio play blocked by browser. User interaction required.");
            });
        } else {
            ambientAudio.pause();
            toggleAmbientBtn.classList.remove("active");
        }
    });
}