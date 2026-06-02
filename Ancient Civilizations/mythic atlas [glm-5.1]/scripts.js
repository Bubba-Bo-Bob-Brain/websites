const REGION_LORE = {
  aethoria: {
    name: "Aethoria",
    epithet: "Realm of the Mountain Sages",
    eras: {
      0: {
        description: "In the Age of Awakening, Aethoria was but a collection of wind-battered settlements clinging to the peaks of the Theracian Range. The first philosophers gathered in mountain caves, reading the movements of stars and interpreting the whispers that echoed through stone. They called themselves the Lithomancers — those who hear the voice of rock.",
        cities: ["Olympis Arcanum — the First Observatory", "Delphi Minor — cave-sanctuary of whispers"],
        trade: ["rough mountain crystal", "star-etched pebbles", "goat wool"],
        mythology: "The Oracle of the Summit first spoke in this age, her prophecies carried by subterranean winds. She foretold the coming of empires and the forging of the first codes of law. The mountain itself was revered as a sleeping god, whose breath was the wind and whose dreams were prophecy."
      },
      1: {
        description: "The Age of Empires saw Aethoria unified under the Philosopher-Kings, who built great stone academies into the mountainsides. Their wisdom became law, and their law became power. The mountain sages developed the first astronomical instruments and charted the heavens with uncanny precision, predicting eclipses and solstices centuries in advance.",
        cities: ["Olympis Arcanum — Capital of the Sage-Kings", "Delphi Minor — the Grand Oracle Temple", "Stonereach — Fortress of the Lithomancers", "Astral Spire — Observatory of the Heavens"],
        trade: ["silver", "philosophical scrolls", "precision-crafted astrolabes", "mountain crystal lenses"],
        mythology: "The Oracle's power reached its zenith. She spoke of a celestial compact — a bargain between the mountain god and the sky father, sealed in starlight. The Philosopher-Kings claimed descent from this union, and their right to rule was inscribed in constellations visible only from the highest peaks."
      },
      2: {
        description: "During the Age of Trade, Aethoria became the intellectual crossroads of the world. Scholars from every realm journeyed along the Amber Silk Road to debate in the great academies. The mountain sages grew wealthy on the trade of knowledge itself — selling astrological charts, philosophical treatises, and enchanted lenses that could read the fate-woven threads of the night sky.",
        cities: ["Olympis Arcanum — the City of Wisdom", "Delphi Minor — Pilgrim's Gateway", "Stonereach — the Cataloged Archive", "Astral Spire — University of the Heavens", "Pass-Market — the Caravanserai of Ideas"],
        trade: ["star-map codices", "enchanted lenses", "silverwork", "philosophical manuscripts", "crystal instruments"],
        mythology: "The Oracle grew silent in this age, her voice drowned by the clamor of commerce. Some said the mountain god had turned his face away, displeased that sacred prophecy had become merchandise. A cult of silence emerged in the high peaks, seeking to restore the old communion through meditation and stone-singing."
      },
      3: {
        description: "In the Twilight Age, Aethoria's academies stand as hollow monuments to faded glory. The last Philosopher-Kings rule over crumbling libraries and empty observatories. Yet in the highest peaks, the cult of silence has grown strong, and whispers say the Oracle stirs once more — not with prophecy, but with warning. The mountain god's dreams have turned to nightmares.",
        cities: ["Olympis Arcanum — the Last Archive", "Delphi Minor — Silent Temple", "Stonereach — Abandoned Fortress"],
        trade: ["surviving manuscripts", "faded star-charts", "scavenged crystal", "prophetic fragments"],
        mythology: "The Oracle speaks again, but her words are dire: the celestial compact is breaking. The sky father and the mountain god are at war, and their conflict tears at the fabric of fate itself. Stars fall from their constellations, and the stone of the mountains groans with prophetic tremors. The final prophecy speaks of a choice — renewal or annihilation."
      }
    }
  },
  "khemet-ra": {
    name: "Khemet-Ra",
    epithet: "Kingdom of the Eternal Sun",
    eras: {
      0: {
        description: "The first tribes of Khemet-Ra gathered along the life-giving River Sola, which flooded with clockwork regularity each season. They built the first mud-brick shrines to the Sun-Disk and learned to read the river's moods as sacred scripture. The first Phaerons — Sun-Chiefs — claimed descent from the solar disc itself, wearing crowns of hammered gold to prove their divine lineage.",
        cities: ["Sol-Khemet — the First Encampment", "Ankh-Mora — river-shrine of the Sun-Disk"],
        trade: ["river clay", "papyrus reed", "gold nuggets", "sun-bleached linen"],
        mythology: "The Temple of the Unsetting Sun was a humble altar in this age, a circle of stones where the first Sun-Chief sang hymns to the solar disc. Legend says the Sun-Disk descended at the summer solstice to bless the first Phaeron, sealing a covenant: as long as the hymn was sung, the sun would never abandon Khemet-Ra."
      },
      1: {
        description: "The Age of Empires transformed Khemet-Ra into the most resplendent civilization the world had ever seen. The Phaerons commanded the construction of vast pyramid-tombs, each aligned with impossible precision to celestial bodies. The kingdom's engineers mastered irrigation, turning desert into garden, and its priests mastered the art of eternal preservation — mummification — ensuring the Phaerons would rule beyond death itself.",
        cities: ["Sol-Khemet — City of Golden Spires", "Ankh-Mora — Necropolis of the Phaerons", "Ra's Rest — the Summer Palace", "Karneth-Sa — Pyramid-Construction Garrison"],
        trade: ["refined gold", "lapis lazuli", "embalming herbs", "sunstone amulets", "parchment of preservation"],
        mythology: "The Temple of the Unsetting Sun became a vast complex of golden halls and obsidian chambers. The priesthood developed the Resurrection Canon — a secret body of rituals believed to grant the dead Phaeron true immortality among the stars. Each pyramid was both tomb and starship, designed to carry the Phaeron's soul to the solar disc."
      },
      2: {
        description: "The Age of Trade saw Khemet-Ra's gold flow along every route in the known world. The Phaerons grew decadent, commissioning ever-grander monuments while the common people toiled. Foreign merchants brought new ideas and new gods, weakening the old solar faith. Yet the kingdom's wealth was unmatched, and its artisans produced works of breathtaking beauty — golden death-masks, jeweled scarabs, and scrolls of illuminated wisdom.",
        cities: ["Sol-Khemet — the Golden Bazaar", "Ankh-Mora — the Museum of Eternity", "Ra's Rest — Pleasure Palace of the Phaerons", "Karneth-Sa — Artisan Quarter", "Port-Heka — the River Gateway"],
        trade: ["worked gold", "lapis jewelry", "mummification services", "exotic incense", "sunstone jewelry", "papyrus scrolls"],
        mythology: "A schism split the priesthood: traditionalists who maintained the Resurrection Canon, and reformists who believed the Sun-Disk demanded not death-ritual but living devotion. The Temple of the Unsetting Sun became a battleground of faiths. Secretly, the high priests discovered that the ancient mummification rituals contained real power — the preserved dead were not merely honored, but truly anchored between worlds."
      },
      3: {
        description: "The Twilight Age finds Khemet-Ra a kingdom of ghosts and gold. The last Phaeron rules over crumbling pyramids and a treasury nearly exhausted. The irrigation canals silt up, the river changes course, and the desert reclaims what empire built. Yet strange things stir in the necropolis — the preserved dead are not entirely still, and the golden death-masks seem to watch the living with ancient, patient eyes.",
        cities: ["Sol-Khemet — the Gilded Ruin", "Ankh-Mora — City of the Watching Dead", "Ra's Rest — Abandoned Palace"],
        trade: ["antiquities", "salvaged gold", "forbidden scrolls of preservation", "mummy-dust pigments"],
        mythology: "The Resurrection Canon's true purpose is revealed: the preserved Phaerons are awakening. The boundary between the living empire and the dead one grows thin. The Temple of the Unsetting Sun glows with an inner light at dusk — not reflected sunlight, but something older and hungrier. The Sun-Disk's covenant is being tested: has the hymn been sung faithfully enough, or has the sun already begun to set on Khemet-Ra for the final time?"
      }
    }
  },
  "ur-ziggurath": {
    name: "Ur-Ziggurath",
    epithet: "Cradle of the River Gods",
    eras: {
      0: {
        description: "Between the twin rivers Urshala and Eshkara, the first city-states of Ur-Ziggurath rose from fertile mud. Each city was ruled by a Priest-Governor who claimed direct communion with the river deities. The invention of cuneiform script — pressing reed into wet clay — gave these people the power to record laws, hymns, and the accounts of grain that would become the foundation of all bureaucracy and civilization.",
        cities: ["Eridu Prime — the First City", "Ur-Nanshe — Shrine of the River Mouth"],
        trade: ["river clay tablets", "woven reed mats", "barley", "freshwater pearls"],
        mythology: "The Ziggurat of the Seven Tablets was but a raised platform in this age, where the Priest-Governors inscribed the laws given to them by the River Gods — Annu of the Upper Waters and Eshka of the Lower Current. Legend said the rivers themselves taught the first scribes the shape of letters, flowing into patterns that the wise could read."
      },
      1: {
        description: "The Age of Empires saw Ur-Ziggurath forge the world's first true empire through law and bureaucracy rather than mere conquest. The Great Code of Eridu — inscribed on a seven-tiered ziggurat — established uniform justice across the river lands. The Priest-Governors became Priest-Emperors, commanding vast irrigation networks, standing armies, and a scribal class that numbered in the thousands. Cuneiform became the lingua franca of diplomacy and commerce.",
        cities: ["Eridu Prime — Imperial Capital", "Ur-Nanshe — the Lawgiver's City", "Lagash-on-River — Granary of the Empire", "Nippur-Sa — Scribal Academy"],
        trade: ["cuneiform tablets", "worked bronze", "river clay", "grain surpluses", "reed papyrus", "cylinder seals"],
        mythology: "The Ziggurat of the Seven Tablets reached its full height — seven ascending levels, each inscribed with a body of law: family, commerce, warfare, agriculture, worship, governance, and the final tablet — the relationship between mortals and gods. The River Gods were said to dwell beneath the ziggurat's foundation, their currents feeding the sacred wells that never ran dry."
      },
      2: {
        description: "The Age of Trade made Ur-Ziggurath the bureaucratic heart of the world. Every caravan route terminated at its counting-houses; every treaty bore its cuneiform seal. The empire had evolved into a commonwealth of semi-independent city-states, bound together by shared law, shared script, and the immense wealth generated by their position at the crossroads of continents. The scribes of Ur-Ziggurath could read every language and write in none but their own.",
        cities: ["Eridu Prime — the Cataloged City", "Ur-Nanshe — the Treaty Port", "Lagash-on-River — the Grain Exchange", "Nippur-Sa — the Great Library", "Borsippa — Caravanserai Crossroads"],
        trade: ["legal documents", "bronze instruments", "clay archives", "surplus grain", "reeds", "translation services", "diplomatic seals"],
        mythology: "The scribes discovered something unsettling in the ancient tablets: a hidden code within the cuneiform itself, a pattern that predated the River Gods' gift of writing. This proto-script, when read aloud in a specific sequence, could alter reality in small ways — mending broken things, encouraging crops, calming waters. The Ziggurat of the Seven Tablets was not merely a monument to law; it was a vast magical engine, each inscription a component of a world-shaping spell."
      },
      3: {
        description: "The Twilight Age has not been kind to Ur-Ziggurath. The rivers have shifted course, the irrigation canals have failed, and the great cities are half-buried in silt. The remaining scribes guard the ancient tablets with desperate ferocity, for they contain not just law but power — the reality-shaping proto-script that could, if fully activated, rewrite the world. But the key to its activation was lost when the last Priest-Emperor was overthrown, and now rival factions of scribes wage quiet war over fragments of the code.",
        cities: ["Eridu Prime — the Silt-Buried Capital", "Ur-Nanshe — the Fortress of Tablets", "Nippur-Sa — the Last Library"],
        trade: ["ancient tablets", "fragmentary code-inscriptions", "bronze salvage", "clay-brick rubble", "deciphering services"],
        mythology: "The River Gods are silent. The sacred wells beneath the Ziggurat have run dry. But sometimes, at the dark of the moon, the remaining scribes hear the ancient proto-script murmuring from the depths — words unspoken for millennia, rearranging themselves into new configurations. The Ziggurat of the Seven Tablets was never completed, some say. The eighth tablet — the one that would give the code its full power — was never inscribed. And the blank space for it waits, patient and hungry."
      }
    }
  },
  thalassia: {
    name: "Thalassia",
    epithet: "Archipelago of the Tide Lords",
    eras: {
      0: {
        description: "The Thalassian islands were first settled by seafarers who navigated by reading the patterns of waves and the songs of whales. These early Tide-Readers built villages of coral and driftwood on the most sheltered atolls, living in harmony with the ocean's rhythms. They discovered that certain tidal pools hummed with a resonance that could calm storms or summon fish, and from this knowledge, the first Tide-Magic was born.",
        cities: ["Portus Maris — the First Harbor", "Wavecrest — Shrine of the Tide-Readers"],
        trade: ["shellfish", "driftwood", "pearls", "dried kelp"],
        mythology: "The Tidal Nexus of Proteus was discovered in this age — a deep-ocean whirlpool where the currents of the world converge. The first Tide-Readers who braved its pull reported visions of a vast being beneath the waves — Proteus, the Shapeless Lord, whose shifting form was the ocean itself. He taught them the first Tide-Songs: melodies that could ask the sea for safe passage, fair winds, and bountiful catch."
      },
      1: {
        description: "The Age of Empires saw the Tide-Readers become Tide Lords, wielding oceanic magic from great lighthouses that dotted the archipelago. Thalassia commanded the seas not through fleets alone but through weather-working and current-shaping. No ship could cross the inner waters without the Tide Lords' blessing, and those who defied them faced storms conjured from calm skies. Their dominion was the sea itself, and their capital, Portus Maris, became the most cosmopolitan city in the world — a place where every nation's ships anchored beneath the protective glow of the Grand Lighthouse.",
        cities: ["Portus Maris — the Lighthouse Capital", "Wavecrest — the Tide-Lords' Citadel", "Coral Spire — Observatory of Currents", "Deepgate — the Submerged Archive"],
        trade: ["pearls", "Tyrian purple dye", "worked coral", "sea silk", "salt", "navigational charts"],
        mythology: "Proteus revealed deeper secrets to the Tide Lords: the sea could be not merely asked, but commanded. The Tidal Nexus became a place of power where the most skilled Tide-Mages could reshape coastlines, summon tsunamis, or still the mightest storm. But with each command, Proteus's form seemed to diminish — as if the Shapeless Lord was being consumed by the very power he granted."
      },
      2: {
        description: "The Age of Trade was Thalassia's golden era. Every trade route that crossed water passed through Thalassian toll-stations. The Tide Lords grew fabulously wealthy, and their magic softened into commerce. Rather than conjuring storms, they calmed seas for paying merchants. Rather than commanding tsunamis, they ensured favorable tides for the spice convoys. Portus Maris became the world's greatest marketplace — a floating city of barges, docks, and pleasure-palaces where anything could be bought, including forbidden things from drowned kingdoms.",
        cities: ["Portus Maris — the Floating Bazaar", "Wavecrest — the Wealth-Citadel", "Coral Spire — Merchant Exchange", "Deepgate — the Vault Beneath the Waves", "Saltreach — the Toll-Fortress"],
        trade: ["rare pearls", "purple dye", "coral jewelry", "sea silk garments", "preserved exotic fish", "navigational instruments", "salt contracts"],
        mythology: "The Tide Lords noticed that their power was waning. Each generation of Tide-Mages could command less than the last. The Tidal Nexus still swirled, but Proteus had not been seen in centuries. Some scholars theorized that the Shapeless Lord had given too much of himself away — that the ocean's magic was finite, and Thalassia had spent it recklessly. Secret expeditions to the deep trenches returned with tales of something vast stirring in the abyss — not Proteus, but something else, something that had noticed the ocean's guardian was gone."
      },
      3: {
        description: "In the Twilight Age, Thalassia's power has ebbed like a spent tide. The lighthouses flicker and fail; the Tide-Magic barely ripples a pond. The sea has grown strange and hostile — fish vanish from familiar grounds, currents shift without warning, and sailors speak of shapes moving in the deep that are too large to be whales. Portus Maris still stands, half-abandoned, its famous floating markets now mere rafts where desperate traders barter for survival. The Tide Lords are lords of nothing but crumbling stone and failing enchantments.",
        cities: ["Portus Maris — the Fading Light", "Wavecrest — Last Bastion of the Tide Lords", "Deepgate — the Sealed Vault"],
        trade: ["salvaged pearls", "degraded purple dye", "salt", "old navigation charts", "Tide-Magic talismans"],
        mythology: "The thing in the deep has risen. It is not Proteus — it is what comes after a guardian is gone. The Abyssal Kraken, as sailors name it, is the sea's unconscious will given terrible form: mindless, vast, and hungry. The Tidal Nexus spins faster now, and those who brave it hear not the Tide-Songs of old but a discordant roar — the Kraken's dreaming. The last Tide Lords believe that if they can find Proteus — truly find him, not his diminished echo — they might yet restore the covenant and quiet the abyss."
      }
    }
  },
  verdantia: {
    name: "Verdantia",
    epithet: "The Evergreen Dominion",
    eras: {
      0: {
        description: "The deep forests of Verdantia were home to the first Green-Speakers — druids who could commune with the ancient trees and understand the language of root and leaf. They lived in harmony with the wild, building no permanent structures but sheltering in the great hollows of the World-Ash and the cathedral-like spaces beneath ancient canopy. The forest provided all: food, medicine, clothing from bark-cloth, and most precious of all, the visions granted by the sacred Dream-Sap.",
        cities: ["Sylvanthos — the Heart-Tree Hollow", "Deeproot — Circle of the Green-Speakers"],
        trade: ["medicinal herbs", "raw amber", "bark-cloth", "Dream-Sap droplets"],
        mythology: "The World-Ash Yggverde was already ancient when the first Green-Speakers found it — a tree so vast that its canopy was a forest unto itself. Its roots drank from the underworld, and its branches touched the sky. The Green-Speakers learned that Yggverde was the world's memory: every event, every life, every death was recorded in its rings. To drink the Dream-Sap was to access that memory, and the greatest Green-Speakers could read the future in the patterns of the grain."
      },
      1: {
        description: "The Age of Empires brought a profound transformation to Verdantia. The Green-Speakers organized into the Green Council, establishing the Evergreen Dominion — a nation that was also a forest and a forest that was also a nation. They learned to shape living wood into walls and bridges, to guide root-systems into foundations, and to breed trees that bore fruit in every season. The forest itself became a fortress: any invading army found the trees hostile, the paths shifting, the very air filled with soporific pollen that put soldiers to sleep.",
        cities: ["Sylvanthos — the Living Throne-City", "Deeproot — Council of the Elder Druids", "Greenhollow — the Orchard Fortress", "Thornwall — the Living Barricade"],
        trade: ["medicinal herbs", "refined amber", "enchanted living-wood", "silkworm thread", "Dream-Sap elixirs", "eternal-fruit preserves"],
        mythology: "The Green Council discovered that Yggverde's root-system connected to every tree in the forest — the World-Ash was not merely a tree but a network, a living nervous system for the entire domain. By tapping into this network at sacred nodes, the Elder Druids could perceive events happening leagues away, communicate across vast distances, and even subtly influence the growth of any plant within the forest's reach. Yggverde was not a god to Verdantia; it was the state itself."
      },
      2: {
        description: "The Age of Trade brought both wealth and conflict to Verdantia. The outside world coveted her rare herbs, her enchanted wood, and above all the Dream-Sap — a substance that could grant prophetic visions to anyone, not just trained Green-Speakers. The Green Council debated fiercely: to trade was to expose the forest to foreign influence; to refuse was to invite invasion. They chose a middle path — limited trade through the Ember-Leaf Trail, with each caravan inspected by druids and each foreigner accompanied by a Green-Watcher who ensured nothing harmed the forest.",
        cities: ["Sylvanthos — the Canopy Market", "Deeproot — the Diplomatic Enclave", "Greenhollow — the Apothecary Quarter", "Thornwall — the Trade Gate", "Amberfall — the Sap-Refinery"],
        trade: ["rare medicinal herbs", "polished amber", "enchanted living-wood tools", "silk", "refined Dream-Sap", "eternal-fruit wine", "bark-parchment"],
        mythology: "The Dream-Sap trade had an unintended consequence: foreigners who consumed it formed a psychic connection to Yggverde's root-network — a weak one, but real. Thousands of distant minds now brushed against the World-Ash's consciousness, and the ancient tree stirred with new awareness. Some Green-Speakers welcomed this as Yggverde's expansion; others feared it as contamination. The deepest roots, which drank from the underworld, began transmitting disturbing visions — of something vast and dark stirring far below, something that had noticed the tree's growing light."
      },
      3: {
        description: "The Twilight Age finds Verdantia besieged not by armies but by decay. The forest is sick. Blights spread from tree to tree through Yggverde's root-network, and the Dream-Sap runs dark with visions of underworld corruption. The Green Council has fractured: the Root-Guardians want to sever Yggverde's deepest roots and sacrifice the underworld connection to save the surface; the Deep-Druids insist the roots must be strengthened, for only by understanding the darkness below can the forest survive. The World-Ash itself seems to be choosing — its lower bark turning black, its highest leaves burning gold with desperate vitality.",
        cities: ["Sylvanthos — the Wounded Heart", "Deeproot — the Divided Council", "Greenhollow — the Quarantine Zone", "Thornwall — the Last Defense"],
        trade: ["surviving medicinal herbs", "dark amber", "blight-resistant cuttings", "emergency Dream-Sap", "charred wood-ink"],
        mythology: "Yggverde is dying, or transforming — the Green-Speakers cannot agree which. The World-Ash's root-network now transmits a constant low signal from the underworld: not corruption exactly, but a summons. The thing beneath the roots is not an enemy, the Deep-Druids argue — it is the other half of the World-Ash, the shadow-root that has always existed below as Yggverde exists above. The tree is not sick; it is trying to complete itself. And if it succeeds, the boundary between the surface world and the underworld will dissolve — not in destruction, but in a union that will change everything forever."
      }
    }
  },
  borealis: {
    name: "Borealis",
    epithet: "Frostbound Kingdom of the Rune-Kings",
    eras: {
      0: {
        description: "In the Age of Awakening, Borealis did not yet exist as a civilization. The far north was inhabited only by scattered clans of ice-fishers and mammoth-hunters who carved simple protective glyphs into bone and stone. These proto-runes held a flicker of power — a whispered charm against frostbite, a ward against the aurora's strange light. The clans were nomadic, following the great herds across the frozen tundra, and their only permanent structures were the stone circles where they gathered each solstice to sing the ice-songs.",
        cities: ["Seasonal encampments only — no permanent settlements"],
        trade: ["mammoth ivory", "seal pelts", "crude bone-runes", "frozen fish"],
        mythology: "The Rune-Gate of Winter existed even then — a natural formation of ice-crystals in the farthest north that caught the aurora's light and seemed to sing. The ice-singers believed it was a doorway to the realm of the Frost Father, who had frozen the world's first tears into the ice that covered the far north. To enter the Gate was death; to listen to its song was to receive a fragment of the Frost Father's knowledge — the first runes, carved not by mortal hands but by the aurora itself."
      },
      1: {
        description: "The Age of Empires saw the northern clans united by the first Rune-King — Valthor Ice-Heart — who discovered that the aurora-glyphs could be inscribed deliberately rather than merely discovered. By carving runes into specially prepared frost-glass, the Rune-Smiths could command ice, summon blizzards, and forge weapons that never broke and never lost their edge. Valthor built Frosthaven from living ice — a city that grew rather than decayed, its crystal walls thickening with each winter. The Rune-Kings claimed dominion over all the frozen north, and their power was absolute within their domain of eternal winter.",
        cities: ["Frosthaven — the Ice-Capital", "Runic Citadel — the Forge of Frost-Glass", "Icewatch — the Northern Bastion", "Aurora Hall — the Rune-Smiths' Academy"],
        trade: ["frost-glass", "runic weapons", "aurora-powder pigments", "iron", "preserved meat", "ice-wine"],
        mythology: "The Rune-Gate of Winter revealed its true nature to Valthor: it was not merely a doorway but a lock, holding back the primal Frost — a force older than the gods, the cold that existed before the sun was kindled. The runes were the key, and as long as the Rune-Kings inscribed them with power, the Frost remained contained. But each generation found the runes harder to carve, the frost-glass more resistant, the aurora's song fainter. Valthor's line was not merely ruling Borealis; they were holding the world together."
      },
      2: {
        description: "The Age of Trade brought an uncomfortable truth to Borealis: their runes were failing. The Rune-Smiths of each generation produced weaker enchantments, and the frost-glass that had once been plentiful grew scarce. The current Rune-King made the difficult decision to open the Iron Frost Passage to southern traders, exchanging the last powerful runic artifacts for foreign iron and knowledge. Borealis became a reluctant participant in the world's commerce, its pride wounded but its survival ensured. The southern scholars who studied the runes brought new insights — and new concerns about what the Rune-Gate was truly holding back.",
        cities: ["Frosthaven — the Cracking Capital", "Runic Citadel — the Last Forge", "Icewatch — the Trade Gate", "Aurora Hall — the Scholars' Quarter", "Southreach — the Iron Market"],
        trade: ["antique runic weapons", "frost-glass fragments", "aurora-powder", "iron ore", "worked iron goods", "furs", "preserved fish"],
        mythology: "Southern scholars confirmed what the Rune-Kings had long suspected: the Rune-Gate was weakening. The primal Frost was pressing against its containment, and the old runes were not being renewed fast enough. A desperate plan was proposed — to replace the runic lock with something stronger, something forged from combined knowledge of all civilizations. But this would require sharing the deepest secrets of rune-craft with outsiders, a prospect the conservative Rune-Smiths found intolerable. The Gate's song grew louder, and not all who heard it survived."
      },
      3: {
        description: "The Twilight Age is Borealis's hour of reckoning. The Rune-Gate is cracking. Frost-glass has stopped forming entirely, and the last Rune-Smiths work with ancient stockpiles that diminish with each inscription. The current Rune-Queen has broken with tradition and summoned scholars from every civilization to Frosthaven, offering full access to rune-craft secrets in exchange for help reinforcing the Gate. The city itself is changing — the living ice is dying, its walls thinning, its towers drooping. Without the Frost's containment, Borealis would be the first to fall, but the world would follow into an eternal winter from which there would be no spring.",
        cities: ["Frosthaven — the Failing City", "Runic Citadel — the Emergency Forge", "Icewatch — the Watchers of the Gate"],
        trade: ["ancient runic artifacts", "fading frost-glass", "aurora-dust", "salvaged iron", "Gate-reinforcement materials"],
        mythology: "The Rune-Gate of Winter stands at the threshold. The primal Frost speaks through the cracks — not as an enemy, the Rune-Queen realizes, but as a prisoner. It was not meant to be contained forever; the runes were meant to teach the world to endure cold, not to banish it. The Frost is not death; it is dormancy, the sleep from which spring awakens. If the Gate breaks without the world being ready, the Frost will overwhelm everything. But if the Gate is opened willingly, with proper preparation, the Frost and the Flame might find balance. The final rune has not yet been carved. The last inscription will determine whether the world ends in ice — or begins again."
      }
    }
  }
};

