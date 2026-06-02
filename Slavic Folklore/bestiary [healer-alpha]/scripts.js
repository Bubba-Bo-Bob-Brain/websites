/* ============================================
   BESTIARY OF THE SLAVIC WILDS
   JavaScript — Interactive Tome Functionality
   ============================================ */

// ==========================================
// CREATURE DATA - Complete Lore & Details
// ==========================================
const creatureData = {
    leshy: {
        name: "Leshy",
        cyrillic: "Лѣ́сной",
        type: "Forest Spirit • Lord of the Woods",
        danger: 3,
        category: "forest",
        description: `The Leshy is the supreme sovereign of the forest realm, a shapeshifting spirit whose domain encompasses every tree, creature, and shadow within his woodland kingdom. Ancient Slavic peoples understood that the forest belonged not to them, but to him — and they treated his domain with corresponding respect and fear. He is neither wholly good nor evil, but capricious, like nature itself. A Leshy may guide a lost traveler to safety one day, only to lead another endlessly astray the next, simply because the latter failed to leave an offering of bread and salt at the forest's edge.`,
        appearance: `In his true form, the Leshy appears as a towering figure, impossibly tall, with a body that seems woven from living wood and green moss. His skin is rough bark, and his beard is tangled with leaves, twigs, and sometimes small creatures nesting within. His eyes glow with an eerie green luminescence, visible from great distances in the dark forest. He has no clear nose — only a slight protrusion in his bark-face — and his mouth, when opened, reveals rows of wooden splinters instead of teeth. His hands end in gnarled roots that can dig into earth or grip like iron. He often appears as a great pine or oak when he wishes to remain hidden, indistinguishable from any other tree to mortal eyes.`,
        habitat: `The Leshy dwells in the deepest, oldest parts of the forest, where the canopy is so thick that sunlight barely reaches the ground. He favors ancient groves, forest clearings with standing stones, and the hollow interiors of enormous oaks. His court is attended by woodland creatures — wolves serve as his hounds, bears as his advisors, and crows as his spies. He can be found at the boundaries of the forest, where the trees grow densest and the path disappears into shadow. Some say he lives in a house made of living wood that walks on chicken legs, though this may be confusion with Baba Yaga's dwelling.`,
        encounters: `Those who enter the forest must observe certain protocols to avoid the Leshy's displeasure. One must never whistle in the forest, for the Leshy will follow the sound and lead one astray. One must never take more than is needed from the forest, and always leave offerings. A person who becomes lost in the woods has likely offended the Leshy. He may appear as a friendly woodsman, offering guidance, only to lead the traveler in circles until dawn. His laughter sounds like wind through the pines, and his anger manifests as sudden, violent storms that seem localized to his domain. Children are especially vulnerable — the Leshy is known to swap human children for changelings, or to take them entirely into his realm.`,
        protection: `To appease the Leshy, one should carry bread and salt when traveling through deep forest, leaving a portion at the base of the largest tree. Tying knots in cloth and hanging them from branches is said to confuse and delay him if he pursues. The sign of the cross is effective, as is turning one's clothing inside out — the Leshy, like many spirits, is confounded by such reversals. Speaking his name directly is dangerous; instead, one should address him as "Grandfather of the Forest" or "Master of the Wood." Silver bullets are said to wound him, though not kill him. The Leshy cannot cross running water, and he weakens in winter, sometimes appearing as a shivering old man begging for warmth and clothing.`
    },
    rusalka: {
        name: "Rusalka",
        cyrillic: "Руса́лка",
        type: "Water Spirit • The Drowned Maiden",
        danger: 4,
        category: "water",
        description: `The Rusalka is a haunting spirit of Slavic waters, born from the souls of young women who perished untimely or unnatural deaths — drowned maidens, suicides by water, or those buried without proper rites. Unlike the beautiful mermaids of Western tradition, the Rusalka is deeply dangerous, driven by an insatiable hunger for the living and an eternal envy of those who still draw breath. During Rusalka Week, the days between Trinity Sunday and Pentecost, they emerge from the depths in great numbers, dancing in rings on moonlit shores and combing their impossibly long hair with bone combs.`,
        appearance: `The Rusalka appears as a young woman of terrible beauty, with skin that has the pallor of one long drowned — white as bone with a faint bluish tinge. Her hair flows endlessly, green as pondweed or black as the midnight water, often filled with small fish and water insects that swim through it as if it were their natural element. Her eyes are the most unsettling feature: they are either completely white, like the belly of a fish, or they glow with an otherworldly blue-green luminescence. She wears either a long white shift that clings to her form as if perpetually wet, or she appears entirely naked, her modesty no longer of concern to one beyond death. Her fingers are slightly webbed, and her nails grow long and sharp.`,
        habitat: `Rusalki dwell in rivers, lakes, ponds, and occasionally the sea. They prefer the deepest, darkest waters, where they sit upon the bottom braiding the hair of the drowned into nets and blankets. They emerge at night, especially during the full moon, to dance in circles on the banks and in nearby fields, leaving the grass flattened and sour where they have been. The most dangerous Rusalki inhabit the waters near settlements, where they can lure young men to their deaths. They particularly favor places where someone has drowned — they are drawn to such locations as both memorial and hunting ground.`,
        encounters: `A Rusalka encounter typically begins with beautiful singing heard near water at dusk. The melody is irresistible to those who hear it, drawing them closer and closer to the water's edge. Those who see a Rusalka combing her hair are doomed if they cannot look away. She will ask them to comb her hair for her — and those who do are pulled into the water, drowned, and join her in her eternal existence. Rusalki are known to tickle their victims to death, their cold fingers finding the most sensitive spots while their laughter echoes across the water. During Rusalka Week, they may visit houses, sitting on the roof rafters and swinging until the residents give them offerings of food and cloth.`,
        protection: `Protection from Rusalki involves several practices. Garlic is a powerful ward — carrying it or hanging it in windows repels them. Rowan branches are also effective, as is the sign of the cross made over water before entering it. One should never swim alone at night, never answer a voice from the water, and never comb one's hair near a river after dark. During Rusalka Week, doors should be barred, and no laundry should be hung outside, as the Rusalki may steal the clothes and use them to disguise themselves. If a Rusalka visits a house, one must offer her a distaff with flax — she is compelled to spin, and while she is distracted, she can be driven away with prayers and the sign of the cross.`
    },
    "baba-yaga": {
        name: "Baba Yaga",
        cyrillic: "Баба Я́га",
        type: "Witch • The Bone-Legged",
        danger: 5,
        category: "dark",
        description: `Baba Yaga is perhaps the most famous and feared figure in all Slavic folklore — an ancient witch of terrible power who dwells at the boundaries between the worlds of the living and the dead. She is simultaneously villain and trickster, sometimes helper and sometimes destroyer, her motivations as inscrutable as the deep forest itself. She is the Archetypal Crone, the Guardian of the Water of Life and Death, and she tests all who seek her wisdom. Heroes must prove themselves worthy through cleverness and courage, for Baba Yaga devours the unworthy and rewards only those who demonstrate respect and wit.`,
        appearance: `Baba Yaga is an impossibly ancient woman, bent and gnarled like the trees of her forest. Her face is a landscape of wrinkles, her nose long and hooked like a bird's beak, her chin so prominent it nearly meets her nose. Her eyes burn with an eerie green or yellow fire that can see into a person's soul. Her body is simultaneously skeletal and powerful — she possesses a strength that belies her ancient appearance. Her hair is wild and white as bone, escaping from beneath a tattered headscarf. Her most distinctive feature is her mode of transportation: she flies through the air in a giant iron mortar, gripping the pestle with one hand and sweeping away her tracks with a birch broom. Her legs, when revealed, are said to be made of bone — hence her epithet "Bone-Legged."`,
        habitat: `Baba Yaga's dwelling is as famous as she: a hut that stands upon chicken legs, enormous bird legs that can stomp and turn and walk the house through the forest. The hut is surrounded by a fence made of human bones, with skulls threaded upon the posts, their empty eye-sockets glowing with an eerie light that serves as lanterns. The hut has a mind of its own and must be addressed with proper formulas before it will allow entry — turning its back to the visitor and lowering its porch only when commanded correctly. Inside, the hut is spacious and often contains three rooms: one with a spinning wheel, one with a bed of feathers, and one with a great stove that Baba Yaga uses to cook her victims. The forest surrounding her hut is utterly dark and filled with the bones of those who failed her tests.`,
        encounters: `Encounters with Baba Yaga typically occur when a hero has been sent on an impossible quest — to fetch the Water of Life, to rescue a maiden, or to learn some hidden knowledge. Baba Yaga may help, but only if the hero demonstrates proper respect and cleverness. She often sets tasks: tending her house, cooking for her, sorting piles of mixed grain and seeds overnight. Those who fail are eaten. She is attended by invisible servants and by three pairs of hands that emerge from the walls. She can speak to animals and often tests whether a visitor has been speaking with her other selves — there are said to be three Baba Yagas, or one Baba Yaga with three aspects: the Maiden, the Mother, and the Crone.`,
        protection: `Protection against Baba Yaga is difficult, for she is older than most Christian symbols of protection. The old methods involve politeness and cleverness — addressing her respectfully, performing whatever tasks she sets with skill and industry. One should never eat food offered by her without caution, and one should never let her know you fear her. The sign of the cross is somewhat effective, and certain plants — particularly alder, birch, and wormwood — have protective properties. Offering her milk or bread may appease her. The most effective protection is to understand that Baba Yaga is not purely evil — she is a force of nature, a test that heroes must pass. Those who approach her with pure intentions and clever minds may find her a powerful ally.`
    },
    zmey: {
        name: "Zmey Gorynych",
        cyrillic: "Змей Горы́ныч",
        type: "Dragon • Three-Headed Flame",
        danger: 5,
        category: "dark",
        description: `Zmey Gorynych is the great dragon of Slavic legend, a terror of the skies whose three heads breathe rivers of fire that turn forests to ash and cities to cinders. His name combines "Zmey" (serpent/dragon) with "Gorynych" (from "gora" — mountain, or "goret" — to burn), suggesting both his immense size and his fiery nature. He is the supreme aerial threat of the Slavic world, a hoarder of treasure and stealer of princesses, whose defeat requires the greatest heroes and often divine intervention. Unlike Western dragons, the Zmey is sometimes portrayed as intelligent and capable of speech, even of taking human form.`,
        appearance: `Zmey Gorynych is immense — his body is covered in scales of iron or brass that no ordinary weapon can pierce. He has three heads, each crowned with horns, and each capable of independent thought and speech. His eyes burn like coals, and from his nostrils pour smoke and sparks. His wings are vast, casting shadows that can darken entire villages, and his tail ends in a club or spiked ball of bone. When he opens all three mouths to breathe fire, the resulting conflagration can be seen from miles away. Some legends say he has seven or twelve heads, but three is the most common number. His belly is sometimes described as soft — the one vulnerable spot that heroes must target. He is sometimes depicted with a mane like smoke or flame, and his roar shakes the very mountains from which his name derives.`,
        habitat: `Zmey Gorynych makes his lair in mountain caves, often deep within inaccessible peaks where he guards immense hoards of treasure plundered from the cities he has destroyed. Some legends place his lair in underground caverns beneath the mountains, connected to the surface by tunnels through which fire erupts like volcanic vents. He ranges far from his lair to hunt, flying over forests and farmlands, demanding tribute of maidens and cattle from nearby settlements. Some stories place him on islands in the sea, or in the underworld itself, suggesting he is a creature that moves between realms.`,
        encounters: `An encounter with Zmey Gorynych typically begins with the appearance of smoke on the horizon, then the shadow of vast wings blotting out the sun. He demands tribute — the most beautiful maiden in the land, or else he will burn everything to cinders. Heroes who face him must contend with his fiery breath, his impenetrable scales, and his threefold intelligence. The battle is epic and often requires the hero to find his soft belly, or to use magical weapons. Some legends tell of heroes who could speak with the dragon, who negotiated or made pacts. In some stories, Zmey Gorynych can take human form and walk among mortals, seducing women and siring children who inherit his fiery nature.`,
        protection: `Protection against Zmey Gorynych is nearly impossible for ordinary people — one must flee or submit to his demands. Heroes who would face him need magical weapons, often obtained through quests to the ends of the earth. Some legends speak of herbs that, when placed in water, can extinguish his fire. Others describe magical shields that reflect his flames back upon him. The hero Dobrynya Nikitich, the most famous dragon-slayer, used cunning and skill to defeat Zmey Gorynych, sometimes with the help of the hero's horse, which could speak and advise him. Prayers to Saint George, who shares dragon-slaying attributes across cultures, are also said to provide protection.`
    },
    vodyanoy: {
        name: "Vodyanoy",
        cyrillic: "Водяно́й",
        type: "Water Spirit • The River Father",
        danger: 3,
        category: "water",
        description: `The Vodyanoy, or "Water Father," is the male counterpart to the Rusalka and the supreme ruler of freshwater domains. He is an ancient and capricious spirit, lord of rivers, lakes, ponds, and marshes. Unlike the tragically beautiful Rusalka, the Vodyanoy is a creature of raw, primal power — part man, part fish, part amphibian — who demands respect from all who use his waters. Millers, fishermen, and boatmen know him best, for they must negotiate with him constantly to ply their trades without disaster. He can be a benefactor, granting abundant catches, or a destroyer, breaking dams and drowning the unwary.`,
        appearance: `The Vodyanoy appears as a massive, bloated figure, his skin the pale greenish-white of things long submerged. His face is wide and froglike, with enormous bulging eyes that glow with a sickly green luminescence. His mouth is wide and lipless, filled with teeth like broken shells, and from his chin trails a beard of living waterweeds and algae, sometimes with small fish swimming through it. His fingers are webbed and end in sharp claws. His body trails off into a fish's tail, or sometimes he appears entirely humanoid, dressed in a coat made of lily pads and moss. He wears a crown of cattails and reeds, and water drips constantly from every part of him. When he is angry, his eyes glow brighter and the water around him begins to churn and boil.`,
        habitat: `The Vodyanoy lives in the deepest part of any body of freshwater, though he particularly favors old mills, deep river pools, and marshy lakes. He dwells at the bottom in a palace made of river mud and stones, furnished with the treasures of the drowned — sunken boats, lost coins, and the bones of those he has claimed. His court includes fish of enormous size, water snakes, and the souls of those who have drowned. He is most active at night, especially during the full moon, when he rises to the surface to swim and to call his subjects to him. The sound of his voice is said to be the bubbling of deep water, and his laughter is the sound of underwater springs.`,
        encounters: `Those who work on or near water must be wary of the Vodyanoy. He is jealous of his domain and resentful of those who take fish or use the water without his permission. Fishermen who catch too many fish may find their nets torn, their boats capsized, or themselves pulled beneath the surface. Millers must be especially careful — the Vodyanoy can break mill dams and flood the surrounding land. He is known to drag people underwater by their legs, particularly those who swim at night or who mock his existence. Children who play too near deep water may be lured in by the sight of beautiful fish that are actually his servants. Those who see the Vodyanoy himself — sitting on the bank, combing his beard, or rising from the water — are in grave danger.`,
        protection: `To placate the Vodyanoy, fishermen traditionally threw the first catch back into the water with a prayer. Millers left offerings of bread and salt at the mill dam. Before building near water, a chicken was sacrificed and its blood spilled into the river. The sign of the cross is effective, as is iron — the Vodyanoy fears metal, and a nail driven into a mill wheel will drive him away. Those who are dragged underwater can sometimes be saved by finding and destroying a lock of his beard, which, when cut, forces him to release his victim. Speaking respectfully of the water and asking permission before swimming is also recommended. Some traditions hold that the Vodyanoy can be bound to serve a person, but this requires great knowledge and even greater risk.`
    },
    domovoy: {
        name: "Domovoy",
        cyrillic: "Домово́й",
        type: "Household Spirit • Hearth Keeper",
        danger: 1,
        category: "household",
        description: `The Domovoy is the most beloved and essential of Slavic household spirits — a guardian and benefactor who dwells in every home, ensuring the prosperity and safety of the family within. Unlike the dangerous forest and water spirits, the Domovoy is generally friendly and protective, though he requires respect and proper treatment to maintain his goodwill. He is the spirit of the home itself, and his presence is what makes a house truly a home. Without a Domovoy, a household will fall into disarray — livestock will sicken, children will cry without cease, and misfortune will follow every endeavor. Moving to a new house requires great care to either bring one's Domovoy along or to invite a new one to take up residence.`,
        appearance: `The Domovoy typically appears as a small man, no larger than a child, covered in thick grey or white fur. His face is kindly but strange, with large, wise eyes that glow faintly in the darkness. He has a flat nose, a wide mouth, and a long beard that he braids when he is content. His ears are slightly pointed, and his hands, though small, are surprisingly strong. He wears simple clothing — a shirt and trousers — or sometimes nothing but his fur. He is often heard but not seen, his presence indicated by knocking, scratching behind walls, or the soft sound of footsteps when no one is there. When he reveals himself, he typically appears near the stove, which is his preferred dwelling place within the house.`,
        habitat: `The Domovoy lives in the home, specifically behind or near the stove, which in traditional Slavic houses was the center of warmth and cooking. He may also dwell under the threshold, in the attic, or in the cellar. He follows the family — if they move, he moves with them, carried in a special vessel or coaxed along by the head of the household. New houses must be invited to attract a Domovoy; this is done through prayer and offerings. Abandoned houses lose their Domovoy, and houses built without proper rites may never acquire one. The Domovoy is particularly associated with the family's prosperity, and his presence or absence directly affects the household's fortunes.`,
        encounters: `Encounters with the Domovoy are usually gentle and helpful. He might knock to warn of danger, rustle to indicate disapproval, or pull hair gently to wake someone who is in danger of oversleeping. He plays with children at night, bouncing them gently on his knee. He feeds the livestock and ensures that the household prospers. However, if offended, the Domovoy can become a terror — pulling hair violently, pinching sleepers, breaking objects, and causing chaos. He is offended by laziness, dishonesty, and especially by women who gossip or fight with their husbands. A Domovoy who is angry will make his displeasure known through a symphony of noises — knocking, scratching, moving objects — until the offense is rectified.`,
        protection: `To keep the Domovoy happy, one must maintain a clean, orderly house and treat all family members with respect. Offerings of bread, milk, and salt are left near the stove. On moving day, the head of the household should invite the Domovoy to come along, perhaps by carrying a small loaf of bread in a special bag. If a new house needs a Domovoy, one can coax one from a relative's house by offering a gift. The Domovoy should never be addressed directly by name — this is considered unlucky. Instead, one should speak to him as "Grandfather" or "Master of the House." He should never be thanked directly, as this embarrasses him; instead, one should praise the household's good fortune in his presence.`
    },
    kikimora: {
        name: "Kikimora",
        cyrillic: "Кики́мора",
        type: "Household Spirit • The Unseen Knitter",
        danger: 2,
        category: "household",
        description: `The Kikimora is the dark counterpart to the Domovoy — a female household spirit who, unlike her beneficial housemate, brings only trouble and distress. She is the spirit of domestic disorder, the whisperer of discontent, and the eternal knitter whose endless spinning produces nothing but tangles and misfortune. While the Domovoy cares for the house as a whole, the Kikimora focuses specifically on the domestic arts — spinning, weaving, and sewing — and she will torment any woman she considers a poor housekeeper. She may also live in the bathhouse, the outhouse, or the cellar, areas associated with both cleanliness and danger.`,
        appearance: `The Kikimora appears as a tiny, hunched woman — even smaller than the Domovoy — with thin, spidery limbs and fingers that never stop moving. Her face is childlike but wrong, with too-wide eyes that stare unblinkingly and a smile that stretches too far, revealing too many teeth. Her hair is stringy and often unwashed, hanging in tangles around her face. She wears a simple shift or nightgown, and her feet are either chicken-like claws or entirely absent — she hovers slightly above the ground. She is always carrying her spinning or knitting, and the sound of her endless work — the click of needles, the whir of a spindle — is often the first indication of her presence. She is sometimes described as having a hollow back, like a leather bag, which she fills with stolen goods.`,
        habitat: `The Kikimora lives in the house but prefers the less pleasant areas — behind the stove alongside the Domovoy (with whom she may or may not have a contentious relationship), in the bathhouse, in the cellar, or in the attic. She is particularly associated with the distaff and the spinning wheel, and she will use any that are left unattended. She is more active at night, when she emerges to do her work, tangle the laundry, whisper complaints into the ears of sleeping women, and generally make mischief. In some traditions, the Kikimora of the house and the Kikimora of the bathhouse are separate entities, each with her own territory and sphere of influence.`,
        encounters: `A Kikimora manifests through domestic disturbances — threads that tangle, cloth that tears, food that spoils, and children that cry without cause. She is particularly active during the winter months, when indoor work is at its peak. A woman who finds her spinning mysteriously tangled in the morning has been visited by a Kikimora. She may also appear in dreams, sitting on the sleeper's chest and whispering anxieties and complaints. If a woman sees the Kikimora directly — and the Kikimora does not want to be seen — she will be marked with misfortune. The Kikimora may take a particular dislike to a household member, following her constantly, undoing her work, and whispering insults that only she can hear.`,
        protection: `Protection from the Kikimora involves several practices. One should never leave spinning or weaving unfinished at night — the Kikimora will tangle and ruin it. One should keep the house clean and orderly, as the Kikimora thrives in mess and disorder. Placing a needle in the water will prevent her from using it. If one suspects a Kikimora visit, one should scatter millet seeds on the floor — the Kikimora is compelled to pick them up, and while she is distracted, she can be driven away. The sign of the cross over the spinning wheel before leaving it, and speaking a prayer, will protect the work. Some traditions say that catching the Kikimora and forcing her to work for you is possible, but extremely dangerous.`
    },
    koschei: {
        name: "Koschei the Deathless",
        cyrillic: "Коще́й Бессме́ртный",
        type: "Undead Tyrant • Death Hidden in a Needle",
        danger: 5,
        category: "dark",
        description: `Koschei the Deathless is the ultimate villain of Slavic legend — an immortal tyrant of terrible power whose death is not his own. He is the Archetypal Death Figure, the stealer of maidens, the enemy of heroes, and the embodiment of death that cannot die. His name derives from "kost" — bone — suggesting his skeletal, deathlike nature. Unlike simple monsters, Koschei is intelligent, cunning, and patient, having lived for countless ages and accumulated wisdom and power beyond mortal comprehension. His immortality is both his greatest strength and his fatal weakness, for his death is hidden in a complex series of nested containers that heroes must unravel to defeat him.`,
        appearance: `Koschei appears as a tall, impossibly thin man — so thin that he seems more skeleton than flesh. His face is gaunt and skull-like, with deep-set eyes that burn with a cold, dead light. His skin is stretched tight over his bones, grey and cold as stone. He wears rich but tattered robes of dark colors, and upon his head sits a crown of black iron, sometimes described as made from the bones of the heroes he has slain. His hands are long and bony, with fingers like claws, and his voice is said to sound like the creaking of old bones or the whisper of wind through a graveyard. He is often depicted riding a pale horse or appearing in a chariot of bone. Despite his appearance of extreme age and decay, he possesses immense physical and magical power.`,
        habitat: `Koschei's domain is sometimes described as a far-off kingdom, but more often as a place between worlds — a dark land that can be reached only through magical means. His palace is built of human bones and covered with the skins of the dead. It stands in a dark forest on an island surrounded by the Sea of Fire. Within his domain, time does not flow as it does in the mortal world, and the living cannot long survive without magical protection. His most prized possession, his "death," is hidden on a distant island, buried beneath an oak tree, locked in an iron chest, inside a hare, inside a duck, inside a hare, inside an egg, inside a needle — a nesting puzzle that represents the ultimate test for any hero who would destroy him.`,
        encounters: `Heroes encounter Koschei when he has stolen the maiden they love, or when they have been sent on quests that lead to his domain. He is always a formidable opponent, possessing magical powers that can match or exceed those of any hero. He can shapeshift, create illusions, raise armies of the dead, and command the forces of nature. His most common tactic is to challenge heroes to tests of strength or cunning, with the maiden as the prize. Those who fail are turned to stone or added to his army of the dead. Even when seemingly defeated, Koschei cannot truly die unless his "death" is found and destroyed — he will simply reform, more angry and dangerous than before.`,
        protection: `Protection against Koschei requires magical assistance — heroes who face him alone are doomed. The hero typically receives help from magical animals (a horse that can speak, an eagle that knows all secrets) or from wise women who know Koschei's weakness. To truly destroy Koschei, one must find and destroy his "death": shoot the egg with a silver bullet, or break it with a stone, or pierce it with a special weapon. Some legends say that Koschei can be bound rather than killed, imprisoned in his own realm, or turned to stone with specific enchantments. The hero must never eat or drink in Koschei's domain, for the food is enchanted. Iron, silver, and the names of God are all somewhat effective, but Koschei is ancient and knows many ways around such protections.`
    },
    bereginya: {
        name: "Bereginya",
        cyrillic: "Береги́ня",
        type: "Riverside Spirit • The Guardian",
        danger: 1,
        category: "water",
        description: `The Bereginya is a benevolent water spirit, the positive counterpart to the dangerous Rusalka and the capricious Vodyanoy. Her name derives from "bereg" — bank or shore — and she is the protective spirit of riverbanks, lakeshores, and coastal areas. Unlike most water spirits who seek to harm the living, the Bereginya actively protects travelers, fishermen, and those who live near her waters. She is a guardian and a guide, appearing to those in need and offering assistance. She represents the nurturing aspect of water — the life-giving river, the peaceful lake, the gentle rain — rather than the drowning depths.`,
        appearance: `The Bereginya appears as a woman of serene and gentle beauty, rising from the water as if emerging from a dream. Her hair flows like the current itself, sometimes green as river weeds, sometimes silver as moonlight on water. Her eyes are calm and kind, reflecting the colors of the sky and the surrounding landscape. She wears a dress that seems woven from water itself — flowing, translucent, and constantly shifting in color from blue to green to silver. Her skin has a faint luminescence, and water drops cling to her like jewels. Her hands are gentle and welcoming, often extended toward those she wishes to help. She carries no weapon and wears no crown, though sometimes flowers are woven into her hair. When she submerges, she leaves no splash — only gentle ripples that spread outward in perfect circles.`,
        habitat: `The Bereginya dwells in peaceful waters — calm rivers, still lakes, and gentle streams. She prefers places where the banks are covered with willows and reeds, where the water runs clear and clean, and where people come to fish, draw water, or simply sit and rest. She is particularly associated with places where the land meets the water in harmony — where docks extend over the river, where bridges cross streams, where people gather to wash clothes or bathe. She does not inhabit the dangerous, dark waters favored by the Rusalka, but rather the sunlit shallows and the peaceful middle depths. Her presence is often indicated by the clarity of the water and the abundance of fish in her domain.`,
        encounters: `Encounters with the Bereginya are gentle and reassuring. She may appear to someone standing at the water's edge, offering guidance or warning. To a fisherman, she might indicate where the fish are plentiful. To a traveler, she might warn of danger ahead — a bridge about to collapse, a ford that has become too deep, or bandits waiting on the road. She is particularly protective of children and pregnant women. Those who fall into the water may feel themselves gently pushed to the shore by unseen hands. Her voice is like the babbling of a brook, and her laughter is the sound of water dancing over stones. She sometimes appears in dreams to those who live near her waters, offering warnings or blessings.`,
        protection: `The Bereginya does not need protection, but she appreciates respect and kindness. Those who wish to earn her favor should keep her waters clean, never pollute streams or rivers, and treat the water with reverence. Leaving flowers at the water's edge is a traditional offering. She particularly favors those who help others — rescuing someone from drowning earns her eternal friendship. The Bereginya cannot be commanded or forced to help; she helps freely or not at all. Those who have earned her friendship may find themselves blessed with good fortune, abundant catches, and safe travels on the water. It is said that the Bereginya remembers kindness and repays it many times over, and that she remembers cruelty even longer.`
    }
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const coverPage = document.getElementById('cover');
const openBookBtn = document.getElementById('openBook');
const bestiaryMain = document.getElementById('bestiary');
const firefliesContainer = document.getElementById('fireflies');
const creaturesGrid = document.getElementById('creaturesGrid');
const creatureCards = document.querySelectorAll('.creature-card');
const filterBtns = document.querySelectorAll('.filter-btn');
const creatureModal = document.getElementById('creatureModal');
const modalClose = document.getElementById('modalClose');

// ==========================================
// FIREFLY SYSTEM
// ==========================================
function createFireflies() {
    const count = window.innerWidth < 768 ? 10 : 20;
    
    for (let i = 0; i < count; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        // Random position
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        
        // Random animation timing
        firefly.style.animationDelay = Math.random() * 15 + 's';
        firefly.style.animationDuration = (10 + Math.random() * 10) + 's';
        
        // Random size variation
        const size = 3 + Math.random() * 5;
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
        
        firefliesContainer.appendChild(firefly);
    }
}

// ==========================================
// COVER PAGE ANIMATION
// ==========================================
function openBook() {
    coverPage.classList.add('opening');
    
    // After animation completes, hide cover and show bestiary
    setTimeout(() => {
        coverPage.classList.add('hidden');
        bestiaryMain.classList.add('visible');
        
        // Trigger card animations
        creatureCards.forEach((card, index) => {
            card.style.animationDelay = (index * 0.1) + 's';
        });
    }, 800);
}

// ==========================================
// CREATURE FILTERING
// ==========================================
function filterCreatures(category) {
    creatureCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            card.style.display = '';
        } else {
            card.classList.add('hidden');
            // Use timeout to allow animation before hiding
            setTimeout(() => {
                if (card.classList.contains('hidden')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });
}

// ==========================================
// MODAL SYSTEM
// ==========================================
function openModal(creatureId) {
    const creature = creatureData[creatureId];
    if (!creature) return;
    
    // Populate modal content
    document.getElementById('modalName').textContent = creature.name;
    document.getElementById('modalCyrillic').textContent = creature.cyrillic;
    document.getElementById('modalType').textContent = creature.type;
    document.getElementById('modalDescription').textContent = creature.description;
    document.getElementById('modalAppearance').textContent = creature.appearance;
    document.getElementById('modalHabitat').textContent = creature.habitat;
    document.getElementById('modalEncounters').textContent = creature.encounters;
    document.getElementById('modalProtection').textContent = creature.protection;
    
    // Set danger rating
    const dangerContainer = document.getElementById('modalDanger');
    dangerContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const symbol = document.createElement('span');
        symbol.className = 'danger-symbol' + (i < creature.danger ? ' active' : '');
        symbol.textContent = '☽';
        dangerContainer.appendChild(symbol);
    }
    
    // Clone the illustration from the card
    const cardIllustration = document.querySelector(`[data-creature="${creatureId}"] .creature-svg`);
    const modalIllustration = document.getElementById('modalIllustration');
    if (cardIllustration && modalIllustration) {
        modalIllustration.innerHTML = cardIllustration.outerHTML;
    }
    
    // Show modal
    creatureModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    creatureModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==========================================
// EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize fireflies
    createFireflies();
    
    // Cover page open button
    openBookBtn.addEventListener('click', openBook);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter creatures
            filterCreatures(btn.dataset.filter);
        });
    });
    
    // Read more buttons
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.dataset.target);
        });
    });
    
    // Card click (entire card opens modal)
    creatureCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the button directly
            if (!e.target.closest('.read-more-btn')) {
                openModal(card.dataset.creature);
            }
        });
    });
    
    // Modal close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal on backdrop click
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && creatureModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Allow Enter key to open modal for focused cards
    creatureCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                openModal(card.dataset.creature);
            }
        });
    });
});

