/* ============================================
   THE WANDERER'S CODEX - SCRIPTS
   Retro Fantasy RPG Website
============================================ */

(function() {
    'use strict';

    // ============================================
    // INITIALIZATION
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initParticles();
        initFloatingRunes();
        initQuestBoard();
        initSpellGrimoire();
        initInventory();
        initBestiary();
        initModal();
        initToast();
        initScrollAnimations();
        initKeyboardShortcuts();
        initGameTime();
    });

    // ============================================
    // NAVIGATION
    // ============================================
    function initNavigation() {
        var mobileToggle = document.getElementById('mobileToggle');
        var sidebar = document.getElementById('sidebar');
        var navLinks = document.querySelectorAll('.nav-link');
        var sections = document.querySelectorAll('.content-section');

        if (!mobileToggle || !sidebar) return;

        // Mobile navigation toggle
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });

        // Section navigation
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var targetId = link.getAttribute('data-section');

                // Update active states
                navLinks.forEach(function(l) {
                    l.classList.remove('active');
                });
                link.classList.add('active');

                // Show target section
                sections.forEach(function(section) {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                        triggerSectionAnimations(section);
                    }
                });

                // Close mobile nav
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('active');

                // Smooth scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    function initParticles() {
        var particleContainer = document.getElementById('particles');
        if (!particleContainer) return;

        var particleCount = 15;
        var particleSymbols = ['*', '+', '.', '-'];

        for (var i = 0; i < particleCount; i++) {
            createParticle(particleContainer, particleSymbols);
        }

        // Continuously spawn particles
        setInterval(function() {
            if (particleContainer.children.length < particleCount) {
                createParticle(particleContainer, particleSymbols);
            }
        }, 3000);
    }

    function createParticle(container, symbols) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 10 + 8) + 'px';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);

        // Remove particle after animation
        setTimeout(function() {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 25000);
    }

    // ============================================
    // FLOATING RUNES
    // ============================================
    function initFloatingRunes() {
        var runesContainer = document.getElementById('runes');
        if (!runesContainer) return;

        var runes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
        var runeCount = 6;

        for (var i = 0; i < runeCount; i++) {
            var rune = document.createElement('div');
            rune.className = 'rune';
            rune.textContent = runes[Math.floor(Math.random() * runes.length)];
            rune.style.left = Math.random() * 100 + '%';
            rune.style.top = Math.random() * 100 + '%';
            rune.style.fontSize = (Math.random() * 15 + 15) + 'px';
            rune.style.animationDelay = Math.random() * 6 + 's';
            runesContainer.appendChild(rune);
        }
    }

    // ============================================
    // QUEST BOARD
    // ============================================
    function initQuestBoard() {
        var acceptButtons = document.querySelectorAll('.quest-accept-btn');

        acceptButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var questNotice = btn.closest('.quest-notice');
                var questName = questNotice.querySelector('.notice-title').textContent;

                // Animate button
                btn.classList.add('accepted');
                setTimeout(function() {
                    btn.classList.remove('accepted');
                }, 300);

                // Show modal
                showQuestModal(questName);

                // Show toast
                showToast('Quest "' + questName + '" added to journal!', 'scroll');
            });
        });

        // Randomly wobble notices occasionally
        setInterval(function() {
            var questNotices = document.querySelectorAll('.quest-notice');
            if (questNotices.length > 0) {
                var randomNotice = questNotices[Math.floor(Math.random() * questNotices.length)];
                var wobble = (Math.random() * 4 - 2);
                randomNotice.style.transform = 'rotate(' + wobble + 'deg)';
                setTimeout(function() {
                    randomNotice.style.transform = '';
                }, 2000);
            }
        }, 8000);
    }

    // ============================================
    // SPELL GRIMOIRE
    // ============================================
    function initSpellGrimoire() {
        var levelTabs = document.querySelectorAll('.level-tab');
        var spellGroups = document.querySelectorAll('.spell-level-group');
        var spellEntries = document.querySelectorAll('.spell-entry');

        // Level tab switching
        levelTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var level = tab.getAttribute('data-level');

                // Update active tab
                levelTabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');

                // Update visible spell group
                spellGroups.forEach(function(group) {
                    group.classList.remove('active');
                    if (group.getAttribute('data-level') === level) {
                        group.classList.add('active');
                        animateSpellList(group);
                    }
                });
            });
        });

        // Spell entry clicking
        spellEntries.forEach(function(entry) {
            entry.addEventListener('click', function() {
                var spellId = entry.getAttribute('data-spell');

                // Update active spell entry
                spellEntries.forEach(function(e) {
                    e.classList.remove('active');
                });
                entry.classList.add('active');

                // Show spell detail
                showSpellDetail(spellId);
            });
        });

        // Initialize first spell as selected
        var firstSpell = document.querySelector('.spell-entry');
        if (firstSpell) {
            firstSpell.classList.add('active');
        }
    }

    function animateSpellList(group) {
        var entries = group.querySelectorAll('.spell-entry');
        entries.forEach(function(entry, index) {
            entry.style.opacity = '0';
            entry.style.transform = 'translateX(-20px)';
            setTimeout(function() {
                entry.style.transition = 'all 0.3s ease-out';
                entry.style.opacity = '1';
                entry.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }

    function showSpellDetail(spellId) {
        var detailContainer = document.querySelector('.spell-detail-container');
        if (!detailContainer) return;

        var details = detailContainer.querySelectorAll('.spell-detail');
        details.forEach(function(detail) {
            detail.classList.remove('active');
            if (detail.id === 'spell-' + spellId) {
                detail.classList.add('active');
            }
        });
    }

    // ============================================
    // INVENTORY
    // ============================================
    function initInventory() {
        var quickSlots = document.querySelectorAll('.quick-slot');
        var inventorySlots = document.querySelectorAll('.inventory-slot:not(.empty)');

        // Add use item functionality
        quickSlots.forEach(function(slot) {
            slot.addEventListener('click', function() {
                var itemCount = slot.querySelector('.item-count');
                if (itemCount) {
                    var currentCount = parseInt(itemCount.textContent, 10);
                    if (currentCount > 1) {
                        itemCount.textContent = currentCount - 1;
                        showToast('Used 1 item', 'sparkles');
                    } else {
                        showToast('No more items remaining!', 'warning');
                    }
                }
            });
        });

        // Add equip item functionality
        inventorySlots.forEach(function(slot) {
            slot.addEventListener('click', function() {
                var tooltipName = slot.querySelector('.tooltip-name');
                var itemName = tooltipName ? tooltipName.textContent : 'Item';
                showToast('Viewing ' + itemName, 'eye');
            });
        });

        // Add weight animation when near capacity
        var weightFill = document.querySelector('.weight-fill');
        if (weightFill) {
            var width = parseFloat(weightFill.style.width) || 0;
            if (width > 90) {
                weightFill.style.animation = 'glowPulse 2s ease-in-out infinite';
            }
        }
    }

    // ============================================
    // BESTIARY
    // ============================================
    function initBestiary() {
        var creatureEntries = document.querySelectorAll('.creature-entry');

        creatureEntries.forEach(function(entry) {
            entry.addEventListener('click', function() {
                entry.classList.toggle('expanded');
            });

            entry.addEventListener('mouseenter', function() {
                var crValue = entry.querySelector('.cr-value');
                if (crValue) {
                    crValue.style.transform = 'scale(1.1)';
                    crValue.style.transition = 'transform 0.2s ease';
                }
            });

            entry.addEventListener('mouseleave', function() {
                var crValue = entry.querySelector('.cr-value');
                if (crValue) {
                    crValue.style.transform = 'scale(1)';
                }
            });
        });
    }

    // ============================================
    // MODAL SYSTEM
    // ============================================
    function initModal() {
        var modal = document.getElementById('questModal');
        var modalClose = document.getElementById('modalClose');
        var modalBackdrop = modal.querySelector('.modal-backdrop');

        if (!modal || !modalClose || !modalBackdrop) return;

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        modalClose.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function showQuestModal(questName) {
        var modal = document.getElementById('questModal');
        var modalTitle = modal.querySelector('.modal-title');
        var modalMessage = modal.querySelector('.modal-message');

        if (modalTitle) modalTitle.textContent = 'Quest Accepted!';
        if (modalMessage) modalMessage.textContent = '"' + questName + '" has been added to your quest journal.';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Auto close after 3 seconds
        setTimeout(function() {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 3000);
    }

    // ============================================
    // TOAST NOTIFICATIONS
    // ============================================
    function initToast() {
        // Toast system is ready
    }

    function showToast(message, icon) {
        var container = document.getElementById('toastContainer');
        if (!container) return;

        var toast = document.createElement('div');
        toast.className = 'toast';

        var iconSpan = document.createElement('span');
        iconSpan.className = 'toast-icon';
        iconSpan.textContent = getIconEmoji(icon);

        var messageSpan = document.createElement('span');
        messageSpan.className = 'toast-message';
        messageSpan.textContent = message;

        toast.appendChild(iconSpan);
        toast.appendChild(messageSpan);
        container.appendChild(toast);

        // Remove after animation
        setTimeout(function() {
            toast.classList.add('removing');
            setTimeout(function() {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }

    function getIconEmoji(icon) {
        var icons = {
            'scroll': '\u{1F4DC}',
            'sparkles': '\u2728',
            'warning': '\u26A0\uFE0F',
            'eye': '\u{1F441}',
            'star': '\u2B50',
            'check': '\u2714\uFE0F'
        };
        return icons[icon] || '\u2728';
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        var observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.quest-notice, .stat-block, .skill-item, .trait-block, .creature-entry').forEach(function(el) {
            observer.observe(el);
        });
    }

    function triggerSectionAnimations(section) {
        setTimeout(function() {
            var notices = section.querySelectorAll('.quest-notice');
            notices.forEach(function(notice, index) {
                notice.style.animation = 'none';
                notice.offsetHeight; // Trigger reflow
                notice.style.animation = 'noticeAppear 0.5s ease-out ' + (index * 0.1) + 's backwards';
            });

            // Animate stats if on character sheet
            if (section.id === 'character-sheet') {
                animateStats();
            }

            // Animate inventory if on inventory
            if (section.id === 'inventory') {
                animateInventory();
            }
        }, 100);
    }

    function animateStats() {
        var statBlocks = document.querySelectorAll('.stat-block');
        statBlocks.forEach(function(block, index) {
            var barFill = block.querySelector('.stat-bar-fill');
            if (barFill) {
                var width = barFill.style.width;
                barFill.style.width = '0%';
                setTimeout(function() {
                    barFill.style.width = width;
                }, index * 100);
            }
        });
    }

    function animateInventory() {
        var slots = document.querySelectorAll('.inventory-slot:not(.empty)');
        slots.forEach(function(slot, index) {
            slot.style.opacity = '0';
            slot.style.transform = 'scale(0.8)';
            setTimeout(function() {
                slot.style.transition = 'all 0.3s ease-out';
                slot.style.opacity = '1';
                slot.style.transform = 'scale(1)';
            }, index * 30);
        });
    }

    // ============================================
    // GAME TIME SIMULATION
    // ============================================
    function initGameTime() {
        var timeText = document.querySelector('.time-text');
        if (!timeText) return;

        var day = 47;
        var year = 842;

        setInterval(function() {
            // Randomly advance time (simulated)
            var event = Math.random();
            if (event < 0.02) { // 2% chance to advance day
                day++;
                if (day > 30) {
                    day = 1;
                    year++;
                }
                // Update display
                var phases = ['Dawn', 'Morning', 'Midday', 'Afternoon', 'Dusk', 'Evening', 'Midnight', 'Late Night'];
                var currentPhase = phases[Math.floor(Math.random() * phases.length)];
                var moonPhases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
                var moon = moonPhases[Math.floor(Math.random() * moonPhases.length)];
                timeText.textContent = currentPhase + ', Day ' + day + ', Year ' + year + ' (' + moon + ')';
            }
        }, 10000);
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            var target = e.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            var sections = ['quest-board', 'character-sheet', 'spell-grimoire', 'inventory', 'bestiary'];
            var key = e.key;

            // Number keys 1-5 for quick navigation
            if (e.altKey && ['1', '2', '3', '4', '5'].indexOf(key) !== -1) {
                e.preventDefault();
                var index = parseInt(key, 10) - 1;
                var targetSection = document.getElementById(sections[index]);
                if (targetSection) {
                    var navLink = document.querySelector('[data-section="' + sections[index] + '"]');
                    if (navLink) navLink.click();
                }
            }

            // 'M' to toggle mobile nav
            if (key === 'm' || key === 'M') {
                var toggle = document.getElementById('mobileToggle');
                if (toggle) toggle.click();
            }
        });
    }

    // ============================================
    // CONSOLE EASTER EGG
    // ============================================
    console.log('%c THE WANDERER\'S CODEX ', 'background: #1a1520; color: #d4a84b; font-size: 16px; font-weight: bold; padding: 8px; border-radius: 4px;');
    console.log('%c An adventurer\'s archive of quests, spells, and mysteries...', 'color: #9d8ec7; font-style: italic;');
    console.log('%c Press Alt+1-5 to navigate quickly between sections!', 'color: #c9a227;');

    // ============================================
    // DATA STORAGE
    // ============================================
    var GameData = {
        player: {
            name: 'Seraphina Nightwhisper',
            level: 24,
            classType: 'Mage',
            race: 'Half-Elf',
            gold: 2847,
            day: 47,
            year: 842
        },
        quests: {
            accepted: [],
            completed: [],
            failed: []
        },
        inventory: {
            items: [],
            capacity: 200,
            currentWeight: 186
        },
        spells: {
            prepared: [],
            known: []
        },
        settings: {
            soundEnabled: true,
            musicVolume: 0.5,
            showTooltips: true
        }
    };

    // Save game state
    function saveGame() {
        try {
            localStorage.setItem('wanderersCodex', JSON.stringify(GameData));
            showToast('Game saved!', 'star');
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    // Load game state
    function loadGame() {
        try {
            var saved = localStorage.getItem('wanderersCodex');
            if (saved) {
                var parsed = JSON.parse(saved);
                Object.keys(parsed).forEach(function(key) {
                    GameData[key] = parsed[key];
                });
                showToast('Game loaded!', 'star');
            }
        } catch (e) {
            console.error('Failed to load game:', e);
        }
    }

    // Auto-save every 60 seconds
    setInterval(saveGame, 60000);

    // Save before leaving
    window.addEventListener('beforeunload', saveGame);

    // Try to load on startup
    loadGame();

})();