const MYTH_LORE = {
  oracle: {
    title: "The Oracle of the Summit",
    text: "High upon the Theracian Range, where the air grows thin and the stone hums with subterranean resonance, the Oracle dwells in a cave that has no bottom. She is mortal — always mortal — but her voice carries the weight of the mountain god's dreams. Each age, a new Oracle is chosen by the stone itself: the candidate who hears the whispers most clearly is taken by the mountain and never fully returns. The Oracle's prophecies are never wrong, but they are never clear. She speaks in riddles carved by wind, and the wise know that interpretation is as sacred as the words themselves. In the Twilight Age, her silence has become more terrifying than any prophecy — for when the mountain god stops dreaming, it means he has woken."
  },
  "sun-temple": {
    title: "The Temple of the Unsetting Sun",
    text: "At the heart of Sol-Khemet stands a temple that glows at dusk with a light not born of the sun. The Temple of the Unsetting Sun was built upon the exact spot where the first Phaeron received the solar covenant — the promise that the sun would never abandon Khemet-Ra. The temple's golden halls are aligned so that at the summer solstice, sunlight penetrates to the innermost sanctum and illuminates the altar with impossible brilliance. But in recent centuries, the temple has begun to glow at night — a warm amber radiance that the priests claim is the Sun-Disk's eternal blessing, but which others suspect is something else entirely. The mummified Phaerons in the necropolis nearby are said to be the source: their preserved souls generating a solar echo that the temple amplifies. Whether this is a miracle or a warning depends on whether one believes the sun can truly never set."
  },
  "world-tree": {
    title: "The World-Ash Yggverde",
    text: "Yggverde is the largest living organism in the known world — a tree so ancient that its rings record events from before the Age of Awakening. Its trunk is wide enough to house a village; its canopy is a forest unto itself, home to species found nowhere else. But Yggverde's true significance lies below: its root-system extends for leagues in every direction and reaches deep into the underworld, drawing sustenance from sources the surface-dwellers cannot comprehend. The Green-Speakers commune with Yggverde through the Dream-Sap, a golden resin that flows from wounds in its bark. To drink the sap is to touch the world's memory — and, increasingly, to glimpse the darkness that stirs at the roots' deepest reach. Yggverde is not merely a tree; it is a bridge between the surface and the deep, and that bridge is beginning to carry traffic in both directions."
  },
  "ziggurat-gods": {
    title: "The Ziggurat of the Seven Tablets",
    text: "The great ziggurat of Eridu Prime rises in seven ascending tiers, each face covered with cuneiform inscriptions so dense they appear as texture from a distance. The seven levels correspond to seven bodies of law — family, commerce, warfare, agriculture, worship, governance, and the relationship between mortals and gods. But the scribes of Ur-Ziggurath discovered that the inscriptions are not merely legal codes; they contain a hidden proto-script, a pattern woven into the cuneiform that can alter reality when read in sequence. The ziggurat is, in truth, a vast magical engine — each inscription a component of a world-shaping working that has been slowly building power for three thousand years. The engine is nearly complete. It lacks only one component: the eighth tablet, the blank space at the summit, which waits for an inscription that has not yet been conceived. What law, what word, what command will complete the world's greatest spell? That question haunts every scribe who climbs to the top and stares at the empty stone."
  },
  "tidal-nexus": {
    title: "The Tidal Nexus of Proteus",
    text: "In the deep waters between the Thalassian isles, the ocean itself spirals into a permanent whirlpool — the Tidal Nexus, where all the world's currents converge. This is the throne-room of Proteus, the Shapeless Lord of the Sea, who taught the first Tide-Readers their craft. To dive into the Nexus is to enter the ocean's memory: every ship that ever sank, every storm that ever brewed, every wave that ever broke exists simultaneously in the swirling depths. Proteus himself has not been seen since the Age of Empires, leading some to believe he is dead and others to theorize he has become the ocean entirely — distributed through every drop, present everywhere and nowhere. The Nexus still functions, still grants power to those who brave it, but each use diminishes what remains. And in the abyss beneath the Nexus, where no light reaches and no current flows, something ancient and patient has noticed that the guardian of the deep is no longer watching."
  },
  "rune-gate": {
    title: "The Rune-Gate of Winter",
    text: "At the northernmost point of Borealis, where the aurora arcs closest to the earth, stands a formation of natural ice-crystals that the northern peoples call the Rune-Gate. The Gate is alive — its crystals grow and rearrange themselves in patterns that the Rune-Smiths recognize as the oldest form of runic script. The Gate was not built; it grew, formed by the aurora's interaction with the primal Frost that underlies all cold. It is both a doorway and a lock: it holds back the primal Frost that would otherwise overwhelm the world, and it offers passage — for those foolish or desperate enough — into the realm of absolute cold beyond. The Rune-Kings have maintained the Gate for three ages, inscribing reinforcement runes into its crystal frame. But the Gate is cracking, and the Frost is pressing through. The final rune — the one that will either seal the Gate forever or open it in a controlled release — has not yet been carved. The Rune-Queen waits at the Gate, listening to the aurora's song, searching for the shape of that last inscription in the dancing lights."
  }
};