// ==========================================
// PARALLAX EFFECT FOR LIGHT RAYS
// ==========================================
let ticking = false;

window.addEventListener('mousemove', (e) => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            const rays = document.querySelectorAll('.light-ray');
            rays.forEach((ray, index) => {
                const speed = (index + 1) * 0.5;
                const xOffset = (x - 0.5) * speed * 20;
                const yOffset = (y - 0.5) * speed * 10;
                ray.style.transform = `rotate(15deg) translate(${xOffset}px, ${yOffset}px)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// ==========================================
// SCROLL-BASED EFFECTS
// ==========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const canopy = document.getElementById('canopy');
    
    // Parallax for canopy
    if (canopy) {
        canopy.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    // Hearth glow intensity based on scroll position
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrolled / maxScroll;
    
    document.querySelectorAll('.hearth-glow').forEach(glow => {
        glow.style.opacity = 0.5 + (scrollPercent * 0.5);
    });
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all cards for scroll-triggered animation
creatureCards.forEach(card => {
    cardObserver.observe(card);
});

// ==========================================
// KEYBOARD NAVIGATION ENHANCEMENT
// ==========================================
document.addEventListener('keydown', (e) => {
    // Arrow key navigation through cards when bestiary is visible
    if (bestiaryMain.classList.contains('visible') && !creatureModal.classList.contains('active')) {
        const focusedCard = document.activeElement.closest('.creature-card');
        
        if (focusedCard) {
            const cardsArray = Array.from(creatureCards).filter(card => !card.classList.contains('hidden'));
            const currentIndex = cardsArray.indexOf(focusedCard);
            
            let nextIndex = -1;
            
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    nextIndex = Math.min(currentIndex + 1, cardsArray.length - 1);
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextIndex = Math.max(currentIndex - 1, 0);
                    break;
            }
            
            if (nextIndex >= 0 && nextIndex !== currentIndex) {
                e.preventDefault();
                cardsArray[nextIndex].focus();
            }
        }
    }
});

// ==========================================
// AMBIENT SOUND INDICATOR (Visual only)
// ==========================================
function createAmbientPulse() {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 10px;
        height: 10px;
        background: var(--gold-aged);
        border-radius: 50%;
        opacity: 0.3;
        animation: ambientPulse 3s ease-in-out infinite;
        z-index: 90;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ambientPulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);
    
    if (bestiaryMain.classList.contains('visible')) {
        document.body.appendChild(pulse);
    }
}

// Add ambient pulse after book opens
openBookBtn.addEventListener('click', () => {
    setTimeout(createAmbientPulse, 1500);
});

// ==========================================
// PRELOAD FONT FOR SMOOTHER RENDERING
// ==========================================
if ('fonts' in document) {
    Promise.all([
        document.fonts.load('1em UnifrakturMaguntia'),
        document.fonts.load('1em "IM Fell English"'),
        document.fonts.load('1em "Cormorant Garamond"')
    ]).then(() => {
        document.body.classList.add('fonts-loaded');
    });
}

// ==========================================
// CONSOLE EASTER EGG
// ==========================================
console.log(`
%c☽ ✦ ☽
%cBestiary of the Slavic Wilds
%cA Compendium of Forest Spirits, Water Demons,
and Creatures of the Ancient Dark

"The forest has a thousand eyes,
and the sea has a thousand more,
but the one who walks in the fields alone
has none, and less than four."
— Old Slavic proverb

`, 
'color: #c4a35a; font-size: 24px;',
'color: #5c4a1f; font-family: serif; font-size: 16px;',
'color: #8b6914; font-family: serif; font-size: 12px;'
);