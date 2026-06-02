/* ============================================
   THE HERBALIST'S GRIMOIRE — COTTAGE WITCH
   Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================
       LOADING SCREEN
       ======================================== */
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');

    const loadingMessages = [
        'Brewing your grimoire...',
        'Gathering moonpetals...',
        'Stirring the cauldron...',
        'Consulting the old tomes...',
        'Drying herbs by candlelight...'
    ];

    const loadingText = loadingScreen.querySelector('.loading-text');
    let messageIndex = 0;

    const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingText.style.opacity = '0';
        setTimeout(() => {
            loadingText.textContent = loadingMessages[messageIndex];
            loadingText.style.opacity = '1';
        }, 300);
    }, 1500);

    const hideLoading = () => {
        clearInterval(messageInterval);
        loadingScreen.classList.add('hidden');
        app.classList.remove('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            initScrollAnimations();
        }, 1000);
    };

    setTimeout(hideLoading, 4000);

    /* ========================================
       NIGHT MODE TOGGLE (Moth & Candlelight)
       ======================================== */
    const nightModeToggle = document.getElementById('night-mode-toggle');
    const firefliesContainer = document.getElementById('fireflies-container');
    let isNightMode = false;

    nightModeToggle.addEventListener('click', () => {
        isNightMode = !isNightMode;
        document.documentElement.setAttribute('data-theme', isNightMode ? 'night' : 'light');

        if (isNightMode) {
            createFireflies(25);
        } else {
            clearFireflies();
        }
    });

    function createFireflies(count) {
        clearFireflies();
        for (let i = 0; i < count; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly-dynamic';
            const size = 3 + Math.random() * 3;
            const glowSize = 6 + Math.random() * 8;
            const glowSpread = 2 + Math.random() * 4;
            const opacity = 0.6 + Math.random() * 0.4;
            const duration = 5 + Math.random() * 8;
            const delay = Math.random() * 5;
            const leftPos = Math.random() * 100;
            const topPos = Math.random() * 100;
            const driftX = 20 + Math.random() * 40;
            const driftY = 10 + Math.random() * 30;

            firefly.style.position = 'absolute';
            firefly.style.width = size + 'px';
            firefly.style.height = size + 'px';
            firefly.style.borderRadius = '50%';
            firefly.style.background = 'rgba(240, 200, 80, ' + opacity + ')';
            firefly.style.boxShadow = '0 0 ' + glowSize + 'px ' + glowSpread + 'px rgba(240, 200, 80, 0.5)';
            firefly.style.left = leftPos + '%';
            firefly.style.top = topPos + '%';
            firefly.style.pointerEvents = 'none';
            firefly.style.zIndex = '9999';
            firefly.style.animation = 'firefly-drift ' + duration + 's ease-in-out infinite';
            firefly.style.animationDelay = delay + 's';
            firefly.style.opacity = '0';

            firefliesContainer.appendChild(firefly);
        }

        if (!document.getElementById('firefly-styles')) {
            const style = document.createElement('style');
            style.id = 'firefly-styles';
            style.textContent = '@keyframes firefly-drift { 0% { opacity: 0; transform: translate(0, 0); } 15% { opacity: 0.8; } 30% { opacity: 0.4; transform: translate(30px, -20px); } 50% { opacity: 0.9; transform: translate(10px, -30px); } 70% { opacity: 0.3; transform: translate(-20px, 10px); } 85% { opacity: 0.7; } 100% { opacity: 0; transform: translate(0, 0); } }';
            document.head.appendChild(style);
        }
    }

    function clearFireflies() {
        firefliesContainer.innerHTML = '';
    }

    /* ========================================
       NAVIGATION — Smooth Scroll and Active State
       ======================================== */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    /* ========================================
       MOON PHASE AND SEASON DETECTION
       ======================================== */
    function updateMoonPhase() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const c = Math.floor(365.25 * year);
        const e = Math.floor(30.6 * month);
        const jd = c + e + day - 694039.09;
        const phase = jd / 29.5305882;
        const phaseFraction = phase - Math.floor(phase);

        let phaseName = '';
        let phaseEmoji = '';

        if (phaseFraction < 0.0625) {
            phaseName = 'New Moon';
            phaseEmoji = '\u{1F311}';
        } else if (phaseFraction < 0.1875) {
            phaseName = 'Waxing Crescent';
            phaseEmoji = '\u{1F312}';
        } else if (phaseFraction < 0.3125) {
            phaseName = 'First Quarter';
            phaseEmoji = '\u{1F313}';
        } else if (phaseFraction < 0.4375) {
            phaseName = 'Waxing Gibbous';
            phaseEmoji = '\u{1F314}';
        } else if (phaseFraction < 0.5625) {
            phaseName = 'Full Moon';
            phaseEmoji = '\u{1F315}';
        } else if (phaseFraction < 0.6875) {
            phaseName = 'Waning Gibbous';
            phaseEmoji = '\u{1F316}';
        } else if (phaseFraction < 0.8125) {
            phaseName = 'Last Quarter';
            phaseEmoji = '\u{1F317}';
        } else if (phaseFraction < 0.9375) {
            phaseName = 'Waning Crescent';
            phaseEmoji = '\u{1F318}';
        } else {
            phaseName = 'New Moon';
            phaseEmoji = '\u{1F311}';
        }

        const moonPhaseEl = document.getElementById('moon-phase');
        if (moonPhaseEl) {
            moonPhaseEl.textContent = phaseEmoji + ' ' + phaseName;
        }
    }

    function updateSeason() {
        const month = new Date().getMonth() + 1;
        let season = '';

        if (month >= 3 && month <= 5) {
            season = 'Spring';
        } else if (month >= 6 && month <= 8) {
            season = 'Summer';
        } else if (month >= 9 && month <= 11) {
            season = 'Autumn';
        } else {
            season = 'Winter';
        }

        const seasonEl = document.getElementById('current-season');
        if (seasonEl) {
            seasonEl.textContent = season;
        }
    }

    updateMoonPhase();
    updateSeason();

    /* ========================================
       SEASONAL WHEEL
       ======================================== */
    const seasonSegments = document.querySelectorAll('.season-segment');
    const seasonPanels = document.querySelectorAll('.season-panel');

    const seasonMap = {
        'spring': 'spring-panel',
        'summer': 'summer-panel',
        'autumn': 'autumn-panel',
        'winter': 'winter-panel'
    };

    function switchSeason(season) {
        seasonPanels.forEach(panel => {
            panel.classList.remove('active');
        });

        const targetPanel = document.getElementById(seasonMap[season]);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        seasonSegments.forEach(seg => {
            seg.style.filter = '';
        });

        const activeSegment = document.querySelector('.season-segment[data-season="' + season + '"]');
        if (activeSegment) {
            activeSegment.style.filter = 'brightness(1.1)';
        }
    }

    seasonSegments.forEach(segment => {
        segment.setAttribute('tabindex', '0');
        segment.setAttribute('role', 'button');

        segment.addEventListener('click', () => {
            const season = segment.getAttribute('data-season');
            switchSeason(season);
        });

        segment.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const season = segment.getAttribute('data-season');
                switchSeason(season);
            }
        });
    });

    const currentMonth = new Date().getMonth() + 1;
    let currentSeasonKey = 'winter';
    if (currentMonth >= 3 && currentMonth <= 5) {
        currentSeasonKey = 'spring';
    } else if (currentMonth >= 6 && currentMonth <= 8) {
        currentSeasonKey = 'summer';
    } else if (currentMonth >= 9 && currentMonth <= 11) {
        currentSeasonKey = 'autumn';
    }

    switchSeason(currentSeasonKey);

    /* ========================================
       POTION RECIPE DATA AND MODAL
       ======================================== */
    const potionData = {
        moonwater: {
            name: 'Moonwater Elixir',
            type: 'Clarity and Vision',
            ingredients: [
                '3 sprigs of Moonpetal (harvested under full moon)',
                '1 handful of Silver Moss',
                '7 morning Dewdrops',
                '1 vial of spring water',
                'A pinch of powdered pearl'
            ],
            instructions: '<p>Begin this brew only when the moon is at its fullest. Place the moonpetal sprigs in your silver mortar and grind gently — never with force, for the petals hold memories of moonlight that brute handling will scatter.</p><p>Heat the spring water in a copper pot until it whispers (not boils). Add the silver moss and stir widdershins three times. Then add the ground moonpetal and stir sunwise seven times.</p><p>Let the mixture cool beneath the open sky for one hour. The dewdrops should be added last, one by one, each dropped from a height of exactly seven inches.</p><p>Strain through muslin into a crystal vial. Best consumed at dawn or dusk.</p>',
            notes: 'This elixir enhances clarity of thought and opens the inner eye. Do not brew during a lunar eclipse — the results are unpredictable. Store in a dark glass vial away from iron.'
        },
        dreamwalker: {
            name: 'Dreamwalkers Draught',
            type: 'Lucid Dreaming',
            ingredients: [
                '2 tablespoons dried Valerian Root',
                '1 sprig of fresh Lavender',
                '3 leaves of Mugwort (dreamers herb)',
                '1 cup of chamomile tea (cooled)',
                'Honey to taste'
            ],
            instructions: '<p>The valerian root must be dried for at least one moon cycle. Grind it coarsely — not to powder, but to rough fragments that still hold their shape.</p><p>Steep the valerian and mugwort together in hot (not boiling) water for exactly ten minutes. The lavender should be added only in the last two minutes, or its essence will overpower the subtler herbs.</p><p>Strain into your favorite cup — the one with the chip on the rim, perhaps. Sweeten with honey while whispering your intention for the nights journey.</p><p>Drink slowly, one sip for each of the seven chakras, before lying down.</p>',
            notes: 'Mugwort is the travelers companion. Keep a dream journal beside your bed — the insights fade like morning mist if not recorded. Not recommended during times of grief or heavy heart.'
        },
        fireheart: {
            name: 'Fireheart Tonic',
            type: 'Courage and Warmth',
            ingredients: [
                '3 slices of fresh Ginger Root',
                '1 cinnamon stick (Ceylon, if possible)',
                '2 Ember Blossoms (dried)',
                '1 cup of water',
                'A squeeze of lemon',
                'A dram of whiskey (optional)'
            ],
            instructions: '<p>Slice the ginger thin enough to see light through — this releases its fire. Place in cold water and bring slowly to a gentle simmer. Patience here is the first act of courage.</p><p>Add the cinnamon stick and let it unfurl in the heat. The ember blossoms should be crushed between your palms first — the warmth of your hands awakens their dormant fire.</p><p>Simmer for fifteen minutes. The kitchen should smell like a hearth in December. Strain, add lemon, and if the night is particularly cold or the heart particularly heavy, add the whiskey without shame.</p>',
            notes: 'This tonic is a warm embrace in a cup. Best taken before facing something that frightens you. The courage it grants is not the absence of fear, but the warmth to carry it. Do not brew during the hottest days of summer.'
        },
        whisperwind: {
            name: 'Whisperwind Vapor',
            type: 'Communication and Calm',
            ingredients: [
                '2 tablespoons dried Chamomile',
                '1 handful of fresh Peppermint leaves',
                '1 piece of Willow Bark (thumb-length)',
                '2 cups of water',
                'A drop of lavender oil'
            ],
            instructions: '<p>The willow bark must be gathered from a tree that grows near water — it is there that the willow learns the art of bending without breaking. Scrape only the inner bark, and only from a branch that has already fallen.</p><p>Simmer the willow bark alone for twenty minutes. The water will turn the color of pale amber. Then add the chamomile and peppermint, removing the pot from heat immediately.</p><p>Cover and steep for ten minutes. The vapor that rises carries the message — breathe it in deeply before drinking. Add the single drop of lavender oil to the cup.</p><p>Use before difficult conversations, or when the mind races like a startled hare.</p>',
            notes: 'This remedy teaches that the softest voice often carries the farthest. The willow knows: it is not the loudest branch that survives the storm. Particularly effective when shared with another over honest conversation.'
        },
        shadowveil: {
            name: 'Shadowveil Infusion',
            type: 'Protection and Warding',
            ingredients: [
                '5 Blackthorn thorns (handled with care)',
                '9 Rowan Berries',
                '1 clump of Iron Moss',
                '1 cup of rainwater (collected during a storm)',
                'A pinch of salt from the sea'
            ],
            instructions: '<p>This is not a potion to be taken lightly or without purpose. The blackthorn must be harvested with respect — leave an offering of milk or honey at the base of the tree.</p><p>Place the rowan berries in the bottom of a black pot. Add the iron moss and the sea salt. Pour the storm water over them — water that fell during thunder carries the skys own protective charge.</p><p>Heat until just before boiling, then remove from flame. Add the blackthorn thorns one by one, each time speaking aloud what you wish to be protected from.</p><p>Strain and use to anoint doorframes, windows, or the edges of your territory. A small amount may be added to bath water for personal warding.</p>',
            notes: 'The shadowveil does not create darkness — it teaches you to see within it. Use only when genuinely needed, not from paranoia. The blackthorn remembers disrespect. Always give thanks after harvesting.'
        },
        starfall: {
            name: 'Starfall Nectar',
            type: 'Luck and Prosperity',
            ingredients: [
                'A handful of four-leaf Clovers (or three-leaf, in a pinch)',
                '2 tablespoons wildflower Honey',
                '1 root of Goldenseal',
                '1 cup of water from a natural spring',
                'A gold coin (for stirring)'
            ],
            instructions: '<p>This brew must be begun on a night when shooting stars are visible. If the sky is cloudy, wait — the stars will come again, and patience is itself a form of prosperity.</p><p>Simmer the goldenseal root in spring water for thirty minutes. The water will take on a golden hue — this is right and proper. Strain and return the golden water to the pot.</p><p>Add the clover leaves and stir with the gold coin sunwise nine times. The honey should be added last, in a slow spiral, while speaking your intention for abundance.</p><p>Drink a small sip and pour the rest at the base of a healthy tree as thanks to the forest.</p>',
            notes: 'Luck is not chance — it is readiness meeting opportunity. This nectar opens the door, but you must still walk through it. The gold coin should be one you can part with; after stirring, give it to someone in need. Prosperity flows in circles.'
        }
    };

    const modal = document.getElementById('potion-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalType = document.getElementById('modal-type');
    const modalIngredientsList = document.getElementById('modal-ingredients-list');
    const modalInstructionsText = document.getElementById('modal-instructions-text');
    const modalNotesText = document.getElementById('modal-notes-text');
    const modalClose = document.querySelector('.modal-close');

    function openPotionModal(potionKey) {
        const data = potionData[potionKey];
        if (!data) {
            return;
        }

        modalTitle.textContent = data.name;
        modalType.textContent = data.type;

        modalIngredientsList.innerHTML = '';
        data.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            modalIngredientsList.appendChild(li);
        });

        modalInstructionsText.innerHTML = data.instructions;
        modalNotesText.textContent = data.notes;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        modalClose.focus();
    }

    function closePotionModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.potion-view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const potionKey = btn.getAttribute('data-modal');
            openPotionModal(potionKey);
        });
    });

    modalClose.addEventListener('click', closePotionModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePotionModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closePotionModal();
        }
    });

    /* ========================================
       SCROLL ANIMATIONS
       ======================================== */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.potion-card, .remedy-note, .forage-item, .flower-frame, .season-wheel-container'
        );

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }

    /* ========================================
       HERO PARALLAX EFFECT
       ======================================== */
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            if (scrollY < window.innerHeight) {
                const translateY = scrollY * 0.3;
                const opacity = 1 - scrollY / (window.innerHeight * 0.8);
                heroContent.style.transform = 'translateY(' + translateY + 'px)';
                heroContent.style.opacity = '' + opacity;
            }
        });
    }

    /* ========================================
       FLOATING LEAVES — Random Movement
       ======================================== */
    const leaves = document.querySelectorAll('.leaf');

    leaves.forEach(leaf => {
        leaf.addEventListener('animationiteration', () => {
            const randomX = (Math.random() - 0.5) * 60;
            const randomY = (Math.random() - 0.5) * 40;
            const randomRot = (Math.random() - 0.5) * 30;
            leaf.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px) rotate(' + randomRot + 'deg)';
        });
    });

    /* ========================================
       POTION CARD HOVER EFFECT
       ======================================== */
    const potionCards = document.querySelectorAll('.potion-card');

    potionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const bottle = card.querySelector('.bottle-svg');
            if (bottle) {
                bottle.style.transition = 'transform 0.4s ease';
            }
        });
    });

    /* ========================================
       REMEDY NOTE — Slight Random Rotation
       ======================================== */
    const remedyNotes = document.querySelectorAll('.remedy-note');

    remedyNotes.forEach(note => {
        const randomRotation = (Math.random() - 0.5) * 1.5;
        note.style.transform = 'rotate(' + randomRotation + 'deg)';
    });

    /* ========================================
       FLOWER FRAME — Hover Tilt Effect
       ======================================== */
    const flowerFrames = document.querySelectorAll('.flower-frame');

    flowerFrames.forEach(frame => {
        frame.addEventListener('mousemove', (e) => {
            const rect = frame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            const outer = frame.querySelector('.frame-outer');
            if (outer) {
                outer.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
            }
        });

        frame.addEventListener('mouseleave', () => {
            const outer = frame.querySelector('.frame-outer');
            if (outer) {
                outer.style.transform = '';
            }
        });
    });

    /* ========================================
       SEASON WHEEL — Keyboard Navigation
       ======================================== */
    const seasonOrder = ['spring', 'summer', 'autumn', 'winter'];
    let currentSeasonIndex = seasonOrder.indexOf(currentSeasonKey);

    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('season-segment')) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                currentSeasonIndex = (currentSeasonIndex + 1) % 4;
                switchSeason(seasonOrder[currentSeasonIndex]);
                const nextSegment = document.querySelector('.season-segment[data-season="' + seasonOrder[currentSeasonIndex] + '"]');
                if (nextSegment) {
                    nextSegment.focus();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                currentSeasonIndex = (currentSeasonIndex - 1 + 4) % 4;
                switchSeason(seasonOrder[currentSeasonIndex]);
                const prevSegment = document.querySelector('.season-segment[data-season="' + seasonOrder[currentSeasonIndex] + '"]');
                if (prevSegment) {
                    prevSegment.focus();
                }
            }
        }
    });

    /* ========================================
       DYNAMIC INGREDIENT TAG COLORS
       ======================================== */
    const ingredientTags = document.querySelectorAll('.ingredient-tag');

    ingredientTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.background = 'rgba(90, 138, 90, 0.2)';
            tag.style.transform = 'scale(1.05)';
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.background = '';
            tag.style.transform = '';
        });
    });

    /* ========================================
       SMOOTH REVEAL ON SCROLL FOR SECTIONS
       ======================================== */
    const sectionHeaders = document.querySelectorAll('.section-header');

    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    sectionHeaders.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(30px)';
        header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        headerObserver.observe(header);
    });

    /* ========================================
       CAULDRON INTERACTION (Loading Screen)
       ======================================== */
    const cauldron = document.querySelector('.cauldron');

    if (cauldron) {
        cauldron.addEventListener('click', () => {
            const bubbles = cauldron.querySelectorAll('.bubble');
            bubbles.forEach(bubble => {
                bubble.style.animation = 'none';
                bubble.offsetHeight;
                bubble.style.animation = 'bubble-rise 0.8s ease-out';
            });
        });
    }

    /* ========================================
       CONSOLE GREETING
       ======================================== */
    console.log(
        '%c Welcome to The Herbalists Grimoire ',
        'font-family: serif; font-size: 18px; color: #3a6a3a; font-weight: bold;'
    );
    console.log(
        '%c"The forest provides — if you know when and where to look."',
        'font-family: cursive; font-size: 14px; color: #6a5a4a; font-style: italic;'
    );

});