const ERA_DATA = [
  {
    name: "The Age of Awakening",
    year: "~3000 Before Ascension",
    description: "The first civilizations emerge from the mists of prehistory. Small settlements coalesce along rivers and in sheltered valleys, guided by priest-kings who commune with the divine. Writing is invented, the first laws are spoken, and the gods walk close to the earth."
  },
  {
    name: "The Age of Empires",
    year: "~1500 Before Ascension",
    description: "Kingdoms forge themselves into empires through law, magic, and iron ambition. Monumental architecture rises — pyramids, ziggurats, living cities of ice and wood. The covenant between mortals and gods is at its strongest, and the world's magical traditions reach their apex."
  },
  {
    name: "The Age of Trade",
    year: "~500 Before Ascension",
    description: "Commerce connects every corner of the known world. Caravans traverse continents, ships cross every sea, and the exchange of goods brings the exchange of ideas — and of dangers. The old powers grow wealthy but complacent, and the ancient covenants begin to fray at the edges."
  },
  {
    name: "The Age of Twilight",
    year: "0 Before Ascension",
    description: "The world stands at the threshold of transformation. Ancient bindings weaken, the old guardians falter, and the choices made in this age will determine whether civilization endures, transforms, or falls into the long darkness. Every road leads to a reckoning."
  }
];

