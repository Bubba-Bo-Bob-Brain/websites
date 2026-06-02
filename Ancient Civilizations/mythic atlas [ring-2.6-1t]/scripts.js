/* ═══════════════════════════════════════════════════════════════════════════════
   ATLAS OF THE ANCIENTS — Interactive JavaScript
   ═══════════════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════════════════
       DATA — Lore, Trade, Mythology for every civilization
       ═══════════════════════════════════════════════════════════════════════════ */

    const REGIONS_DATA = {
        valthorin: {
            name: 'Valthorin',
            title: 'The High Kingdom',
            icon: '🏛',
            color: '#5a7088',
            population: '12 million',
            wealth: '★★★★☆',
            military: '★★★★★',
            magic: '★★★☆☆',
            chronicle: 'Valthorin is the oldest standing kingdom in the known world, its foundations laid by the Stone-Speakers in the First Age. Carved into the living rock of the Greypeak Mountains, its citadels have never fallen to siege. The High Kings of Valthorin trace their lineage to the legendary Korval the Unbroken, who is said to have wrested sovereignty from the Mountain Titan itself. The kingdom\'s economy thrives on deep-mining of mithral and star-iron, precious metals found nowhere else in the realms.',
            cities: [
                {
                    name: 'Ironpeak',
                    type: 'Capital',
                    desc: 'The crown-city of Valthorin, built into a colossal cliff face. Its terraced halls extend a thousand feet upward, connected by bridges of star-iron. The Great Archive of Ironpeak holds scrolls dating to the First Age, and the Eternal Forge at its heart has burned continuously for three millennia, tended by the Order of the Undying Flame.'
                },
                {
                    name: 'Stonehaven',
                    type: 'Fortress City',
                    desc: 'A strategic stronghold guarding the northern pass into the Greypeaks. Stonehaven\'s walls are fused stone, grown rather than built by the geomancers of the Deep Circle. It serves as the kingdom\'s primary defense against the creatures that emerge from the Hollow Deep beneath the mountains.'
                }
            ],
            trade: 'Valthorin controls the Amber Road, exporting mithral ingots, star-iron weapons, and carved gemstones to Kethara and beyond. The kingdom imports grain, textiles, and exotic spices, for the mountain soil yields little beyond hardy root vegetables and lichen-bread. Caravan guilds pay heavy tolls for passage through the mountain passes.',
            mythology: 'The Titan\'s Rest — a massive stone figure carved into the highest peak — is said to be the petrified form of Korval the Unbroken, eternally watching over his kingdom. Shamans of the Deep Circle claim that on quiet nights, the Titan\'s stone eyes glow with ancient fire.',
            artifacts: [
                {
                    icon: '⚒️',
                    name: 'The Star-Iron Crown',
                    desc: 'Forged from metal drawn from the heart of a fallen star, this crown grants its wearer unnatural resilience against magic and blade.',
                    origin: 'Found in the First Age, kept in the vaults of Ironpeak'
                },
                {
                    icon: '🛡️',
                    name: 'The Aegis of Korval',
                    desc: 'A tower shield carved from a single slab of living granite. It has repelled every siege weapon ever brought against it.',
                    origin: 'Passed down through High Kings since the founding era'
                }
            ],
            eras: {
                1: 'A loose confederation of mining clans, the Valthorin existed as scattered settlements in the deep mountains, trading raw ore with surface dwellers.',
                2: 'Korval the Unbroken united the clans through the War of Seven Peaks, forging the first true kingdom and establishing Ironpeak as capital.',
                3: 'The High Kingdom reaches its zenith. Trade with Kethara flourishes, and the Star-Iron Legion maintains dominance over the mountain passes.',
                4: 'Deep tremors shake the Greypeaks. The Hollow Deep widens, and ancient things stir beneath the foundations of Ironpeak. Many border settlements have fallen silent.'
            }
        },
        aurelion: {
            name: 'Aurelion',
            title: 'The Coastal Republic',
            icon: '⚓',
            color: '#8b3a3a',
            population: '8.5 million',
            wealth: '★★★★★',
            military: '★★★☆☆',
            magic: '★★★★☆',
            chronicle: 'Aurelion is a federation of merchant city-states united under the Council of Tides, a governing body of elected harbor-masters. Founded by refugees fleeing the collapse of the First Age empires, Aurelion\'s people built their civilization on the sea itself. Their great fleet of lantern-ships dominates coastal trade, and the republic\'s wealth is unmatched. The famed Coral Amphitheater in Port Solace hosts scholars, poets, and traders from every known land.',
            cities: [
                {
                    name: 'Port Solace',
                    type: 'Trade Capital',
                    desc: 'The largest natural harbor in the known world, Port Solace is a city built entirely on interconnected stone piers and artificial islands. Its Coral Amphitheater can seat ten thousand, and its markets overflow with goods from every corner of the world. The ruling Tide-Master resides in the Saltspray Palace, a structure of living coral that grows a little more each year.'
                },
                {
                    name: 'Coralwatch',
                    type: 'Naval Fortress',
                    desc: 'A fortified island-city guarding the southern strait. Coralwatch\'s submarine pens house the Republic\'s feared Leviathan Corps — warriors trained to fight aboard and alongside massive sea creatures bred in the deep trenches off the coast.'
                }
            ],
            trade: 'Aurelion controls the Maritime Jade Route, shipping jade, pearls, salt, and preserved fish northward to Verdantis and the Shattered Isles. The Spice Route also begins in Aurelion\'s harbors, carrying cinnamon, pepper, and silks from the far south to Kethara and Drakthar. The Republic\'s navy ensures safe passage — for a fee.',
            mythology: 'The Drowned God\'s Maw — a massive whirlpool in the deep sea south of the Shattered Isles — is said to be the open mouth of Thal\'mare, a slumbering ocean deity. Sailors toss offerings of gold and incense into the waters before long voyages, for those who earn the Drowned God\'s favor are granted calm seas and following winds.',
            artifacts: [
                {
                    icon: '🔱',
                    name: 'The Trident of Thal\'mare',
                    desc: 'A three-pronged weapon of coral and black pearl, said to command the tides themselves. Whoever holds it is said to be the chosen voice of the ocean.',
                    origin: 'Recovered from the Drowned God\'s Maw by the first Tide-Master'
                },
                {
                    icon: '🧭',
                    name: 'The Navigator\'s Eye',
                    desc: 'A flawless sapphire set into an ancient compass that always points toward one\'s heart\'s desire — or so the sailors claim.',
                    origin: 'Passed between the greatest navigators of Port Solace for centuries'
                }
            ],
            eras: {
                1: 'Scattered fishing villages and raider clans inhabited the coastline, frequently warring with one another and the sea creatures of the deep.',
                2: 'The Great Council convened for the first time, uniting seven city-states under the Republic. The first Tide-Master was elected, and the great harbor works of Port Solace began.',
                3: 'Aurelion\'s merchant fleet spans the known world. The Republic is the richest nation, but tensions grow between the wealthy harbor-masters and the common sailors.',
                4: 'Strange leviathans have been sighted near Coralwatch. Trade is disrupted, and whispers of a coming tidal catastrophe spread through the ports.'
            }
        },
        selenmoor: {
            name: 'Selenmoor',
            title: 'The Verdant Deep',
            icon: '🌿',
            color: '#3a6b4a',
            population: '4 million',
            wealth: '★★☆☆☆',
            military: '★★★☆☆',
            magic: '★★★★★',
            chronicle: 'Selenmoor is a vast, ancient forest where the trees grow so tall their canopies blot out the sun. Home to the Circle of the Green — an order of druids and shamans who commune with the primal spirits of nature — Selenmoor is both feared and revered. The forest itself is alive in ways that outsiders cannot comprehend; paths shift, clearings appear and vanish, and those who enter without permission rarely find their way out. Beneath the canopy, moonlit groves pulse with raw magical energy.',
            cities: [
                {
                    name: 'Willowmere',
                    type: 'Sacred Grove',
                    desc: 'Not truly a city by any conventional measure, Willowmere is a clearing in the deepest part of the forest where ancient willow trees grow around a perfectly circular lake. The druids of the Green Circle gather here for their rites, and the waters of the lake are said to show visions of the past and future.'
                }
            ],
            trade: 'Selenmoor exports rare herbs, medicinal plants, enchanted timber, and potent alchemical reagents. The Silk Route connects Selenmoor to Kethara and Verdantis, though the traders who brave the forest paths must hire druidic guides. The Circle of the Green does not use coin — they trade in favors, knowledge, and rare seeds.',
            mythology: 'The Whispering Grove — a ring of ancient oak trees deep in the forest where, it is said, the trees speak in voices of the dead. Those who listen carefully can hear the wisdom of ancestors stretching back to the First Age. The druids claim the grove is the memory of the world itself.',
            artifacts: [
                {
                    icon: '🌳',
                    name: 'The Seed of the First Tree',
                    desc: 'A single acorn of impossible age. When planted in fertile soil and watered with moonlight, it grows into a tree overnight — a tree whose wood is harder than steel and whose leaves cure any poison.',
                    origin: 'Guarded by the Green Circle since before recorded history'
                },
                {
                    icon: '🍃',
                    name: 'The Verdant Crown',
                    desc: 'A living circlet of woven vines and flowers that never wilts. Its wearer can command plant life and communicate with any creature of the forest.',
                    origin: 'Given to the first Archdruid by the forest spirit known as the Green Mother'
                }
            ],
            eras: {
                1: 'The forest covered a vast swathe of the continent, and the druidic traditions were young. The spirits of the land walked openly among mortals.',
                2: 'The Circle of the Green was formally established, and Willowmere became the spiritual heart of the forest. The first Archdruid unified the scattered groves under one philosophy.',
                3: 'Selenmoor has grown denser and more magical. The forest now actively resists intrusion, and outsiders who enter without permission face bewildering enchantments. Trade with the outside world is limited but lucrative.',
                4: 'The forest is dying from the edges inward. Blight spreads where the old magic once held sway, and the druids fear something corrupts the roots of the world-tree at the forest\'s heart.'
            }
        },
        kethara: {
            name: 'Kethara',
            title: 'The Golden Dominion',
            icon: '🔺',
            color: '#c17a34',
            population: '20 million',
            wealth: '★★★★★',
            military: '★★★★☆',
            magic: '★★☆☆☆',
            chronicle: 'Kethara is the wealthiest and most populous realm in the known world, a vast desert empire united under the God-Pharaoh who rules from the Amber Citadel. Its cities are wonders of engineering — towering ziggurats, aqueducts that span dry canyons, and observatories that track the movements of stars with mathematical precision. The Ketharan legions are disciplined and numerous, and their gold buys loyalty across all borders. Yet beneath the gilded surface, the empire faces succession crises and the growing influence of a mysterious priesthood devoted to the Sun Serpent.',
            cities: [
                {
                    name: 'Sunspire',
                    type: 'Imperial Capital',
                    desc: 'The seat of the God-Pharaoh, Sunspire rises from the desert like a mountain of gold and glass. Its ziggurat-temple reaches three hundred feet into the sky, and its walls are inlaid with lapis lazuli and carnelian. The Sunspire Observatory, the greatest in the world, houses the Astronomer-Priests who predict eclipses and seasons with uncanny accuracy.'
                },
                {
                    name: 'Obsidian Gate',
                    type: 'Border Fortress',
                    desc: 'A massive fortress-city built around a natural canyon in the desert\'s edge. The Obsidian Gate controls all land trade between Kethara and the northern realms. Its walls are black volcanic glass, and its garrison of ten thousand soldiers has never been tested in battle — a fact that fills Kethara\'s enemies with either relief or suspicion.'
                },
                {
                    name: 'Amber Citadel',
                    type: 'Summer Capital',
                    desc: 'A pleasure city of palaces and gardens where the God-Pharaoh retreats during the hottest months. The Amber Citadel is famous for its automaton servants, its library of a million scrolls, and the legendary Golden Bath — a pool said to restore youth to those who bathe in its waters.'
                }
            ],
            trade: 'Kethara sits at the crossroads of every major trade route. The Spice Route brings eastern luxuries through its territory, while the Amber Road funnels northern metals southward. The Golden Dominion\'s own exports include gold, papyrus, glass, grain, and the finest textiles in the known world. Ketharan merchant houses have agents in every port and city.',
            mythology: 'The Sun Serpent — a colossal serpent of fire said to dwell within the sun itself — is the patron deity of Kethara. Each dawn, the priests perform the Rite of Awakening to ensure the serpent\'s continued journey across the sky. It is prophesied that when the Sun Serpent finally descends to earth, it will consume the unworthy and remake the world in golden fire.',
            artifacts: [
                {
                    icon: '☀️',
                    name: 'The Solar Diadem',
                    desc: 'A crown of pure gold set with a sunstone so bright it can blind those who look upon it. The God-Pharaoh wears it during the equinox ceremonies, when its power is said to reach its zenith.',
                    origin: 'Crafted by the first God-Pharaoh in the Age of Flames'
                },
                {
                    icon: '📜',
                    name: 'The Codex of Eternity',
                    desc: 'An unending scroll that records every event that has ever occurred or ever will. Only the High Astronomer-Priest may read its pages, and they claim it contains the formula for immortality.',
                    origin: 'Kept in the deepest vault beneath the Sunspire Observatory'
                }
            ],
            eras: {
                1: 'Nomadic desert tribes followed the Sun Serpent\'s path across the sands, leaving behind only stone circles and fire-pits as evidence of their passing.',
                2: 'The first God-Pharaoh, Ketharion the Golden, united the desert tribes through a combination of military conquest and religious revelation, founding the empire that would bear his name.',
                3: 'The Golden Dominion is at the peak of its power. Its borders stretch from sea to sea, and its treasury overflows with the wealth of conquered and allied lands alike.',
                4: 'A series of plagues and failed harvests have shaken the empire\'s foundations. Rival priests claim the Sun Serpent has abandoned Kethara, and provincial governors eye the throne with growing ambition.'
            }
        },
        drakthar: {
            name: 'Drakthar',
            title: 'The Volcanic Empire',
            icon: '🌋',
            color: '#4a2a4a',
            population: '6 million',
            wealth: '★★★☆☆',
            military: '★★★★☆',
            magic: '★★★★☆',
            chronicle: 'Drakthar is a harsh land of volcanic peaks, obsidian fields, and rivers of fire. Its people, the Drakari, are a stern and proud civilization that has forged an empire from the crucible of the earth itself. Their cities are carved into volcanic rock and built around thermal vents that provide endless heat. The Drakari worship the Fire Below — the molten heart of the world — and their sorcerers draw power directly from the planet\'s magma. Despite their fearsome reputation, the Drakari are master artisans whose obsidian blades and volcanic glass jewelry are prized across the world.',
            cities: [
                {
                    name: 'Ashhold',
                    type: 'Imperial Capital',
                    desc: 'Built on the rim of the Great Caldera, Ashhold is a city of black stone and perpetual smoke. Its streets are heated by geothermal vents beneath the surface, and its forges have never cooled since the city\'s founding. The Emperor of Drakthar rules from the Obsidian Throne, a seat carved from a single piece of volcanic glass.'
                },
                {
                    name: 'Dragonmouth',
                    type: 'Mining Colony',
                    desc: 'A fortress built into the throat of an active volcano, Dragonmouth is the source of Drakthar\'s most valuable resource: dragonite, a mineral found only in volcanic magma chambers. The miners of Dragonmouth are the bravest — or most foolhardy — souls in the known world, working alongside fire elementals who dwell in the deep.'
                }
            ],
            trade: 'Drakthar exports obsidian, volcanic glass, dragonite, and fire-resistant alloys. The Amber Road connects Drakthar to Valthorin and the northern realms, while the Spice Route brings southern luxury goods through its territory. Drakari smiths are employed across the world, and their volcanic steel is considered the finest blade-making material in existence.',
            mythology: 'The Eternal Flame — a fire that has burned at the summit of the Great Caldera since before the First Age — is the living manifestation of the Fire Below. The Drakari believe that when the flame dies, so too will the world. Each year, the Emperor must renew the Flame through a ritual sacrifice; failure means catastrophe.',
            artifacts: [
                {
                    icon: '🗡️',
                    name: 'The Obsidian Edge',
                    desc: 'A blade of pure volcanic glass that never dulls and can cut through any known metal. It drinks the light and casts no shadow, making it terrifying in combat.',
                    origin: 'Forged in the deepest forge of Dragonmouth by the legendary smith Vorrath the Flame-Hand'
                },
                {
                    icon: '🧤',
                    name: 'The Gauntlets of the Firelord',
                    desc: 'These black iron gauntlets allow their wearer to handle molten rock and walk through fire unharmed. They are worn only by the Emperor and have never been successfully stolen.',
                    origin: 'Gifted to the first Emperor of Drakthar by the Fire Elemental King'
                }
            ],
            eras: {
                1: 'Scattered clans of fire-worshippers dwelled near volcanic vents, feared and avoided by the peoples of the plains and forests.',
                2: 'The Great Forge-War unified the Drakari clans under Emperor Vorrath, who built the first great city around the Eternal Flame. The Volcanic Empire was born in fire and blood.',
                3: 'Drakthar is a respected military power. Its obsidian trade is vital to the world economy, and its alliance with Valthorin forms a bulwark against southern expansion.',
                4: 'The Eternal Flame has begun to flicker and change color. The Emperor has ordered the greatest sorcerers to investigate, while prophets warn of a coming eruption that could destroy the empire.'
            }
        },
        lyrian: {
            name: 'Lyrian Steppe',
            title: 'The Endless Grass Sea',
            icon: '🐎',
            color: '#7a6a3a',
            population: '15 million',
            wealth: '★★★☆☆',
            military: '★★★★☆',
            magic: '★★☆☆☆',
            chronicle: 'The Lyrian Steppe is a vast, windswept grassland stretching from the mountains of Valthorin to the northern sea. Home to countless nomadic tribes and their great horse herds, the Steppe has never been truly conquered — for how does one conquer the wind? The Lyrians are the finest horsemen in the known world, capable of firing arrows at full gallop with deadly accuracy. Their tribal confederations shift constantly, but in times of crisis, the tribes unite under a Great Khan whose authority is absolute.',
            cities: [
                {
                    name: 'Windfall',
                    type: 'Trading Settlement',
                    desc: 'The only permanent settlement of significant size on the Steppe, Windfall sits at the junction of several major trade routes. Originally a seasonal meeting ground for tribes, it has grown into a bustling market town where Lyrian horse-lords trade hides, horses, and amber for the luxuries of settled civilization. The Great Yurt of Windfall can house three thousand people and serves as the meeting place for the Tribal Council.'
                },
                {
                    name: 'Thunderpost',
                    type: 'Watchtower Fortress',
                    desc: 'A network of signal towers stretching across the eastern Steppe, Thunderpost is not a single settlement but a system of communication. Using mirror-flashes, fire signals, and trained messenger hawks, news travels across a thousand miles of grassland in hours. The Thunderpost is maintained by the Skywatchers, an order of Lyrian monks who study the wind and weather.'
                }
            ],
            trade: 'The Lyrian Steppe is the crossroads of the Amber Road, which carries goods from Drakthar and Valthorin southward. Lyrian horses are the finest in the world and are exported to every nation. The tribes also trade in amber, hides, felt, dried meat, and kumis (fermented mare\'s milk). Caravan guards are often Lyrian mercenaries, feared for their mounted archery.',
            mythology: 'The Great Stallion — a divine horse of thunder and lightning that gallops across the sky each night, its hooves creating the sound of distant thunder. The Lyrians believe that every horse is a descendant of the Great Stallion, and that a warrior\'s horse chooses them, not the other way around. The most sacred ritual is the Bonding, where a young rider and a wild stallion forge an unbreakable partnership.',
            artifacts: [
                {
                    icon: '🐎',
                    name: 'The Saddle of the Great Khan',
                    desc: 'An ancient saddle made from the hide of a thunder-lizard and inlaid with amber and silver. It is said that whoever sits upon it can ride any horse without being thrown, and that the horse will run until the world ends.',
                    origin: 'Lost and found many times across the ages; its current location is unknown'
                },
                {
                    icon: '🏹',
                    name: 'The Wind-Bow',
                    desc: 'A composite bow made from bone, sinew, and horn that never misses when fired from horseback. The arrow loosed from this bow is said to be guided by the wind itself.',
                    origin: 'Crafted by the legendary archer Syrkan the Swift during the First Age'
                }
            ],
            eras: {
                1: 'Hundreds of nomadic tribes roamed the Steppe in an endless cycle of alliance and warfare. No single power dominated, and the grassland was a lawless frontier.',
                2: 'The first Great Khan, Ulric Stormborn, united the western tribes and launched devastating raids against the settled kingdoms. The Amber Road was established as a trade route after his death.',
                3: 'The Steppe is loosely united under a fragile tribal confederation. Trade with the southern kingdoms has brought unprecedented wealth, but also alcohol, disease, and foreign religions that threaten traditional Lyrian culture.',
                4: 'A mysterious blight is killing the grass across the eastern Steppe. Horses sicken and die. The tribes blame the settled kingdoms and prepare for a Great Raid the likes of which has not been seen in centuries.'
            }
        },
        verdantis: {
            name: 'Verdantis',
            title: 'The Emerald Dominion',
            icon: '🌴',
            color: '#2a6060',
            population: '9 million',
            wealth: '★★★★☆',
            military: '★★★☆☆',
            magic: '★★★★★',
            chronicle: 'Verdantis is a tropical empire of dense jungle, mighty rivers, and ancient pyramids covered in vines. Its people, the Verdani, are masters of botany and natural magic, having developed an intricate system of living architecture — buildings grown from trees and shaped over decades. The Emerald Dominion is ruled by the Jade Court, a council of archmages who maintain a delicate balance between civilization and the wild. Verdanti jungle-craftsmen create wondrous items from exotic woods, rare resins, and living plants.',
            cities: [
                {
                    name: 'Jade-Heart',
                    type: 'Imperial Capital',
                    desc: 'The heart of Verdantis, where massive banyan trees have been coaxed into forming a cathedral-like canopy over the royal precinct. The Jade Palace is a living structure — its walls are the interwoven trunks of ancient trees, its roof a canopy of leaves that filters the sunlight into an eternal green twilight. The Emperor of Verdantis, known as the Rootspeaker, conducts rituals among the roots of the World Tree at the city\'s center.'
                },
                {
                    name: 'Vinecrest',
                    type: 'Port City',
                    desc: 'A coastal city where the jungle meets the sea, Vinecrest is Verdantis\'s gateway to the wider world. Built on stilts above a mangrove swamp, its waterways serve as streets. The city is famous for its Vine Market, where living plants from across the tropics are traded alongside exotic animals and potent jungle medicines.'
                }
            ],
            trade: 'Verdantis exports rare jungle spices, medicinal herbs, exotic hardwoods, living plants, and potent alchemical reagents found nowhere else. The Silk of the South trade route connects it to Kethara and Selenmoor, while the Maritime Jade Route brings ships from Aurelion and the Shattered Isles. The Verdanti are shrewd traders who value long-term relationships over quick profit.',
            mythology: 'The Starfall Crater — a massive depression in the heart of the jungle where a star fell in ages past — is the holiest site in Verdantis. The Verdani believe that all life on the world was seeded by falling stars, and that the Crater contains the original seed from which all plant life grew. The High Druids of the Jade Court tend the Sacred Garden at the Crater\'s center, where plants of impossible colors grow in perpetual bloom.',
            artifacts: [
                {
                    icon: '🌱',
                    name: 'The World Seed',
                    desc: 'A seed no larger than a grain of sand that, when planted, grows into whatever plant the holder most needs. It has been used to cure famines and heal blighted lands, but the Verdani warn that it can only be used three times before it dies.',
                    origin: 'Recovered from the Starfall Crater by the first Rootspeaker'
                },
                {
                    icon: '🌺',
                    name: 'The Bloom Crown',
                    desc: 'A crown of living flowers that never wilt. It changes its blossoms with the seasons and grants its wearer the ability to communicate with all plant life.',
                    origin: 'Grown over centuries by the archmages of Jade-Heart'
                }
            ],
            eras: {
                1: 'Primitive jungle-dwellers lived in harmony with the forest, worshipping nature spirits and building simple tree-dwellings. Knowledge of botany was passed down orally.',
                2: 'The Jade Court was established when five powerful archmages united the jungle tribes. They developed living architecture and began the great cultivation projects that would create Jade-Heart.',
                3: 'Verdantis has become a major power, its jungle medicines and exotic exports in demand across the world. The Jade Court maintains a careful neutrality in continental politics.',
                4: 'The jungle is expanding unnaturally, swallowing neighboring territories. Some see this as a blessing; others fear the Verdanti are losing control of the primal forces they once commanded.'
            }
        },
        'shattered-isles': {
            name: 'The Shattered Isles',
            title: 'The Storm-Born Archipelago',
            icon: '🌊',
            color: '#5a5a88',
            population: '3 million',
            wealth: '★★★★☆',
            military: '★★☆☆☆',
            magic: '★★★★★',
            chronicle: 'Once a single great landmass, the Shattered Isles were broken apart by a cataclysmic magical event in the Age of Flames. Now they are a chain of hundreds of islands ruled by storm-sailors, tidal mages, and sky-priests. The Islanders navigate by starlight and storm-winds, their ships capable of sailing against the wind itself. Each island has its own ruler, but the Council of Tides convenes when the islands face a common threat. The waters around the Isles are treacherous, filled with leviathans, whirlpools, and magical storms.',
            cities: [
                {
                    name: 'Tidegate',
                    type: 'Council Seat',
                    desc: 'The largest of the Shattered Isles, Tidegate serves as the seat of the Council of Tides. Its harbor is sheltered by colossal sea-stacks carved by ancient magic into the shapes of guardian beasts. The Hall of Tides is built on a natural island that rises and falls with the tides, accessible only by boat at low tide and by a magical bridge of frozen water at high tide.'
                },
                {
                    name: 'Abyss Reach',
                    type: 'Research Outpost',
                    desc: 'A remote island dedicated to the study of the deep ocean and its magical properties. The scholars of Abyss Reach maintain the Deep Observatory, a tower that extends both above and below the waterline. They study the leviathans, map the ocean currents, and seek to understand the magical storms that protect the archipelago from invasion.'
                }
            ],
            trade: 'The Shattered Isles export rare pearls, deep-sea shells, storm-glass (a magical substance harvested from lightning strikes), and potent alchemical reagents drawn from deep-sea organisms. The Maritime Jade Route connects them to Aurelion and Verdantis. Islander sailors are in high demand as navigators aboard merchant vessels from other lands.',
            mythology: 'The Drowned God\'s Maw is the most feared and revered site in the archipelago. It is a permanent whirlpool at the center of the isles, said to be the gateway to an underwater kingdom. The Islanders believe that their ancestors drowned the Drowned God in a great war before the Sundering, and that his thrashing body created the whirlpool. Offerings are cast into the Maw monthly to keep him sleeping.',
            artifacts: [
                {
                    icon: '🐚',
                    name: 'The Tidespire Conch',
                    desc: 'A massive conch shell that, when blown, can calm storms, summon tidal waves, or carry a voice across a thousand miles of ocean. It is used only by the Speaker of Tides.',
                    origin: 'Found in the deepest trench near the Drowned God\'s Maw'
                },
                {
                    icon: '💎',
                    name: 'The Heart of the Abyss',
                    desc: 'A perfectly spherical black pearl the size of a fist that glows with an inner blue light. It is said to contain the compressed essence of the ocean itself.',
                    origin: 'Retrieved from the bottom of the Maw by the legendary diver Kael Tideborn'
                }
            ],
            eras: {
                1: 'The Shattered Isles did not yet exist — they were part of a vast western continent. The people of this land were powerful mages who delved too deep into the mysteries of the sea.',
                2: 'The Sundering tore the western continent apart in a single day. Thousands drowned, but the survivors adapted, becoming the first storm-sailors. The magical storms that now protect the Isles were born from the cataclysm.',
                3: 'The Islanders have rebuilt into a formidable maritime civilization. Their storm-magic is unmatched, and their navigators are sought after across the world. Trade flourishes along the Maritime Jade Route.',
                4: 'The maelstrom at the heart of the Isles is growing stronger, pulling ships into its depths. The Council of Tides has ordered a mass evacuation of the inner islands, but many refuse to leave their ancestral homes.'
            }
        }
    };

    const ERA_DATA = {
        1: {
            name: 'First Age',
            description: 'The First Age — The world is young. The first civilizations emerge from scattered tribes, guided by primal spirits and ancient pacts. Magic flows freely through the land, and the boundaries between the mortal world and the spirit realm are thin.'
        },
        2: {
            name: 'Age of Flames',
            description: 'The Age of Flames — Great empires rise through war and conquest. The Sundering tears the western continent apart, creating the Shattered Isles. Magic becomes institutionalized, and the first great academies are founded. Dragons are seen in the skies for the last time.'
        },
        3: {
            name: 'Third Dominion',
            description: 'The Third Dominion — Kingdoms rise and fall across the known world. Trade flourishes along ancient routes while old magics stir beneath the earth. The balance of power is maintained by fragile alliances and the ever-present threat of war.'
        },
        4: {
            name: 'The Sundering',
            description: 'The Sundering — Prophecies speak of a coming cataclysm. The Eternal Flame flickers, the forests are dying, and the sea grows restless. Ancient evils stir in forgotten places, and the fate of the world hangs in the balance.'
        }
    };

    /* ═══════════════════════════════════════════════════════════════════════════
       STATE
       ═══════════════════════════════════════════════════════════════════════════ */
    let currentEra = 3;
    let selectedRegion = null;
    let tradeRoutesVisible = true;
    let mythologyVisible = false;
    let mapZoom = 1;
    let mapPanX = 0;
    let mapPanY = 0;
    let isDragging = false;
    let dragStartX, dragStartY, panStartX, panStartY;

    /* ═══════════════════════════════════════════════════════════════════════════
       INITIALIZATION
       ═══════════════════════════════════════════════════════════════════════════ */
    document.addEventListener('DOMContentLoaded', function () {
        createDustParticles();
        initEraSlider();
        initRegionClicks();
        initCityClicks();
        initTradeRouteToggle();
        initMythologyToggle();
        initZoomControls();
        initSearch();
        initAmbientToggle();
        initMapDrag();
        initLegendHover();
        initCalendar();
        updateEraDisplay();
    });

    /* ═══════════════════════════════════════════════════════════════════════════
       DUST PARTICLES
       ═══════════════════════════════════════════════════════════════════════════ */
    function createDustParticles() {
        const container = document.getElementById('dust-particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';
            particle.style.width = (1 + Math.random() * 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = 0.2 + Math.random() * 0.4;
            container.appendChild(particle);
        }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       ERA SLIDER
       ═══════════════════════════════════════════════════════════════════════════ */
    function initEraSlider() {
        const slider = document.getElementById('era-slider');
        const labels = document.querySelectorAll('.era-label');

        slider.addEventListener('input', function () {
            currentEra = parseInt(this.value);
            updateEraDisplay();
        });

        labels.forEach(function (label) {
            label.addEventListener('click', function () {
                currentEra = parseInt(this.dataset.era);
                slider.value = currentEra;
                updateEraDisplay();
            });
        });
    }

    function updateEraDisplay() {
        const labels = document.querySelectorAll('.era-label');
        const description = document.getElementById('era-description');
        const eraData = ERA_DATA[currentEra];

        labels.forEach(function (label) {
            label.classList.toggle('active', parseInt(label.dataset.era) === currentEra);
        });

        if (eraData) {
            description.textContent = eraData.description;
        }

        // Update era descriptions in lore panel if open
        const eraText = document.getElementById('lore-eras');
        if (selectedRegion && eraText) {
            const region = REGIONS_DATA[selectedRegion];
            if (region && region.eras) {
                eraText.innerHTML = '<p>' + (region.eras[currentEra] || 'No records for this era.') + '</p>';
            }
        }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       REGION CLICKS
       ═══════════════════════════════════════════════════════════════════════════ */
    function initRegionClicks() {
        const regions = document.querySelectorAll('.region');
        regions.forEach(function (region) {
            region.addEventListener('click', function (e) {
                e.stopPropagation();
                const regionId = this.dataset.region;
                selectRegion(regionId);
            });

            // Tooltip on hover
            region.addEventListener('mouseenter', function (e) {
                const regionId = this.dataset.region;
                const data = REGIONS_DATA[regionId];
                if (data) {
                    showTooltip(data.name + ' — ' + data.title, e);
                }
            });

            region.addEventListener('mousemove', function (e) {
                moveTooltip(e);
            });

            region.addEventListener('mouseleave', function () {
                hideTooltip();
            });
        });
    }

    function initCityClicks() {
        const markers = document.querySelectorAll('.city-marker');
        markers.forEach(function (marker) {
            marker.addEventListener('click', function (e) {
                e.stopPropagation();
                const cityId = this.dataset.city;
                const regionId = this.closest('.region').dataset.region;
                selectRegion(regionId, cityId);
            });

            marker.addEventListener('mouseenter', function (e) {
                const regionId = this.closest('.region').dataset.region;
                const region = REGIONS_DATA[regionId];
                if (region) {
                    const city = region.cities.find(function (c) { return c.name.toLowerCase().replace(/\s+/g, '-') === cityId; });
                    if (city) {
                        showTooltip(city.name + ' (' + city.type + ')', e);
                    }
                }
            });

            marker.addEventListener('mousemove', function (e) {
                moveTooltip(e);
            });

            marker.addEventListener('mouseleave', function () {
                hideTooltip();
            });
        });
    }

    function selectRegion(regionId, scrollToCity) {
        // Deselect previous
        document.querySelectorAll('.region.selected').forEach(function (r) {
            r.classList.remove('selected');
        });

        // Select new
        var regionEl = document.getElementById('region-' + regionId);
        if (regionEl) {
            regionEl.classList.add('selected');
        }

        selectedRegion = regionId;
        var data = REGIONS_DATA[regionId];
        if (!data) return;

        // Show lore panel
        var loreActive = document.getElementById('lore-active');
        var loreDefault = document.getElementById('lore-default');
        loreDefault.style.display = 'none';
        loreActive.style.display = 'flex';

        // Header
        document.getElementById('lore-header-icon').textContent = data.icon;
        document.getElementById('lore-region-name').textContent = data.name;
        document.getElementById('lore-region-title').textContent = data.title;

        // Chronicle
        document.getElementById('lore-chronicle').innerHTML = '<p>' + data.chronicle + '</p>';

        // Cities
        var citiesContainer = document.getElementById('lore-cities');
        citiesContainer.innerHTML = '';
        data.cities.forEach(function (city) {
            var cityId = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            var isSelected = scrollToCity === cityId;
            var card = document.createElement('div');
            card.className = 'city-card' + (isSelected ? ' city-card-highlight' : '');
            card.innerHTML =
                '<div class="city-name">' + city.name + '</div>' +
                '<div class="city-type">' + city.type + '</div>' +
                '<div class="city-desc">' + city.desc + '</div>';
            citiesContainer.appendChild(card);
        });

        // Trade
        document.getElementById('lore-trade').innerHTML = '<p>' + data.trade + '</p>';

        // Mythology
        document.getElementById('lore-mythology').innerHTML = '<p>' + data.mythology + '</p>';

        // Artifacts
        var artifactsContainer = document.getElementById('lore-artifacts');
        artifactsContainer.innerHTML = '';
        data.artifacts.forEach(function (artifact) {
            var card = document.createElement('div');
            card.className = 'artifact-card';
            card.innerHTML =
                '<div class="artifact-icon">' + artifact.icon + '</div>' +
                '<div class="artifact-info">' +
                '<h4>' + artifact.name + '</h4>' +
                '<p>' + artifact.desc + '</p>' +
                '<div class="artifact-origin">' + artifact.origin + '</div>' +
                '</div>';
            artifactsContainer.appendChild(card);
        });

        // Era Variations
        document.getElementById('lore-eras').innerHTML = '<p>' + (data.eras[currentEra] || 'No records for this era.') + '</p>';

        // Stats
        document.getElementById('stat-pop').textContent = data.population;
        document.getElementById('stat-wealth').textContent = data.wealth;
        document.getElementById('stat-military').textContent = data.military;
        document.getElementById('stat-magic').textContent = data.magic;

        // Scroll to top
        document.getElementById('lore-scroll').scrollTop = 0;

        // Highlight matching trade routes
        highlightTradeRoutes(regionId);
    }

    function highlightTradeRoutes(regionId) {
        // Remove previous highlights
        document.querySelectorAll('.trade-route.visible').forEach(function (r) {
            r.classList.remove('visible');
        });

        var routeMap = {
            valthorin: ['amber'],
            aurelion: ['spice', 'jade'],
            selenmoor: ['silk'],
            kethara: ['spice', 'silk'],
            drakthar: ['spice', 'amber'],
            lyrian: ['amber'],
            verdantis: ['silk', 'jade'],
            'shattered-isles': ['jade']
        };

        var routes = routeMap[regionId] || [];
        routes.forEach(function (routeId) {
            var el = document.querySelector('.trade-route[data-route="' + routeId + '"]');
            if (el) el.classList.add('visible');
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       TOOLTIP
       ═══════════════════════════════════════════════════════════════════════════ */
    function showTooltip(text, e) {
        var tooltip = document.getElementById('tooltip');
        tooltip.textContent = text;
        tooltip.classList.add('visible');
        moveTooltip(e);
    }

    function moveTooltip(e) {
        var tooltip = document.getElementById('tooltip');
        var x = e.clientX + 15;
        var y = e.clientY - 10;
        // Keep within viewport
        if (x + 220 > window.innerWidth) x = e.clientX - 230;
        if (y + 40 > window.innerHeight) y = e.clientY - 50;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    function hideTooltip() {
        document.getElementById('tooltip').classList.remove('visible');
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       LORE PANEL CLOSE
       ═══════════════════════════════════════════════════════════════════════════ */
    document.getElementById('lore-close-btn').addEventListener('click', function () {
        document.getElementById('lore-active').style.display = 'none';
        document.getElementById('lore-default').style.display = '';
        document.querySelectorAll('.region.selected').forEach(function (r) {
            r.classList.remove('selected');
        });
        document.querySelectorAll('.trade-route.visible').forEach(function (r) {
            r.classList.remove('visible');
        });
        selectedRegion = null;
    });

    /* ═══════════════════════════════════════════════════════════════════════════
       TRADE ROUTES TOGGLE
       ═══════════════════════════════════════════════════════════════════════════ */
    function initTradeRouteToggle() {
        var btn = document.getElementById('btn-trade-routes');
        var routes = document.querySelectorAll('.trade-route');

        btn.addEventListener('click', function () {
            tradeRoutesVisible = !tradeRoutesVisible;
            this.classList.toggle('active', tradeRoutesVisible);

            routes.forEach(function (route) {
                if (tradeRoutesVisible) {
                    route.style.display = '';
                } else {
                    route.style.display = 'none';
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       MYTHOLOGY TOGGLE
       ═══════════════════════════════════════════════════════════════════════════ */
    function initMythologyToggle() {
        var btn = document.getElementById('btn-mythology');
        var layer = document.getElementById('mythology-layer');

        btn.addEventListener('click', function () {
            mythologyVisible = !mythologyVisible;
            this.classList.toggle('active', mythologyVisible);
            layer.classList.toggle('visible', mythologyVisible);
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       ZOOM & PAN
       ═══════════════════════════════════════════════════════════════════════════ */
    function initZoomControls() {
        document.getElementById('btn-zoom-in').addEventListener('click', function () {
            mapZoom = Math.min(mapZoom + 0.2, 3);
            updateMapTransform();
        });

        document.getElementById('btn-zoom-out').addEventListener('click', function () {
            mapZoom = Math.max(mapZoom - 0.2, 0.5);
            updateMapTransform();
        });

        document.getElementById('btn-reset').addEventListener('click', function () {
            mapZoom = 1;
            mapPanX = 0;
            mapPanY = 0;
            updateMapTransform();
        });

        // Mouse wheel zoom
        var mapContainer = document.getElementById('map-container');
        mapContainer.addEventListener('wheel', function (e) {
            e.preventDefault();
            var delta = e.deltaY > 0 ? -0.1 : 0.1;
            mapZoom = Math.min(Math.max(mapZoom + delta, 0.5), 3);
            updateMapTransform();
        }, { passive: false });
    }

    function initMapDrag() {
        var svg = document.getElementById('world-map');

        svg.addEventListener('mousedown', function (e) {
            if (e.button === 0) {
                isDragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                panStartX = mapPanX;
                panStartY = mapPanY;
                svg.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            var dx = e.clientX - dragStartX;
            var dy = e.clientY - dragStartY;
            mapPanX = panStartX + dx;
            mapPanY = panStartY + dy;
            updateMapTransform();
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                document.getElementById('world-map').style.cursor = 'grab';
            }
        });
    }

    function updateMapTransform() {
        var svg = document.getElementById('world-map');
        svg.style.transform = 'translate(' + mapPanX + 'px, ' + mapPanY + 'px) scale(' + mapZoom + ')';
        svg.style.transformOrigin = 'center center';
        svg.style.transition = isDragging ? 'none' : 'transform 0.3s ease';
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       SEARCH
       ═══════════════════════════════════════════════════════════════════════════ */
    function initSearch() {
        var input = document.getElementById('search-input');
        var btn = document.getElementById('search-btn');

        function performSearch() {
            var query = input.value.trim().toLowerCase();
            if (!query) return;

            // Search in region names and city names
            for (var regionId in REGIONS_DATA) {
                var data = REGIONS_DATA[regionId];
                if (data.name.toLowerCase().indexOf(query) !== -1 || data.title.toLowerCase().indexOf(query) !== -1) {
                    selectRegion(regionId);
                    input.value = '';
                    return;
                }
                for (var i = 0; i < data.cities.length; i++) {
                    var city = data.cities[i];
                    if (city.name.toLowerCase().indexOf(query) !== -1 || city.type.toLowerCase().indexOf(query) !== -1) {
                        var cityId = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        selectRegion(regionId, cityId);
                        input.value = '';
                        return;
                    }
                }
            }

            // Search in lore text
            for (var regionId2 in REGIONS_DATA) {
                var d = REGIONS_DATA[regionId2];
                if (d.chronicle.toLowerCase().indexOf(query) !== -1 || d.trade.toLowerCase().indexOf(query) !== -1 || d.mythology.toLowerCase().indexOf(query) !== -1) {
                    selectRegion(regionId2);
                    input.value = '';
                    return;
                }
            }

            // No results
            input.value = '';
            input.placeholder = 'No results found...';
            setTimeout(function () {
                input.placeholder = 'Search regions, cities, lore...';
            }, 2000);
        }

        btn.addEventListener('click', performSearch);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') performSearch();
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       LEGEND HOVER
       ═══════════════════════════════════════════════════════════════════════════ */
    function initLegendHover() {
        var swatches = document.querySelectorAll('.legend-item');
        swatches.forEach(function (item) {
            item.addEventListener('mouseenter', function () {
                var text = this.querySelector('span').textContent;
                var tooltip = document.getElementById('tooltip');
                tooltip.textContent = text;
                tooltip.classList.add('visible');

                var rect = this.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2 - 60) + 'px';
                tooltip.style.top = (rect.top - 35) + 'px';
            });

            item.addEventListener('mouseleave', hideTooltip);
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       CELESTIAL CALENDAR
       ═══════════════════════════════════════════════════════════════════════════ */
    function initCalendar() {
        var day = 17;
        var months = [
            'Moon of Asharan', 'Moon of Kethar', 'Moon of Valthor',
            'Moon of Selene', 'Moon of Drakon', 'Moon of Lyria',
            'Moon of Verdant', 'Moon of Tides', 'Moon of Ember',
            'Moon of Frost', 'Moon of Bloom', 'Moon of Storm'
        ];
        var currentMonthIdx = 0;

        setInterval(function () {
            day++;
            if (day > 30) {
                day = 1;
                currentMonthIdx = (currentMonthIdx + 1) % months.length;
            }
            document.getElementById('calendar-day').textContent = day;
            document.getElementById('calendar-month').textContent = months[currentMonthIdx];
        }, 8000);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       AMBIENT SOUND TOGGLE (Visual only — no actual audio files)
       ═══════════════════════════════════════════════════════════════════════════ */
    function initAmbientToggle() {
        var btn = document.getElementById('ambient-toggle');
        var icon = document.getElementById('ambient-icon');
        var playing = false;

        btn.addEventListener('click', function () {
            playing = !playing;
            this.classList.toggle('playing', playing);

            if (playing) {
                icon.innerHTML =
                    '<path d="M12 3v9l4-4"/><path d="M12 3v9l-4-4"/>' +
                    '<path d="M12 13v7"/><path d="M8 10v6"/><path d="M16 10v6"/>' +
                    '<line x1="3" y1="7" x2="9" y2="12"/><line x1="3" y1="17" x2="9" y2="12"/>' +
                    '<line x1="15" y1="7" x2="21" y2="12"/><line x1="15" y1="17" x2="21" y2="12"/>';
                // Create floating sound wave indicators
                createSoundWaves();
            } else {
                icon.innerHTML =
                    '<path d="M12 3v9l4-4"/>' +
                    '<path d="M12 3v9l-4-4"/>' +
                    '<path d="M12 13v7"/>' +
                    '<path d="M8 10v6"/>' +
                    '<path d="M16 10v6"/>';
                removeSoundWaves();
            }
        });
    }

    var soundWaves = [];

    function createSoundWaves() {
        var btn = document.getElementById('ambient-toggle');
        for (var i = 0; i < 5; i++) {
            (function (idx) {
                var wave = document.createElement('div');
                wave.className = 'sound-wave';
                wave.style.animationDelay = (idx * 0.4) + 's';
                btn.appendChild(wave);
                soundWaves.push(wave);

                // Add style dynamically
                if (!document.getElementById('sound-wave-style')) {
                    var style = document.createElement('style');
                    style.id = 'sound-wave-style';
                    style.textContent =
                        '.sound-wave { position: absolute; width: 40px; height: 40px; border: 2px solid var(--color-gold); border-radius: 50%; opacity: 0; animation: sound-pulse 2s infinite; pointer-events: none; top: 50%; left: 50%; transform: translate(-50%, -50%); } ' +
                        '@keyframes sound-pulse { 0% { width: 40px; height: 40px; opacity: 0.6; } 100% { width: 120px; height: 120px; opacity: 0; } }';
                    document.head.appendChild(style);
                }
            })(i);
        }
    }

    function removeSoundWaves() {
        soundWaves.forEach(function (wave) {
            if (wave.parentNode) wave.parentNode.removeChild(wave);
        });
        soundWaves = [];
        var style = document.getElementById('sound-wave-style');
        if (style) style.parentNode.removeChild(style);
    }

})();