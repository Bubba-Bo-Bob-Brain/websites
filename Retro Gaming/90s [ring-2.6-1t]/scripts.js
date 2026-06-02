// ============================================================================
// NEXUS GAMING TERMINAL — 90s RETRO JAVASCRIPT ENGINE
// ============================================================================

(function () {
    // ===== DATA =================================================================

    const GAMES = [
        { name: 'Chrono Trigger', platform: 'SNES', year: 1995, icon: '\u23F1', genre: ['RPG', 'Adventure'], score: 'S+', rarity: 'Rare', completion: '100%', color: '#00ff41', cheat: 'L1+R1+Select' },
        { name: 'Super Mario 64', platform: 'N64', year: 1996, icon: '\uD83C\uDF44', genre: ['Platformer', '3D'], score: 'S', rarity: 'Common', completion: '92%', color: '#00ffff', cheat: 'Z+L+R+Start' },
        { name: 'The Legend of Zelda: OoT', platform: 'N64', year: 1998, icon: '\uD83D\uDDE1', genre: ['RPG', 'Adventure'], score: 'S+', rarity: 'Rare', completion: '100%', color: '#ffff00', cheat: 'DIN Fire Farore Wind' },
        { name: 'Final Fantasy VII', platform: 'PS1', year: 1997, icon: '\u2694', genre: ['RPG', 'Cinematic'], score: 'S+', rarity: 'Rare', completion: '100%', color: '#ff00ff', cheat: 'Mog Stone Power' },
        { name: 'Sonic the Hedgehog 3', platform: 'SEGA', year: 1994, icon: '\uD83D\uDCA8', genre: ['Platformer', 'Speed'], score: 'A+', rarity: 'Common', completion: '88%', color: '#4488ff', cheat: 'Debug Mode' },
        { name: 'Super Metroid', platform: 'SNES', year: 1994, icon: '\uD83D\uDC7E', genre: ['Action', 'Exploration'], score: 'S+', rarity: 'Rare', completion: '100%', color: '#00ff41', cheat: 'Justin Bailey' },
        { name: 'Castlevania: SotN', platform: 'PS1', year: 1997, icon: '\uD83D\uDC3B', genre: ['Action', 'RPG'], score: 'S', rarity: 'Uncommon', completion: '95%', color: '#ff0040', cheat: 'Magical Shield' },
        { name: 'Pok\u00E9mon Red', platform: 'NES', year: 1996, icon: '\ud83d\udd34', genre: ['RPG', 'Collection'], score: 'A', rarity: 'Common', completion: '76%', color: '#ff66aa', cheat: 'MissingNo Glitch' },
        { name: 'Street Fighter II Turbo', platform: 'SNES', year: 1993, icon: '\uD83E\uDD1A', genre: ['Fighting', 'Competitive'], score: 'S', rarity: 'Uncommon', completion: '90%', color: '#ff8800', cheat: 'Akuma Code' },
        { name: 'GoldenEye 007', platform: 'N64', year: 1997, icon: '\uD83D\uDD2B', genre: ['FPS', 'Multiplayer'], score: 'A+', rarity: 'Rare', completion: '85%', color: '#4488ff', cheat: 'DK Mode' },
        { name: 'Mega Man X', platform: 'SNES', year: 1993, icon: '\uD83E\uDD16', genre: ['Platformer', 'Action'], score: 'A+', rarity: 'Common', completion: '91%', color: '#00ffff', cheat: 'Hadouken Armor' },
        { name: 'Resident Evil 2', platform: 'PS1', year: 1998, icon: '\uD83E\uDDBF', genre: ['Survival Horror'], score: 'S', rarity: 'Uncommon', completion: '87%', color: '#ff0040', cheat: 'Infinite Ammo' },
        { name: 'Donkey Kong Country 2', platform: 'SNES', year: 1995, icon: '\uD83E\uDD8D', genre: ['Platformer', 'Puzzle'], score: 'A', rarity: 'Common', completion: '82%', color: '#00ff41', cheat: 'Star Barrel Skip' },
        { name: 'Tekken 3', platform: 'PS1', year: 1997, icon: '\uD83E\uDD4A', genre: ['Fighting'], score: 'A+', rarity: 'Common', completion: '89%', color: '#ff8800', cheat: 'Playable Bosses' },
        { name: 'Star Fox 64', platform: 'N64', year: 1997, icon: '\uD83D\uDE80', genre: ['Rail Shooter', 'Action'], score: 'S', rarity: 'Uncommon', completion: '93%', color: '#ffff00', cheat: 'Alternate Routes' },
        { name: 'Metal Gear Solid', platform: 'PS1', year: 1998, icon: '\uD83D\uDE0E', genre: ['Stealth', 'Tactical'], score: 'S+', rarity: 'Rare', completion: '98%', color: '#ff66aa', cheat: 'Bandana/Infinity' },
        { name: 'Super Mario World', platform: 'SNES', year: 1990, icon: '\u2B50', genre: ['Platformer'], score: 'S+', rarity: 'Common', completion: '100%', color: '#00ff41', cheat: 'Top Secret Area' },
        { name: 'Sonic & Knuckles', platform: 'SEGA', year: 1994, icon: '\uD83D\uDCA0', genre: ['Platformer', 'Speed'], score: 'A+', rarity: 'Uncommon', completion: '86%', color: '#4488ff', cheat: 'Blue Sphere' },
        { name: 'Mortal Kombat 3', platform: 'SNES', year: 1995, icon: '\uD83D\uDC80', genre: ['Fighting'], score: 'A', rarity: 'Common', completion: '74%', color: '#ff0040', cheat: 'Kombat Kodes' },
        { name: 'F-Zero GX', platform: 'N64', year: 1998, icon: '\uD83C\uDFCE', genre: ['Racing'], score: 'S', rarity: 'Rare', completion: '78%', color: '#ffff00', cheat: 'Blood Falcon' },
    ];

    const LEADERBOARD_DATA = {
        overall: [
            { name: 'XxNINJA99xX', score: '9,999,999', game: 'GoldenEye' },
            { name: 'RETRO_KING', score: '8,742,100', game: 'Chrono Trigger' },
            { name: 'PIXEL_QUEEN', score: '7,881,200', game: 'Zelda OoT' },
            { name: 'SHADOWFOX', score: '6,550,400', game: 'FF VII' },
            { name: 'BLAZE_IT', score: '5,912,800', game: 'Sonic 3' },
            { name: 'GAME_OVER_1UP', score: '5,200,000', game: 'Metroid' },
            { name: '8BIT_WARRIOR', score: '4,887,600', game: 'Mega Man X' },
            { name: 'CASUAL_SAMUS', score: '4,100,300', game: 'DKC 2' },
            { name: 'COIN_COLLECTR', score: '3,750,900', game: 'Star Fox 64' },
            { name: 'MISTA_X', score: '3,201,500', game: 'Tekken 3' },
        ],
        speedrun: [
            { name: 'SPEED_DEMON', score: '00:45:12', game: 'Zelda OoT' },
            { name: 'FRAME_PERFECT', score: '00:52:33', game: 'Chrono Trigger' },
            { name: 'BLINK_SKIP', score: '00:58:07', game: 'Super Metroid' },
            { name: 'RNG_LORD', score: '01:04:29', game: 'FF VII' },
            { name: 'TAS_MASTER', score: '01:12:44', game: 'Star Fox 64' },
        ],
        'high-score': [
            { name: 'ARCADE_Ace', score: '12,050,200', game: 'Tekken 3' },
            { name: 'COMBO_KING', score: '11,403,800', game: 'MK 3' },
            { name: 'RING_MASTER', score: '10,887,100', game: 'GoldenEye' },
            { name: 'DRIFT_QUEEN', score: '10,200,500', game: 'F-Zero GX' },
            { name: 'RESIDENT_S', score: '9,750,300', game: 'Resident Evil 2' },
        ],
    };

    const TIMELINE_DATA = [
        { year: '1990', title: 'Super Mario World', desc: 'Nintendo redefined platforming on the SNES with Yoshi, secret exits, and the Super FX chip debut.' },
        { year: '1991', title: 'Sonic the Hedgehog', desc: 'Sega\'s blue blur launched a console war and proved a mascot could rival Mario.' },
        { year: '1993', title: 'DOOM', desc: 'id Software\'s FPS masterpiece terrified parents and birthed an entire genre overnight.' },
        { year: '1994', title: 'Donkey Kong Country', desc: 'Rare pushed the SNES to its absolute limits with pre-rendered 3D graphics.' },
        { year: '1995', title: 'Chrono Trigger', desc: 'The Dream Team of Toriyama, Horii, and Mitsuda crafted the greatest RPG of all time.' },
        { year: '1996', title: 'Pok\u00E9mon Red & Green', desc: 'Game Freak launched a global phenomenon that still dominates today.' },
        { year: '1996', title: 'Super Mario 64', desc: 'The moment gaming went 3D \u2014 and every developer scrambled to follow.' },
        { year: '1997', title: 'Final Fantasy VII', desc: 'Square\'s PS1 epic proved games could tell stories that made you cry.' },
        { year: '1998', title: 'The Legend of Zelda: OoT', desc: 'N64\'s masterpiece defined 3D adventure gaming for generations.' },
        { year: '1998', title: 'Metal Gear Solid', desc: 'Kojima\'s stealth revolution turned a NES franchise into cinematic legend.' },
        { year: '1999', title: 'Dreamcast Launch', desc: 'Sega\'s final console arrived too early, too bold, and too ahead of its time.' },
    ];

    const TRACKS = [
        { name: 'GREEN HILL ZONE', composer: 'M. Jackson', duration: '3:24', bpm: 140, wave: 'square', freq: 523 },
        { name: 'ZELDA OVERWORLD', composer: 'K. Koji', duration: '2:58', bpm: 120, wave: 'triangle', freq: 392 },
        { name: 'MEGA MAN 2 INTRO', composer: 'T.Kitamura', duration: '2:15', bpm: 160, wave: 'square', freq: 659 },
        { name: 'FF VII BATTLE', composer: 'N.Uematsu', duration: '3:42', bpm: 150, wave: 'sawtooth', freq: 440 },
        { name: 'SONIC EMERALD HILL', composer: 'M.Chikina', duration: '2:47', bpm: 135, wave: 'square', freq: 587 },
        { name: 'DK RAP (8-BIT)', composer: 'G. Smith', duration: '2:30', bpm: 110, wave: 'triangle', freq: 330 },
        { name: 'CASTLEVANIA MEDLEY', composer: 'M. Kondo', duration: '3:10', bpm: 145, wave: 'sawtooth', freq: 392 },
        { name: 'POK\u00C9MON CENTER', composer: 'M. Morikubo', duration: '2:22', bpm: 100, wave: 'square', freq: 523 },
        { name: 'TETRIS TYPE A', composer: 'H. Hirokawa', duration: '2:48', bpm: 165, wave: 'square', freq: 659 },
        { name: 'STAR FOX MAIN', composer: 'S. Hosoe', duration: '2:55', bpm: 170, wave: 'triangle', freq: 494 },
    ];

    // ===== UTILITY FUNCTIONS ====================================================

    function $(id) { return document.getElementById(id); }
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // ===== BOOT SEQUENCE =========================================================

    function initBootSequence() {
        var bootText = $('boot-text');
        var lines = [
            'NEXUS GAMING TERMINAL v2.04',
            'Copyright (c) 1996 Nexus Entertainment Systems',
            'Initializing hardware drivers...',
            '  [OK] Video subsystem loaded (320x240)',
            '  [OK] Audio driver initialized (8-bit PCM)',
            '  [OK] Input device detected (Controller Port 1)',
            '  [OK] Memory Pak detected (128KB free)',
            '  [OK] Rumble Pak status: NOT CONNECTED',
            'Loading cartridge database...',
            '  Reading sector 0x0A... DONE',
            '  Reading sector 0x1B... DONE',
            '  Reading sector 0x2F... DONE',
            '  Reading sector 0x3C... DONE',
            '  Database contains 347 entries',
            'Initializing visual cortex...',
            '  Rendering environment map... DONE',
            '  Loading texture cache... 64KB/256KB',
            'System check complete.',
            '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
            'Press any key to enter NEXUS...',
        ];

        var lineIndex = 0;
        var charIndex = 0;
        var currentLine = '';
        var typing = true;

        function typeChar() {
            if (lineIndex >= lines.length) {
                typing = false;
                return;
            }

            currentLine = lines[lineIndex];
            if (charIndex < currentLine.length) {
                bootText.textContent += currentLine[charIndex];
                charIndex++;
                setTimeout(typeChar, rand(10, 40));
            } else {
                bootText.textContent += '\n';
                lineIndex++;
                charIndex = 0;
                setTimeout(typeChar, rand(50, 200));
            }
        }

        typeChar();

        function onBootKey(e) {
            document.removeEventListener('keydown', onBootKey);
            $('boot-overlay').classList.add('hidden');
            setTimeout(function() { $('boot-overlay').style.display = 'none'; }, 900);
            initMainContent();
        }
        document.addEventListener('keydown', onBootKey);

        // Auto-proceed after boot sequence finishes
        setTimeout(function() {
            if (!$('boot-overlay').classList.contains('hidden')) {
                $('boot-overlay').classList.add('hidden');
                setTimeout(function() { $('boot-overlay').style.display = 'none'; }, 900);
                initMainContent();
            }
        }, lines.length * 40 + 2000);
    }

    // ===== CUSTOM CURSOR =========================================================

    function initCustomCursor() {
        var cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);

        var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // ===== PIXEL MASCOT ==========================================================

    function initMascot() {
        var mascot = $('pixel-mascot');
        var container = $('mascot-container');

        // Follow mouse subtly
        document.addEventListener('mousemove', function(e) {
            var x = (e.clientX / window.innerWidth - 0.5) * 20;
            var y = (e.clientY / window.innerHeight - 0.5) * 20;
            mascot.style.transform = 'translate(' + x + 'px, ' + (y - 8) + 'px)';
        });

        // Click to toggle animation
        container.addEventListener('click', function() {
            mascot.style.animation = 'none';
            var r = mascot.getBoundingClientRect(); // force reflow
            mascot.style.animation = 'mascotFloat 3s ease-in-out infinite';
        });
    }

    // ===== KONAMI CODE (CHEAT CODE) ==============================================

    function initCheatCode() {
        var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        var konamiIndex = 0;
        var cheatActive = false;

        document.addEventListener('keydown', function(e) {
            if (cheatActive) return;

            if (e.keyCode === konami[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konami.length) {
                    activateCheat();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });

        function activateCheat() {
            cheatActive = true;
            var overlay = $('crt-overlay');
            overlay.style.background = 'radial-gradient(ellipse at center, rgba(255,255,0,0.3) 0%, transparent 70%)';
            overlay.style.transition = 'background 0.5s ease';

            // Show easter egg in CRT
            var titleScreen = $('crt-scene-title');
            var minigame = $('crt-scene-game');
            var egg = $('crt-scene-egg');
            titleScreen.style.display = 'none';
            minigame.style.display = 'none';
            egg.style.display = 'flex';

            // Flash screen
            var flash = document.createElement('div');
            flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,0,0.3);z-index:99999;pointer-events:none;';
            document.body.appendChild(flash);
            setTimeout(function() { flash.remove(); }, 500);

            setTimeout(function() { cheatActive = false; }, 3000);
        }

        // Easter egg return button
        $('secret-exit').addEventListener('click', function() {
            $('secret-screen').classList.remove('visible');
            $('crt-scene-egg').style.display = 'none';
            $('crt-scene-title').style.display = 'flex';
        });
    }

    // ===== NAVIGATION =============================================================

    function initNavigation() {
        var navLinks = document.querySelectorAll('.nav-link');
        var sections = document.querySelectorAll('section[id]');

        // Update active nav link on scroll
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function(link) { link.classList.remove('active'); });
                    var activeLink = document.querySelector('.nav-link[data-section="' + entry.target.id + '"]');
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(function(section) { observer.observe(section); });

        // Smooth scroll
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Update time
        function updateTime() {
            var now = new Date();
            var h = now.getHours().toString().padStart(2, '0');
            var m = now.getMinutes().toString().padStart(2, '0');
            $('nav-time').textContent = h + ':' + m;
        }
        updateTime();
        setInterval(updateTime, 10000);
    }

    // ===== MAIN CONTENT INIT (after boot) =======================================

    function initMainContent() {
        initHeroStats();
        initCartridgeGrid();
        initLeaderboard();
        initTimeline();
        initChiptunePlayer();
        initMinigame();
    }

    // ===== HERO STAT COUNTERS ====================================================

    function initHeroStats() {
        var statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            var duration = 2000;
            var start = performance.now();

            function update(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(eased * target);

                if (target >= 1000) {
                    el.textContent = current.toLocaleString();
                } else {
                    el.textContent = current;
                }

                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ===== CARTRIDGE GRID =========================================================

    function initCartridgeGrid() {
        var grid = $('cartridge-grid');
        var filterBtns = document.querySelectorAll('.filter-btn');

        function renderGames(filter) {
            grid.innerHTML = '';
            var filtered = filter === 'all' ? GAMES : GAMES.filter(function(g) {
                return g.platform.toLowerCase().indexOf(filter) !== -1;
            });

            filtered.forEach(function(game, i) {
                var card = document.createElement('div');
                card.className = 'cartridge-card';
                card.style.animationDelay = (i * 0.05) + 's';
                card.setAttribute('data-platform', game.platform.toLowerCase());

                card.innerHTML =
                    '<div class="cartridge-art" style="background: linear-gradient(135deg, ' + game.color + '22, ' + game.color + '08);">' +
                        '<span>' + game.icon + '</span>' +
                    '</div>' +
                    '<div class="cartridge-info">' +
                        '<div class="cartridge-name">' + game.name + '</div>' +
                        '<div class="cartridge-platform">' + game.platform + '</div>' +
                        '<div class="cartridge-meta">' +
                            '<span class="cartridge-rating">' + game.score + '</span>' +
                            '<span class="cartridge-year">' + game.year + '</span>' +
                        '</div>' +
                        '<div class="cartridge-tags">' +
                            game.genre.map(function(g) { return '<span class="cartridge-tag">' + g + '</span>'; }).join('') +
                        '</div>' +
                    '</div>';

                card.addEventListener('click', (function(g) {
                    return function() { openDetail(g); };
                })(game));
                grid.appendChild(card);
            });
        }

        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                renderGames(btn.getAttribute('data-filter'));
            });
        });

        renderGames('all');

        var overlay = $('cartridge-detail');
        $('detail-close-btn').addEventListener('click', function() {
            overlay.classList.remove('visible');
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.classList.remove('visible');
        });
    }

    function openDetail(game) {
        $('detail-art').style.background = 'linear-gradient(135deg, ' + game.color + '44, ' + game.color + '11)';
        $('detail-art').textContent = game.icon;
        $('detail-platform').textContent = game.platform;
        $('detail-year').textContent = game.year;
        $('detail-title').textContent = game.name;
        $('detail-desc').textContent = game.name + ' is a legendary title from the ' + game.year + ' era. Experience the adventure that defined a generation of gamers. This cartridge holds memories of countless hours of gameplay.';
        $('detail-score').textContent = game.score;
        $('detail-rarity').textContent = game.rarity;
        $('detail-completion').textContent = game.completion;
        $('detail-cheat').textContent = game.cheat;

        $('detail-genres').innerHTML = game.genre.map(function(g) {
            return '<span class="detail-genre-tag">' + g + '</span>';
        }).join('');
        $('cartridge-detail').classList.add('visible');
    }

    // ===== LEADERBOARD ============================================================

    function initLeaderboard() {
        var tabs = document.querySelectorAll('.lb-tab');
        var entries = $('lb-entries');

        function renderLeaderboard(category) {
            var data = LEADERBOARD_DATA[category] || [];
            entries.innerHTML = '';

            data.forEach(function(entry, i) {
                var rankClass = '';
                if (i === 0) rankClass = 'gold';
                else if (i === 1) rankClass = 'silver';
                else if (i === 2) rankClass = 'bronze';

                var div = document.createElement('div');
                div.className = 'lb-entry ' + rankClass;
                div.innerHTML =
                    '<span class="lb-rank ' + (i < 3 ? 'top' : '') + '">' + String(i + 1).padStart(2, '0') + '</span>' +
                    '<div>' +
                        '<div class="lb-name">' + entry.name + '</div>' +
                        '<div class="lb-game">' + entry.game + '</div>' +
                    '</div>' +
                    '<span class="lb-score">' + entry.score + '</span>';
                entries.appendChild(div);
            });
        }

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                renderLeaderboard(tab.getAttribute('data-lb'));
            });
        });

        renderLeaderboard('overall');

        // Submit score
        $('submit-score-btn').addEventListener('click', function() {
            var name = $('player-name').value.trim().toUpperCase() || 'ANONYMOUS';
            var score = parseInt($('player-score').value) || 0;

            if (score <= 0) {
                $('player-score').style.borderColor = '#ff0040';
                $('player-score').style.boxShadow = '0 0 10px rgba(255,0,64,0.3)';
                setTimeout(function() {
                    $('player-score').style.borderColor = '';
                    $('player-score').style.boxShadow = '';
                }, 1500);
                return;
            }

            var formattedScore = score.toLocaleString();
            LEADERBOARD_DATA.overall.push({ name: name, score: formattedScore, game: 'GoldenEye' });
            LEADERBOARD_DATA.overall.sort(function(a, b) {
                var av = parseInt(a.score.replace(/,/g, ''));
                var bv = parseInt(b.score.replace(/,/g, ''));
                return bv - av;
            });
            LEADERBOARD_DATA.overall = LEADERBOARD_DATA.overall.slice(0, 10);

            var activeTab = document.querySelector('.lb-tab.active');
            if (activeTab) renderLeaderboard(activeTab.getAttribute('data-lb'));

            $('player-name').value = '';
            $('player-score').value = '';

            // Flash effect
            var el = $('lb-entries');
            el.style.borderColor = '#00ff41';
            el.style.boxShadow = '0 0 20px rgba(0,255,65,0.2)';
            setTimeout(function() {
                el.style.borderColor = '';
                el.style.boxShadow = '';
            }, 800);
        });
    }

    // ===== TIMELINE ===============================================================

    function initTimeline() {
        var container = $('timeline-container');

        TIMELINE_DATA.forEach(function(item, i) {
            var div = document.createElement('div');
            div.className = 'timeline-item';
            div.innerHTML =
                '<div class="timeline-dot"></div>' +
                '<div class="timeline-content">' +
                    '<div class="timeline-year">' + item.year + '</div>' +
                    '<div class="timeline-title">' + item.title + '</div>' +
                    '<div class="timeline-desc">' + item.desc + '</div>' +
                '</div>';
            div.style.opacity = '0';
            div.style.transform = 'translateY(20px)';
            container.appendChild(div);

            // Scroll-trigger
            var node = div;
            var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        node.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        node.style.opacity = '1';
                        node.style.transform = 'translateY(0)';
                        obs.unobserve(node);
                    }
                });
            }, { threshold: 0.2 });
            obs.observe(node);
        });
    }

    // ===== CHIPTUNE PLAYER (Web Audio API) ========================================

    function initChiptunePlayer() {
        var audioCtx = null;
        var currentOscs = [];
        var currentGain = null;
        var isPlaying = false;
        var currentTrack = -1;
        var trackInterval = null;
        var startTime = 0;
        var animFrameId = null;

        var canvas = $('visualizer-canvas');
        var ctx = canvas.getContext('2d');
        var progressFill = $('progress-fill');
        var playBtn = $('ctrl-play');

        // Resize canvas to match its display size
        function resizeCanvas() {
            var rect = canvas.getBoundingClientRect();
            canvas.width = 600;
            canvas.height = 100;
        }
        resizeCanvas();

        // Draw static visualizer
        function drawStatic() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            var barCount = 64;
            var barWidth = canvas.width / barCount;

            for (var i = 0; i < barCount; i++) {
                var h = Math.random() * 3 + 1;
                ctx.fillStyle = 'rgba(0, 255, 65, ' + (Math.random() * 0.15) + ')';
                ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h);
            }
        }
        drawStatic();

        // Generate chiptune sound
        function startChiptune(trackIndex) {
            stopChiptune();

            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
            currentGain = audioCtx.createGain();
            currentGain.gain.value = 0.15;
            currentGain.connect(audioCtx.destination);

            var track = TRACKS[trackIndex];
            var freq = track.freq;
            var waveType = track.wave;

            // Create multiple voices for richness
            for (var v = 0; v < 3; v++) {
                var osc = audioCtx.createOscillator();
                var vca = audioCtx.createGain();

                osc.type = waveType;
                osc.frequency.value = freq * (v === 0 ? 1 : v === 1 ? 1.5 : 0.5);

                var baseVol = v === 0 ? 0.4 : v === 1 ? 0.15 : 0.1;
                vca.gain.value = baseVol;

                // Add slight detuning for warmth
                osc.detune.value = rand(-5, 5);

                osc.connect(vca);
                vca.connect(currentGain);
                osc.start();
                currentOscs.push({ osc: osc, vca: vca, baseVol: baseVol });
            }

            // Add a bass oscillator
            var bass = audioCtx.createOscillator();
            var bassGain = audioCtx.createGain();
            bass.type = 'square';
            bass.frequency.value = freq / 2;
            bassGain.gain.value = 0.2;
            bass.connect(bassGain);
            bassGain.connect(currentGain);
            bass.start();
            currentOscs.push({ osc: bass, vca: bassGain, baseVol: 0.2 });

            // Set volume from slider
            var vol = parseInt($('volume-slider').value) / 100;
            currentGain.gain.value = vol * 0.2;

            // Animate note changes
            var noteStep = 0;
            var noteSteps = [0, 4, 7, 12, 7, 4, 0, -3];
            var noteDuration = 60000 / track.bpm / 2;

            trackInterval = setInterval(function() {
                var semitones = noteSteps[noteStep % noteSteps.length];
                var newFreq = freq * Math.pow(2, semitones / 12);
                for (var j = 0; j < currentOscs.length; j++) {
                    if (j < currentOscs.length - 1) {
                        var mult = j === 0 ? 1 : j === 1 ? 1.5 : 0.5;
                        try {
                            currentOscs[j].osc.frequency.setValueAtTime(newFreq * mult, audioCtx.currentTime);
                        } catch (e) { /* ignore */ }
                    }
                }
                noteStep++;
            }, noteDuration);

            startTime = performance.now();
            isPlaying = true;
            playBtn.textContent = '\u23F8';

            // Start visualizer
            animateVisualizer(trackIndex);
        }

        function stopChiptune() {
            isPlaying = false;
            playBtn.textContent = '\u25B6';

            if (trackInterval) {
                clearInterval(trackInterval);
                trackInterval = null;
            }

            if (animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }

            if (currentOscs.length > 0) {
                for (var i = 0; i < currentOscs.length; i++) {
                    try {
                        currentOscs[i].osc.stop();
                        currentOscs[i].osc.disconnect();
                        currentOscs[i].vca.disconnect();
                    } catch (e) { /* ignore */ }
                }
                currentOscs = [];
            }

            if (currentGain) {
                try { currentGain.disconnect(); } catch (e) { /* ignore */ }
                currentGain = null;
            }

            if (audioCtx) {
                try { audioCtx.close(); } catch (e) { /* ignore */ }
                audioCtx = null;
            }
        }

        function animateVisualizer(trackIndex) {
            if (!isPlaying) return;

            var track = TRACKS[trackIndex];
            var elapsed = (performance.now() - startTime) / 1000;
            var totalDuration = parseDuration(track.duration);
            var progress = Math.min(elapsed / totalDuration, 1);

            // Update progress bar
            progressFill.style.width = (progress * 100) + '%';
            $('track-current').textContent = formatTime(elapsed);
            $('track-duration').textContent = track.duration;

            if (progress >= 1) {
                nextTrack();
                return;
            }

            // Draw visualizer bars
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            var barCount = 64;
            var barWidth = canvas.width / barCount;
            var time = performance.now() / 1000;

            for (var i = 0; i < barCount; i++) {
                var freq_val = (i / barCount) * 8 + 1;
                var amplitude = Math.sin(time * freq_val) * 0.5 + 0.5;
                var beatPulse = Math.sin(time * track.bpm / 60 * Math.PI * 2) * 0.3 + 0.7;
                var h = (amplitude * beatPulse * canvas.height * 0.8) + 2;

                var hue = (i / barCount) * 120 + time * 20;
                ctx.fillStyle = 'hsl(' + hue + ', 100%, ' + (40 + amplitude * 30) + '%)';
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'hsl(' + hue + ', 100%, 50%)';
                ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h);
                ctx.shadowBlur = 0;
            }

            animFrameId = requestAnimationFrame(function() { animateVisualizer(trackIndex); });
        }

        function parseDuration(str) {
            var parts = str.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }

        function formatTime(secs) {
            var m = Math.floor(secs / 60);
            var s = Math.floor(secs % 60);
            return m + ':' + String(s).padStart(2, '0');
        }

        function nextTrack() {
            currentTrack = (currentTrack + 1) % TRACKS.length;
            selectTrack(currentTrack);
        }

        function prevTrack() {
            currentTrack = (currentTrack - 1 + TRACKS.length) % TRACKS.length;
            selectTrack(currentTrack);
        }

        function selectTrack(index) {
            currentTrack = index;
            var track = TRACKS[index];
            $('np-title').textContent = '\u266A ' + track.name + ' \u2014 ' + track.composer;

            // Update track list highlighting
            var items = document.querySelectorAll('.track-item');
            for (var i = 0; i < items.length; i++) {
                if (i === index) {
                    items[i].classList.add('active');
                } else {
                    items[i].classList.remove('active');
                }
            }

            if (isPlaying) {
                startChiptune(index);
            }
        }

        // Build track list
        var trackList = $('track-list');
        for (var t = 0; t < TRACKS.length; t++) {
            (function(idx) {
                var track = TRACKS[idx];
                var div = document.createElement('div');
                div.className = 'track-item';
                div.innerHTML =
                    '<span class="track-number">' + String(idx + 1).padStart(2, '0') + '</span>' +
                    '<span class="track-name">' + track.name + '</span>' +
                    '<span class="track-duration">' + track.duration + '</span>';
                div.addEventListener('click', function() {
                    selectTrack(idx);
                    if (!isPlaying) startChiptune(idx);
                });
                trackList.appendChild(div);
            })(t);
        }

        // Controls
        playBtn.addEventListener('click', function() {
            if (currentTrack < 0) {
                currentTrack = 0;
                selectTrack(0);
            }
            if (isPlaying) {
                stopChiptune();
                drawStatic();
                $('track-current').textContent = '0:00';
            } else {
                startChiptune(currentTrack);
            }
        });

        $('ctrl-next').addEventListener('click', nextTrack);
        $('ctrl-prev').addEventListener('click', prevTrack);

        $('ctrl-shuffle').addEventListener('click', function() {
            currentTrack = rand(0, TRACKS.length - 1);
            selectTrack(currentTrack);
            if (!isPlaying) startChiptune(currentTrack);
        });

        $('ctrl-repeat').addEventListener('click', function() {
            this.classList.toggle('active');
        });

        $('volume-slider').addEventListener('input', function() {
            var vol = parseInt(this.value) / 100;
            if (currentGain) {
                try {
                    currentGain.gain.setValueAtTime(vol * 0.2, audioCtx.currentTime);
                } catch (e) { /* ignore */ }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT') return;
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    playBtn.click();
                    break;
                case 'ArrowRight':
                    nextTrack();
                    if (!isPlaying) startChiptune(currentTrack);
                    break;
                case 'ArrowLeft':
                    prevTrack();
                    if (!isPlaying) startChiptune(currentTrack);
                    break;
            }
        });
    }

    // ===== CRT MINIGAME ===========================================================

    function initMinigame() {
        var canvas = $('minigame-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var gameRunning = false;
        var ship = { x: 160, y: 170, w: 20, h: 16 };
        var bullets = [];
        var enemies = [];
        var particles = [];
        var score = 0;
        var keys = {};
        var spawnTimer = 0;
        var gameLoop = null;

        function startMinigame() {
            ship = { x: 160, y: 170, w: 20, h: 16 };
            bullets = [];
            enemies = [];
            particles = [];
            score = 0;
            spawnTimer = 0;
            gameRunning = true;

            function loop() {
                if (!gameRunning) return;
                update();
                draw();
                gameLoop = requestAnimationFrame(loop);
            }
            gameLoop = requestAnimationFrame(loop);
        }

        function stopMinigame() {
            gameRunning = false;
            if (gameLoop) cancelAnimationFrame(gameLoop);
        }

        function update() {
            // Ship movement
            if (keys['ArrowLeft'] || keys['KeyA']) ship.x = Math.max(10, ship.x - 4);
            if (keys['ArrowRight'] || keys['KeyD']) ship.x = Math.min(canvas.width - 30, ship.x + 4);
            if (keys['ArrowUp'] || keys['KeyW']) ship.y = Math.max(80, ship.y - 4);
            if (keys['ArrowDown'] || keys['KeyS']) ship.y = Math.min(canvas.height - 20, ship.y + 4);

            // Fire
            if (keys['Space']) {
                if (bullets.length < 5) {
                    bullets.push({ x: ship.x + ship.w / 2 - 1, y: ship.y - 6, w: 2, h: 6 });
                }
            }

            // Update bullets
            bullets = bullets.filter(function(b) {
                b.y -= 6;
                return b.y > -10;
            });

            // Spawn enemies
            spawnTimer++;
            if (spawnTimer % 30 === 0) {
                enemies.push({
                    x: rand(10, canvas.width - 30),
                    y: -20,
                    w: 16,
                    h: 12,
                    vx: rand(-1, 1),
                    vy: rand(1, 3),
                    color: 'hsl(' + rand(0, 360) + ', 100%, 60%)'
                });
            }

            // Update enemies
            enemies = enemies.filter(function(e) {
                e.x += e.vx;
                e.y += e.vy;
                if (Math.random() < 0.02) {
                    particles.push({ x: e.x + e.w / 2, y: e.y + e.h, vx: 0, vy: 3, life: 30, color: '#ff4444' });
                }
                return e.y < canvas.height + 20;
            });

            // Update particles
            particles = particles.filter(function(p) {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                return p.life > 0;
            });

            // Collision detection
            for (var bi = 0; bi < bullets.length; bi++) {
                var b = bullets[bi];
                for (var ei = enemies.length - 1; ei >= 0; ei--) {
                    var e = enemies[ei];
                    if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
                        for (var pi = 0; pi < 8; pi++) {
                            particles.push({
                                x: e.x + e.w / 2,
                                y: e.y + e.h / 2,
                                vx: Math.cos(pi * Math.PI / 4) * 2,
                                vy: Math.sin(pi * Math.PI / 4) * 2,
                                life: 20,
                                color: e.color
                            });
                        }
                        score += 100;
                        $('minigame-score').textContent = score;
                        enemies.splice(ei, 1);
                    }
                }
            }

            // Remove bullets that hit enemies
            bullets = bullets.filter(function(b) {
                for (var ei = 0; ei < enemies.length; ei++) {
                    var e = enemies[ei];
                    if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
                        return false;
                    }
                }
                return true;
            });

            // Check game over
            for (var ei = 0; ei < enemies.length; ei++) {
                var en = enemies[ei];
                if (en.y + en.h > ship.y && en.x + en.w > ship.x && en.x < ship.x + ship.w) {
                    gameRunning = false;
                }
            }
        }

        function draw() {
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars
            for (var i = 0; i < 30; i++) {
                var sx = (i * 137.5) % canvas.width;
                var sy = (i * 97.3 + Date.now() * 0.01) % canvas.height;
                ctx.fillStyle = 'rgba(100, 200, 100, ' + (0.2 + Math.sin(Date.now() / 500 + i) * 0.1) + ')';
                ctx.fillRect(sx, sy, 1, 1);
            }

            // Ship
            ctx.fillStyle = '#00ff41';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00ff41';
            ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
            ctx.fillStyle = '#003300';
            ctx.fillRect(ship.x + 5, ship.y + 4, 10, 8);
            ctx.shadowBlur = 0;

            // Engine flame
            ctx.fillStyle = pick(['#ff4400', '#ff8800', '#ffcc00']);
            ctx.fillRect(ship.x + 6, ship.y + ship.h, 8, rand(3, 8));

            // Bullets
            ctx.fillStyle = '#ffff00';
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#ffff00';
            for (var bi = 0; bi < bullets.length; bi++) {
                ctx.fillRect(bullets[bi].x, bullets[bi].y, bullets[bi].w, bullets[bi].h);
            }
            ctx.shadowBlur = 0;

            // Enemies
            for (var ei = 0; ei < enemies.length; ei++) {
                var e = enemies[ei];
                ctx.fillStyle = e.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = e.color;
                ctx.fillRect(e.x, e.y, e.w, e.h);
                ctx.fillStyle = '#000';
                ctx.fillRect(e.x + 3, e.y + 3, 4, 4);
                ctx.fillRect(e.x + 9, e.y + 3, 4, 4);
                ctx.shadowBlur = 0;
            }

            // Particles
            for (var pi = 0; pi < particles.length; pi++) {
                var p = particles[pi];
                ctx.globalAlpha = p.life / 30;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, 2, 2);
            }
            ctx.globalAlpha = 1;

            // Score overlay
            ctx.font = '12px "Press Start 2P", monospace';
            ctx.fillStyle = '#00ffff';
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#00ffff';
            ctx.fillText('SCORE: ' + score, 10, 15);
            ctx.shadowBlur = 0;

            // Scanline effect on canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            for (var sy2 = 0; sy2 < canvas.height; sy2 += 3) {
                ctx.fillRect(0, sy2, canvas.width, 1);
            }
        }

        // Listen for game start from CRT scene
        document.addEventListener('keydown', function(e) {
            keys[e.code] = true;

            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                var titleScreen = $('crt-scene-title');
                var minigameScreen = $('crt-scene-game');
                var eggScreen = $('crt-scene-egg');

                if (titleScreen.style.display !== 'none' && eggScreen.style.display === 'none') {
                    titleScreen.style.display = 'none';
                    minigameScreen.style.display = 'flex';
                    $('minigame-score').textContent = '0';
                    startMinigame();
                }
            }

            if (e.code === 'Escape') {
                stopMinigame();
                var minigameScreen = $('crt-scene-game');
                var titleScreen = $('crt-scene-title');
                if (minigameScreen.style.display !== 'none') {
                    minigameScreen.style.display = 'none';
                    titleScreen.style.display = 'flex';
                }
                var eggScreen = $('crt-scene-egg');
                if (eggScreen.style.display !== 'none') {
                    eggScreen.style.display = 'none';
                    titleScreen.style.display = 'flex';
                }
                $('secret-screen').classList.remove('visible');
            }
        });

        document.addEventListener('keyup', function(e) {
            keys[e.code] = false;
        });

        // Prevent arrow keys from scrolling
        window.addEventListener('keydown', function(e) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].indexOf(e.code) !== -1) {
                if (e.target.tagName !== 'INPUT') e.preventDefault();
            }
        });
    }

    // ===== SCROLL-TRIGGERED REVEALS ==============================================

    function initScrollAnimations() {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        var sections = document.querySelectorAll('section');
        for (var i = 0; i < sections.length; i++) {
            sections[i].style.opacity = '0';
            sections[i].style.transform = 'translateY(30px)';
            sections[i].style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(sections[i]);
        }

        $('hero').style.opacity = '1';
        $('hero').style.transform = 'none';
    }

    // ===== VHS TRACKING EFFECT (random glitch) ==================================

    function initVHSGlitch() {
        setInterval(function() {
            var static = $('vhs-static');
            if (Math.random() < 0.005) {
                static.style.opacity = '0.15';
                setTimeout(function() {
                    static.style.opacity = '0';
                }, rand(50, 200));
            }
        }, 3000);

        var mainContent = $('main-content');
        setInterval(function() {
            if (Math.random() < 0.003) {
                var skew = (Math.random() - 0.5) * 0.5;
                mainContent.style.transform = 'translate(' + ((Math.random() - 0.5) * 2) + 'px, ' + ((Math.random() - 0.5) * 2) + 'px) skewX(' + skew + 'deg)';
                setTimeout(function() {
                    mainContent.style.transform = '';
                }, rand(30, 80));
            }
        }, 5000);
    }

    // ===== CRT SCENE INTERACTION ==================================================

    function initCRTSceneInteraction() {
        window.addEventListener('scroll', function() {
            var scrollY = window.scrollY;
            var heroSection = $('hero');
            var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

            if (scrollY > heroBottom - 100) {
                var titleScreen = $('crt-scene-title');
                if (titleScreen.style.display !== 'none') {
                    // Keep title visible but dim when scrolled past
                }
            }
        }, { passive: true });
    }

    // ===== SECRET SCREEN TRIGGER (click 5 times on mascot) ========================

    function initSecretTrigger() {
        var clicks = 0;
        var clickTimer = null;

        $('mascot-container').addEventListener('click', function() {
            clicks++;
            if (clicks >= 5) {
                $('secret-screen').classList.add('visible');
                clicks = 0;
            }
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(function() { clicks = 0; }, 3000);
        });
    }

    // ===== AMBIENT SOUND EFFECT (Web Audio beeps on interaction) ================

    function initAmbientSounds() {
        var beepSound = function(freq, vol, dur) {
            try {
                var ctx = new (window.AudioContext || window.webkitAudioContext)();
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = freq;
                gain.gain.value = vol;
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + dur);
            } catch (err) { /* ignore */ }
        };

        document.addEventListener('mouseover', function(e) {
            if (e.target.classList.contains('btn-retro') || e.target.classList.contains('cartridge-card') || e.target.classList.contains('filter-btn')) {
                beepSound(880, 0.03, 0.08);
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.closest('.btn-retro') || e.target.closest('.cartridge-card') || e.target.closest('.filter-btn') || e.target.closest('.track-item')) {
                beepSound(1320, 0.05, 0.05);
            }
        });
    }

    // ===== INITIALIZATION ========================================================

    document.addEventListener('DOMContentLoaded', function() {
        initBootSequence();
        initCustomCursor();
        initMascot();
        initCheatCode();
        initNavigation();
        initScrollAnimations();
        initVHSGlitch();
        initCRTSceneInteraction();
        initSecretTrigger();
        initAmbientSounds();
    });

})();