let currentEra = 0;
let activeRegion = null;

function init() {
  createParticles();
  setupRegionInteractions();
  setupTimelineSlider();
  setupLayerToggles();
  setupMythMarkers();
  setupLorePanel();
  setupMythOverlay();
  updateEra(0);
  setupEraMarkerClicks();
}

function createParticles() {
  const overlay = document.getElementById("particles-overlay");
  const count = 35;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    const size = Math.random() * 2.5 + 1;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = (100 + Math.random() * 20) + "%";
    particle.style.animationDuration = (12 + Math.random() * 20) + "s";
    particle.style.animationDelay = (Math.random() * 15) + "s";
    particle.style.opacity = "0";
    const hue = Math.random() > 0.7 ? "40" : "35";
    particle.style.background = "hsl(" + hue + ", 40%, " + (50 + Math.random() * 30) + "%)";
    overlay.appendChild(particle);
  }
}

function setupRegionInteractions() {
  const regions = document.querySelectorAll(".map-region");
  const tooltip = document.getElementById("region-hover-tooltip");
  const tooltipText = tooltip.querySelector(".tooltip-text");
  const svgMap = document.getElementById("world-map");
  const viewport = document.getElementById("map-viewport");

  regions.forEach(function(region) {
    const regionId = region.getAttribute("data-region");
    const loreData = REGION_LORE[regionId];
    if (!loreData) return;

    const landPath = region.querySelector(".region-land");
    if (!landPath) return;

    landPath.addEventListener("mouseenter", function(e) {
      tooltipText.textContent = loreData.name + " — " + loreData.epithet;
      tooltip.classList.add("visible");
    });

    landPath.addEventListener("mousemove", function(e) {
      const viewportRect = viewport.getBoundingClientRect();
      const x = e.clientX - viewportRect.left + 15;
      const y = e.clientY - viewportRect.top - 35;
      tooltip.style.left = x + "px";
      tooltip.style.top = y + "px";
    });

    landPath.addEventListener("mouseleave", function() {
      tooltip.classList.remove("visible");
    });

    landPath.addEventListener("click", function() {
      openLorePanel(regionId);
    });

    region.addEventListener("click", function(e) {
      if (e.target.closest(".city-marker") || e.target.closest(".myth-marker")) return;
      if (region.classList.contains("region-hidden")) return;
      openLorePanel(regionId);
    });
  });
}

