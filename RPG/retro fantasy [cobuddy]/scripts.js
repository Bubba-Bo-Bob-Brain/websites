// ==========================================
// THE OBSIDIAN HEARTH — Scripts
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Tab Navigation ----------
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add('active');
                target.style.animation = 'none';
                target.offsetHeight; // trigger reflow
                target.style.animation = 'fade-in 0.5s ease forwards';
            }
        });
    });

    // ---------- Character Sheet Interactions ----------
    const statBlocks = document.querySelectorAll('.stat-block');

    statBlocks.forEach(block => {
        block.addEventListener('click', () => {
            const statName = block.querySelector('.stat-label').textContent;
            const statValue = block.querySelector('.stat-value').textContent;
            const modifier = block.querySelector('.stat-modifier').textContent;

            block.style.animation = 'none';
            block.offsetHeight;
            block.style.animation = 'stat-pulse 0.4s ease';

            // Brief highlight
            block.style.borderColor = 'var(--amber-light)';
            setTimeout(() => {
                block.style.borderColor = '';
            }, 600);
        });
    });

    // Add stat pulse animation dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes stat-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); background: rgba(212, 168, 67, 0.15); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);

    // ---------- Dice Roller ----------
    const diceRoller = document.createElement('div');
    diceRoller.className = 'dice-roller';
    diceRoller.innerHTML = `
        <div class="dice-container">
            <button class="dice-btn" data-dice="d4">d4</button>
            <button class="dice-btn" data-dice="d6">d6</button>
            <button class="dice-btn" data-dice="d8">d8</button>
            <button class="dice-btn" data-dice="d10">d10</button>
            <button class="dice-btn" data-dice="d20">d20</button>
            <button class="dice-btn" data-dice="d100">d100</button>
        </div>
        <div class="dice-result">Roll the dice...</div>
    `;
    document.querySelector('.character-sheet').appendChild(diceRoller);

    const diceButtons = diceRoller.querySelectorAll('.dice-btn');
    const diceResult = diceRoller.querySelector('.dice-result');

    diceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sides = parseInt(btn.dataset.dice.replace('d', ''));
            const roll = Math.floor(Math.random() * sides) + 1;

            diceResult.textContent = `🎲 ${roll}`;
            diceResult.style.animation = 'none';
            diceResult.offsetHeight;
            diceResult.style.animation = 'dice-bounce 0.5s ease';

            // Highlight the button briefly
            btn.style.background = 'rgba(212, 168, 67, 0.3)';
            setTimeout(() => {
                btn.style.background = '';
            }, 300);
        });
    });

    // Dice bounce animation
    const diceStyle = document.createElement('style');
    diceStyle.textContent = `
        @keyframes dice-bounce {
            0% { transform: translateY(0) scale(1); }
            30% { transform: translateY(-8px) scale(1.1); }
            60% { transform: translateY(-3px) scale(1.05); }
            100% { transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(diceStyle);

    // ---------- Quest Board: Reveal Hidden Quest ----------
    const hiddenQuest = document.querySelector('.hidden-quest');
    if (hiddenQuest) {
        hiddenQuest.addEventListener('click', () => {
            hiddenQuest.style.transition = 'all 1s ease';
            hiddenQuest.style.filter = 'none';
            hiddenQuest.style.opacity = '1';
            hiddenQuest.style.transform = 'translateX(0)';

            const blurredElements = hiddenQuest.querySelectorAll('[style*="blur"]');
            blurredElements.forEach(el => {
                el.style.filter = 'none';
                el.style.userSelect = '';
            });

            // Change the notice-tag
            const tag = hiddenQuest.querySelector('.notice-tag');
            if (tag) {
                tag.textContent = '🌑 Clandestine — REVEALED';
                tag.style.background = 'rgba(139, 26, 26, 0.3)';
                tag.style.color = '#e74c3c';
                tag.style.borderColor = 'rgba(139, 26, 26, 0.5)';
            }
        });
    }

    // ---------- Inventory: Click to Inspect ----------
    const invSlots = document.querySelectorAll('.inv-slot');

    invSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const itemName = slot.querySelector('.inv-name').textContent;
            const itemType = slot.querySelector('.inv-type').textContent;
            const itemRarity = slot.querySelector('.inv-rarity')?.textContent || 'Common';
            const itemIcon = slot.querySelector('.inv-icon').textContent;

            // Create tooltip
            let tooltip = document.querySelector('.item-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'item-tooltip';
                document.body.appendChild(tooltip);
            }

            tooltip.innerHTML = `
                <div class="tooltip-header">
                    <span class="tooltip-icon">${itemIcon}</span>
                    <span class="tooltip-name">${itemName}</span>
                </div>
                <div class="tooltip-type">${itemType}</div>
                <div class="tooltip-rarity ${itemRarity.toLowerCase().replace(/\s/g, '-')}">${itemRarity}</div>
            `;

            const rect = slot.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`;
            tooltip.style.transform = 'translateX(-50%)';

            tooltip.style.animation = 'none';
            tooltip.offsetHeight;
            tooltip.style.animation = 'tooltip-appear 0.3s ease forwards';

            // Remove tooltip after delay
            clearTimeout(slot._tooltipTimer);
            slot._tooltipTimer = setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateX(-50%) translateY(5px)';
                setTimeout(() => tooltip.style.display = 'none', 300);
            }, 2000);
        });
    });

    // Tooltip styles
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .item-tooltip {
            position: fixed;
            z-index: 1000;
            background: linear-gradient(135deg, rgba(30, 18, 10, 0.97), rgba(20, 12, 6, 0.98));
            border: 1px solid var(--amber-dark);
            border-radius: 6px;
            padding: 12px 16px;
            min-width: 200px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
            pointer-events: none;
            display: none;
        }
        .tooltip-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
        }
        .tooltip-icon {
            font-size: 1.4rem;
        }
        .tooltip-name {
            font-family: var(--font-heading);
            font-size: 1rem;
            color: var(--amber-light);
        }
        .tooltip-type {
            font-size: 0.8rem;
            color: var(--parchment-dark);
            opacity: 0.7;
            margin-bottom: 6px;
        }
        .tooltip-rarity {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        .tooltip-rarity.common { color: var(--common-gray); }
        .tooltip-rarity.uncommon { color: var(--uncommon-green); }
        .tooltip-rarity.rare { color: var(--rare-blue); }
        .tooltip-rarity.magic { color: var(--magic-purple); }
        @keyframes tooltip-appear {
            from { opacity: 0; transform: translateX(-50%) translateY(5px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(tooltipStyle);

    // ---------- Spell Book: Page Hover Effect ----------
    const spellEntries = document.querySelectorAll('.spell-entry');

    spellEntries.forEach(entry => {
        entry.addEventListener('mouseenter', () => {
            entry.style.paddingLeft = '16px';
        });
        entry.addEventListener('mouseleave', () => {
            entry.style.paddingLeft = '0';
        });
    });

    // ---------- Candle Flame Enhancement ----------
    const flames = document.querySelectorAll('.flame');

    flames.forEach(flame => {
        flame.addEventListener('mouseenter', () => {
            flame.style.animationDuration = '0.3s';
            flame.style.transform = 'translateX(-50%) scale(1.2)';
        });
        flame.addEventListener('mouseleave', () => {
            flame.style.animationDuration = '0.8s';
            flame.style.transform = 'translateX(-50%) scale(1)';
        });
    });

    // ---------- Ambient Firefly Spawner ----------
    const firefliesContainer = document.querySelector('.fireflies');

    function spawnFirefly() {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.animationDuration = `${6 + Math.random() * 6}s`;
        firefly.style.animationDelay = `${Math.random() * 4}s`;
        firefliesContainer.appendChild(firefly);

        setTimeout(() => {
            firefly.remove();
        }, 15000);
    }

    // Spawn new fireflies periodically
    setInterval(spawnFirefly, 4000);

    // ---------- Inventory Grid: Drag-like Hover Effect ----------
    invSlots.forEach(slot => {
        slot.addEventListener('mouseenter', () => {
            slot.style.boxShadow = '0 0 20px rgba(212, 168, 67, 0.15), 0 4px 15px rgba(0, 0, 0, 0.4)';
        });
        slot.addEventListener('mouseleave', () => {
            slot.style.boxShadow = '';
        });
    });

    // ---------- Quest Notices: Subtle Tilt on Hover ----------
    const questNotices = document.querySelectorAll('.quest-notice:not(.hidden-quest)');

    questNotices.forEach(notice => {
        notice.addEventListener('mouseenter', () => {
            const rect = notice.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const rotateX = ((mouseY - centerY) / rect.height) * -3;
            const rotateY = ((mouseX - centerX) / rect.width) * 3;

            notice.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(4px)`;
        });
        notice.addEventListener('mouseleave', () => {
            notice.style.transform = '';
        });
    });

    // ---------- Gold Counter Animation ----------
    const goldAmount = document.querySelector('.gold-amount');
    if (goldAmount) {
        const targetGold = 1247;
        let currentGold = 0;
        const increment = Math.ceil(targetGold / 40);

        function animateGold() {
            currentGold += increment;
            if (currentGold >= targetGold) {
                currentGold = targetGold;
                goldAmount.textContent = currentGold.toLocaleString();
                return;
            }
            goldAmount.textContent = currentGold.toLocaleString();
            requestAnimationFrame(() => setTimeout(animateGold, 30));
        }

        // Trigger on inventory tab activation
        const inventoryTab = document.querySelector('[data-tab="inventory"]');
        if (inventoryTab) {
            inventoryTab.addEventListener('click', () => {
                setTimeout(animateGold, 300);
            });
        }
    }

    // ---------- Proficiency Badge Click ----------
    const proficiencies = document.querySelectorAll('.proficiency');

    proficiencies.forEach(prof => {
        prof.addEventListener('click', () => {
            prof.style.animation = 'none';
            prof.offsetHeight;
            prof.style.animation = 'badge-pop 0.3s ease';
        });
    });

    const badgeStyle = document.createElement('style');
    badgeStyle.textContent = `
        @keyframes badge-pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); background: rgba(212, 168, 67, 0.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(badgeStyle);

    // ---------- Ability Card Click ----------
    const abilities = document.querySelectorAll('.ability');

    abilities.forEach(ability => {
        ability.addEventListener('click', () => {
            const name = ability.querySelector('.ability-name').textContent;
            const desc = ability.querySelector('.ability-desc').textContent;

            let modal = document.querySelector('.ability-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.className = 'ability-modal-overlay';
                modal.innerHTML = `
                    <div class="ability-modal">
                        <button class="modal-close">&times;</button>
                        <h3 class="modal-ability-name"></h3>
                        <p class="modal-ability-desc"></p>
                    </div>
                `;
                document.body.appendChild(modal);

                modal.querySelector('.modal-close').addEventListener('click', () => {
                    modal.style.animation = 'modal-fade 0.3s ease forwards';
                    setTimeout(() => modal.style.display = 'none', 300);
                });

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.style.animation = 'modal-fade 0.3s ease forwards';
                        setTimeout(() => modal.style.display = 'none', 300);
                    }
                });
            }

            modal.querySelector('.modal-ability-name').textContent = name;
            modal.querySelector('.modal-ability-desc').textContent = desc;
            modal.style.display = 'flex';
            modal.style.animation = 'none';
            modal.offsetHeight;
            modal.style.animation = 'modal-appear 0.3s ease forwards';
        });
    });

    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .ability-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
        }
        .ability-modal {
            background: linear-gradient(135deg, rgba(44, 24, 16, 0.98), rgba(20, 12, 6, 0.99));
            border: 2px solid var(--amber-dark);
            border-radius: 8px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            position: relative;
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
        }
        .modal-close {
            position: absolute;
            top: 10px;
            right: 14px;
            background: none;
            border: none;
            color: var(--parchment-dark);
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.5;
            transition: opacity 0.3s;
            line-height: 1;
        }
        .modal-close:hover {
            opacity: 1;
            color: var(--amber-light);
        }
        .modal-ability-name {
            font-family: var(--font-display);
            font-size: 1.3rem;
            color: var(--amber-light);
            margin-bottom: 12px;
        }
        .modal-ability-desc {
            font-family: var(--font-body);
            color: var(--parchment-dark);
            line-height: 1.6;
            font-size: 1rem;
        }
        @keyframes modal-appear {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes modal-fade {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(modalStyles);

    // ---------- Scroll-triggered reveal for sections ----------
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

    // Observe all tab contents
    tabContents.forEach(content => {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(content);
    });

    // Make active tab visible immediately
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        activeTab.style.opacity = '1';
        activeTab.style.transform = 'translateY(0)';
    }

    // ---------- HP Bar Animation on Load ----------
    const hpFill = document.querySelector('.hp-fill');
    if (hpFill) {
        const hpWidth = hpFill.style.width;
        hpFill.style.width = '0%';
        setTimeout(() => {
            hpFill.style.width = hpWidth;
        }, 500);
    }

    // ---------- Resources Bar Stagger Animation ----------
    const resources = document.querySelectorAll('.resource');
    resources.forEach((resource, index) => {
        resource.style.opacity = '0';
        resource.style.transform = 'translateY(10px)';
        resource.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
        setTimeout(() => {
            resource.style.opacity = '1';
            resource.style.transform = 'translateY(0)';
        }, 600 + index * 100);
    });

    // ---------- Nav Tab Stagger on Load ----------
    navTabs.forEach((tab, index) => {
        tab.style.opacity = '0';
        tab.style.transform = 'translateY(10px)';
        tab.style.transition = `opacity 0.4s ease ${0.2 + index * 0.1}s, transform 0.4s ease ${0.2 + index * 0.1}s`;
        setTimeout(() => {
            tab.style.opacity = '1';
            tab.style.transform = 'translateY(0)';
        }, 100);
    });

    // ---------- Portrait Frame Glow ----------
    const portraitFrame = document.querySelector('.portrait-frame');
    if (portraitFrame) {
        setInterval(() => {
            portraitFrame.style.boxShadow = `
                0 0 ${15 + Math.random() * 10}px rgba(212, 168, 67, ${0.1 + Math.random() * 0.1}),
                inset 0 0 30px rgba(0, 0, 0, 0.5)
            `;
        }, 2000);
    }

    // ---------- Torn Parchment Edge Effect ----------
    const sheetElements = document.querySelectorAll('.character-sheet, .quest-board, .inventory-section, .spellbook-section');

    sheetElements.forEach(sheet => {
        // Add subtle noise texture via CSS
        sheet.style.backgroundImage = `
            linear-gradient(135deg, rgba(44, 24, 16, 0.95), rgba(30, 18, 10, 0.98)),
            repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(212, 168, 67, 0.03) 28px, rgba(212, 168, 67, 0.03) 29px)
        `;
    });

    console.log('⚔ The Obsidian Hearth is now alive. Welcome, adventurer.');
});