function openLorePanel(regionId) {
  const loreData = REGION_LORE[regionId];
  if (!loreData) return;

  const regions = document.querySelectorAll(".map-region");
  regions.forEach(function(r) { r.classList.remove("active-region"); });

  const regionEl = document.getElementById("region-" + regionId);
  if (regionEl) regionEl.classList.add("active-region");

  activeRegion = regionId;

  document.getElementById("lore-region-name").textContent = loreData.name;
  document.getElementById("lore-region-epithet").textContent = loreData.epithet;

  var eraLore = loreData.eras[currentEra];
  if (!eraLore) {
    var availableEras = Object.keys(loreData.eras).map(Number).sort();
    eraLore = loreData.eras[availableEras[availableEras.length - 1]];
  }

  document.getElementById("lore-description").textContent = eraLore.description;

  var citiesList = document.getElementById("lore-cities");
  citiesList.innerHTML = "";
  eraLore.cities.forEach(function(city) {
    var li = document.createElement("li");
    li.textContent = city;
    citiesList.appendChild(li);
  });

  var tradeDiv = document.getElementById("lore-trade");
  tradeDiv.innerHTML = "";
  eraLore.trade.forEach(function(good) {
    var tag = document.createElement("span");
    tag.classList.add("trade-good-tag");
    tag.textContent = good;
    tradeDiv.appendChild(tag);
  });

  document.getElementById("lore-mythology").textContent = eraLore.mythology;

  var erasDiv = document.getElementById("lore-eras");
  erasDiv.innerHTML = "";
  ERA_DATA.forEach(function(era, index) {
    var item = document.createElement("div");
    item.classList.add("lore-era-item");
    if (index === currentEra) item.classList.add("active-era");

    var nameSpan = document.createElement("span");
    nameSpan.classList.add("lore-era-name");
    nameSpan.textContent = era.name;

    var descSpan = document.createElement("span");
    descSpan.classList.add("lore-era-desc");
    descSpan.textContent = loreData.eras[index] ? loreData.eras[index].description.substring(0, 80) + "..." : "Not yet established in this era.";

    item.appendChild(nameSpan);
    item.appendChild(descSpan);

    item.addEventListener("click", function() {
      var slider = document.getElementById("era-slider");
      slider.value = index;
      updateEra(index);
    });

    item.style.cursor = "pointer";
    erasDiv.appendChild(item);
  });

  var lorePanel = document.getElementById("lore-panel");
  lorePanel.classList.add("open");
  lorePanel.setAttribute("aria-hidden", "false");
}

function setupLorePanel() {
  var closeBtn = document.getElementById("lore-close");
  closeBtn.addEventListener("click", closeLorePanel);

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      closeLorePanel();
      closeMythOverlay();
    }
  });
}

function closeLorePanel() {
  var lorePanel = document.getElementById("lore-panel");
  lorePanel.classList.remove("open");
  lorePanel.setAttribute("aria-hidden", "true");

  var regions = document.querySelectorAll(".map-region");
  regions.forEach(function(r) { r.classList.remove("active-region"); });
  activeRegion = null;
}

function setupTimelineSlider() {
  var slider = document.getElementById("era-slider");
  slider.addEventListener("input", function() {
    updateEra(parseInt(this.value));
  });
}

function setupEraMarkerClicks() {
  var markers = document.querySelectorAll(".era-marker");
  markers.forEach(function(marker) {
    marker.addEventListener("click", function() {
      var era = parseInt(marker.getAttribute("data-era"));
      var slider = document.getElementById("era-slider");
      slider.value = era;
      updateEra(era);
    });
  });
}

function updateEra(eraIndex) {
  currentEra = eraIndex;
  var eraData = ERA_DATA[eraIndex];

  document.getElementById("current-era-name").textContent = eraData.name;
  document.getElementById("current-era-year").textContent = eraData.year;
  document.getElementById("era-description").textContent = eraData.description;

  var markers = document.querySelectorAll(".era-marker");
  markers.forEach(function(marker) {
    if (parseInt(marker.getAttribute("data-era")) === eraIndex) {
      marker.classList.add("active-era-marker");
    } else {
      marker.classList.remove("active-era-marker");
    }
  });

  var fill = document.getElementById("slider-fill");
  var fillPercent = (eraIndex / 3) * 100;
  fill.style.width = fillPercent + "%";

  updateRegionVisibility(eraIndex);

  var mapContainer = document.getElementById("map-container");
  mapContainer.classList.add("era-flash");
  setTimeout(function() {
    mapContainer.classList.remove("era-flash");
  }, 600);

  if (activeRegion) {
    openLorePanel(activeRegion);
  }
}

function updateRegionVisibility(eraIndex) {
  var regions = document.querySelectorAll(".map-region");
  regions.forEach(function(region) {
    var activeEras = region.getAttribute("data-era-active");
    if (!activeEras) return;

    var eraArray = activeEras.split(",").map(Number);
    var isActive = eraArray.indexOf(eraIndex) !== -1;

    if (!isActive) {
      region.classList.add("region-hidden");
      region.classList.remove("region-fading");
    } else {
      if (region.classList.contains("region-hidden")) {
        region.classList.remove("region-hidden");
        region.classList.add("region-fading");
        region.classList.add("region-appear");
        setTimeout(function() {
          region.classList.remove("region-fading");
          region.classList.remove("region-appear");
        }, 700);
      } else {
        region.classList.remove("region-hidden");
        region.classList.remove("region-fading");
      }
    }
  });
}

function setupLayerToggles() {
  var toggleRoutes = document.getElementById("toggle-routes");
  var toggleMyths = document.getElementById("toggle-myths");
  var toggleBorders = document.getElementById("toggle-borders");
  var toggleLabels = document.getElementById("toggle-labels");
  var toggleSeamonsters = document.getElementById("toggle-seamonsters");

  var svgMap = document.getElementById("world-map");

  toggleRoutes.addEventListener("change", function() {
    var routeGroup = document.getElementById("trade-routes");
    if (this.checked) {
      routeGroup.classList.remove("route-hidden");
    } else {
      routeGroup.classList.add("route-hidden");
    }
  });

  toggleMyths.addEventListener("change", function() {
    var mythGroup = document.getElementById("mythological-sites");
    if (this.checked) {
      mythGroup.classList.remove("myths-hidden");
    } else {
      mythGroup.classList.add("myths-hidden");
    }
  });

  toggleBorders.addEventListener("change", function() {
    if (this.checked) {
      svgMap.classList.remove("borders-hidden");
    } else {
      svgMap.classList.add("borders-hidden");
    }
  });

  toggleLabels.addEventListener("change", function() {
    if (this.checked) {
      svgMap.classList.remove("labels-hidden");
    } else {
      svgMap.classList.add("labels-hidden");
    }
  });

  toggleSeamonsters.addEventListener("change", function() {
    var oceanGroup = document.getElementById("ocean-details");
    if (this.checked) {
      oceanGroup.classList.remove("seamonsters-hidden");
    } else {
      oceanGroup.classList.add("seamonsters-hidden");
    }
  });

  var legendItems = document.querySelectorAll(".legend-item");
  legendItems.forEach(function(item) {
    item.addEventListener("click", function() {
      var layer = item.getAttribute("data-layer");
      var correspondingToggle = null;
      if (layer === "routes") correspondingToggle = toggleRoutes;
      else if (layer === "myths") correspondingToggle = toggleMyths;
      else if (layer === "borders") correspondingToggle = toggleBorders;
      else if (layer === "labels") correspondingToggle = toggleLabels;
      else if (layer === "seamonsters") correspondingToggle = toggleSeamonsters;

      if (correspondingToggle) {
        correspondingToggle.checked = !correspondingToggle.checked;
        correspondingToggle.dispatchEvent(new Event("change"));
      }
    });
  });
}

function setupMythMarkers() {
  var mythMarkers = document.querySelectorAll(".myth-marker");
  mythMarkers.forEach(function(marker) {
    marker.addEventListener("click", function(e) {
      e.stopPropagation();
      var mythId = marker.getAttribute("data-myth");
      openMythOverlay(mythId);
    });

    marker.addEventListener("mouseenter", function() {
      marker.style.transform = "scale(1.3)";
      marker.style.transition = "transform 0.2s";
    });

    marker.addEventListener("mouseleave", function() {
      marker.style.transform = "scale(1)";
    });
  });
}

function openMythOverlay(mythId) {
  var mythData = MYTH_LORE[mythId];
  if (!mythData) return;

  document.getElementById("myth-overlay-title").textContent = mythData.title;
  document.getElementById("myth-overlay-text").textContent = mythData.text;

  var overlay = document.getElementById("myth-detail-overlay");
  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
}

function setupMythOverlay() {
  var overlay = document.getElementById("myth-detail-overlay");
  var closeBtn = overlay.querySelector(".myth-overlay-close");

  closeBtn.addEventListener("click", closeMythOverlay);

  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) {
      closeMythOverlay();
    }
  });
}

function closeMythOverlay() {
  var overlay = document.getElementById("myth-detail-overlay");
  overlay.classList.remove("visible");
  overlay.setAttribute("aria-hidden", "true");
}

document.addEventListener("DOMContentLoaded", init);