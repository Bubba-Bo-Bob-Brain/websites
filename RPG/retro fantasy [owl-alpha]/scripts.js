// ===== THE ARCANE CODEX - Interactive Scripts =====

document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
});

function initializeAll() {
    createEmbers();
    initScrollReveal();
    initSmoothScroll();
    initSpellBook();
    initCreatureCards();
    initQuestNotices();
    initInventorySlots();
    initNavHighlight();
    initCustomCursor();
    initStatBarAnimations();
}

// ===== FLOATING EMBERS PARTICLE SYSTEM =====
function createEmbers() {
    var container = document.getElementById('embers');
    if (!container) return;

    var emberCount = 20;

    for (var i = 0; i < emberCount; i++) {
        var ember = document.createElement('div');
        ember.classList.add('ember');

        var startLeft = Math.random() * 100;
        var drift = (Math.random() - 0.5) * 200;
        var duration = 8 + Math.random() * 12;
        var delay = Math.random() * 15;
        var size = 2 + Math.random() * 3;

        ember.style.left = startLeft + '%';
        ember.style.width = size + 'px';
        ember.style.height = size + 'px';
        ember.style.setProperty('--drift', drift + 'px');
        ember.style.animationDuration = duration + 's';
        ember.style.animationDelay = delay + 's';

        container.appendChild(ember);
    }
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var children = entry.target.querySelectorAll('.creature-card, .quest-notice, .inventory-slot');
                if (children.length > 0) {
                    for (var i = 0; i < children.length; i++) {
                        (function(child, index) {
                            setTimeout(function() {
                                child.classList.add('visible');
                                child.style.opacity = '1';
                                child.style.transform = 'translateY(0)';
                            }, index * 150);
                        })(children[i], i);
                    }
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    var sections = document.querySelectorAll('.sections');
    sections.forEach(function(section) {
        section.classList.add('reveal');
        observer.observe(section);
    });

    var cards = document.querySelectorAll('.creature-card, .quest-notice, .inventory-slot');
    cards.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// ===== SMOOTH SCROLL FOR NAVIGATION =====
function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var navHeight = document.querySelector('.main-nav').offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    var scrollIndicator = document.querySelector('.scroll-parchment');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            var bestiary = document.getElementById('bestiary');
            if (bestiary) {
                var navHeight = document.querySelector('.main-nav').offsetHeight;
                var targetPosition = bestiary.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    }
}

// ===== SPELL BOOK PAGE TURNING =====
function initSpellBook() {
    var pages = document.querySelectorAll('.book-page');
    var prevBtn = document.getElementById('prevPage');
    var nextBtn = document.getElementById('nextPage');
    var currentPageEl = document.getElementById('currentPage');
    var totalPagesEl = document.getElementById('totalPages');

    if (!pages.length) return;

    var currentPageIndex = 0;
    var totalPages = pages.length;
    var touchStartX = 0;
    var touchEndX = 0;

    if (totalPagesEl) totalPagesEl.textContent = totalPages;

    function showPage(index) {
        if (index < 0) index = totalPages - 1;
        if (index >= totalPages) index = 0;

        pages[currentPageIndex].classList.remove('active');

        setTimeout(function() {
            currentPageIndex = index;
            pages[currentPageIndex].classList.add('active');
            if (currentPageEl) currentPageEl.textContent = currentPageIndex + 1;
        }, 300);

        createPageTurnEffect();
    }

    function createPageTurnEffect() {
        var book = document.getElementById('spellBook');
        if (!book) return;

        var flash = document.createElement('div');
        flash.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.1), transparent); pointer-events: none; z-index: 100; animation: pageFlash 0.4s ease-out forwards;';

        if (!document.getElementById('pageFlashStyle')) {
            var style = document.createElement('style');
            style.id = 'pageFlashStyle';
            style.textContent = '@keyframes pageFlash { 0% { opacity: 1; } 100% { opacity: 0; } }';
            document.head.appendChild(style);
        }

        book.appendChild(flash);
        setTimeout(function() { flash.remove(); }, 400);
    }

    function handleSwipe() {
        var swipeThreshold = 50;
        var diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showPage(currentPageIndex + 1);
            } else {
                showPage(currentPageIndex - 1);
            }
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showPage(currentPageIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showPage(currentPageIndex + 1);
        });
    }

    document.addEventListener('keydown', function(e) {
        var book = document.getElementById('spellBook');
        if (!book) return;

        var rect = book.getBoundingClientRect();
        var isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            if (e.key === 'ArrowLeft') showPage(currentPageIndex - 1);
            if (e.key === 'ArrowRight') showPage(currentPageIndex + 1);
        }
    });

    var bookElement = document.getElementById('spellBook');
    if (bookElement) {
        bookElement.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        bookElement.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
}

// ===== CREATURE CARD INTERACTIONS =====
function initCreatureCards() {
    var cards = document.querySelectorAll('.creature-card');

    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            var statFills = card.querySelectorAll('.stat-fill');
            statFills.forEach(function(fill, index) {
                var targetWidth = fill.style.width;
                fill.style.width = '0%';
                (function(fillElement, width) {
                    setTimeout(function() {
                        fillElement.style.width = width;
                    }, 100 + index * 50);
                })(fill, targetWidth);
            });
        });

        card.addEventListener('click', function() {
            var creatureName = card.querySelector('.creature-name').textContent;
            showExamineModal(card, creatureName);
        });
    });
}

function showExamineModal(card, name) {
    var modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(26, 20, 16, 0.9); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: modalFadeIn 0.3s ease; cursor: pointer;';

    var inner = document.createElement('div');
    inner.style.cssText = 'background: var(--parchment-base); padding: 2rem; border: 3px solid var(--gold-leaf); max-width: 400px; text-align: center; position: relative; animation: modalScaleIn 0.4s ease; cursor: default;';

    var style = document.createElement('style');
    style.textContent = '@keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes modalScaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } } @keyframes modalFadeOut { from { opacity: 1; } to { opacity: 0; } }';
    document.head.appendChild(style);

    inner.innerHTML = '<div style="font-size: 3rem; margin-bottom: 1rem;">' + getCreatureEmoji(name) + '</div><h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--oxblood); margin-bottom: 0.5rem;">' + name + '</h3><p style="font-style: italic; color: var(--ink-brown); margin-bottom: 1rem;">' + card.querySelector('.creature-desc p').textContent + '</p><p style="font-size: 0.8rem; color: var(--gold-dim);">Click anywhere to dismiss</p>';

    modal.appendChild(inner);
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.animation = 'modalFadeOut 0.3s ease forwards';
            setTimeout(function() { modal.remove(); }, 300);
        }
    });
}

function getCreatureEmoji(name) {
    var emojis = {
        'Ancient Red Dragon': '🐉',
        'The Undying Lich': '💀',
        'Mighty Owlbear': '🦉',
        "Xanathar's Beholder": '👁️'
    };
    return emojis[name] || '🐲';
}

// ===== QUEST NOTICE INTERACTIONS =====
function initQuestNotices() {
    var notices = document.querySelectorAll('.quest-notice');

    notices.forEach(function(notice) {
        notice.addEventListener('mouseenter', function() {
            notice.style.zIndex = '10';
        });

        notice.addEventListener('mouseleave', function() {
            notice.style.zIndex = '';
        });

        notice.addEventListener('click', function() {
            var questTitle = notice.querySelector('.quest-title').textContent;
            showQuestAcceptance(questTitle, notice);
        });
    });
}

function showQuestAcceptance(title, notice) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 2rem; right: 2rem; background: var(--parchment-base); border: 2px solid var(--gold-leaf); padding: 1rem 1.5rem; z-index: 10000; box-shadow: 0 8px 32px rgba(0,0,0,0.5); animation: toastSlideIn 0.4s ease, toastSlideOut 0.4s ease 2.5s forwards; max-width: 300px;';

    toast.innerHTML = '<div style="display: flex; align-items: center; gap: 0.5rem;"><span style="font-size: 1.5rem;">📜</span><div><h4 style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--ink-black);">' + title + '</h4><p style="font-size: 0.75rem; color: var(--forest-green); font-style: italic;">Quest added to journal!</p></div></div>';

    var style = document.createElement('style');
    style.textContent = '@keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes toastSlideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
    document.head.appendChild(style);

    document.body.appendChild(toast);

    var stamp = document.createElement('div');
    stamp.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); font-size: 3rem; opacity: 0.3; pointer-events: none; z-index: 20; color: var(--forest-green); border: 3px solid var(--forest-green); padding: 0.5rem 1rem; border-radius: 8px; font-family: var(--font-heading); font-weight: bold; animation: stampAppear 0.3s ease;';
    stamp.textContent = 'ACCEPTED';

    notice.style.position = 'relative';
    notice.appendChild(stamp);

    var stampStyle = document.createElement('style');
    stampStyle.textContent = '@keyframes stampAppear { from { transform: translate(-50%, -50%) rotate(-15deg) scale(2); opacity: 0; } to { transform: translate(-50%, -50%) rotate(-15deg) scale(1); opacity: 0.3; } }';
    document.head.appendChild(stampStyle);

    setTimeout(function() { toast.remove(); }, 3000);
}

// ===== INVENTORY SLOT INTERACTIONS =====
function initInventorySlots() {
    var slots = document.querySelectorAll('.inventory-slot');

    slots.forEach(function(slot) {
        slot.addEventListener('click', function() {
            var itemName = slot.querySelector('.item-name').textContent;
            var itemRarity = slot.querySelector('.item-rarity').textContent;
            var itemType = slot.querySelector('.item-type').textContent;

            showItemTooltip(slot, itemName, itemRarity, itemType);
        });
    });
}

function showItemTooltip(slot, name, rarity, type) {
    var existingTooltip = document.querySelector('.item-tooltip');
    if (existingTooltip) existingTooltip.remove();

    var tooltip = document.createElement('div');
    tooltip.classList.add('item-tooltip');
    tooltip.style.cssText = 'position: fixed; background: rgba(26, 20, 16, 0.95); border: 2px solid var(--gold-leaf); padding: 1rem; z-index: 10000; min-width: 200px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); animation: tooltipFadeIn 0.2s ease; pointer-events: none;';

    tooltip.innerHTML = '<h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--parchment-light); margin-bottom: 0.25rem;">' + name + '</h4><p style="font-size: 0.75rem; color: var(--gold-dim); margin-bottom: 0.25rem;">' + type + '</p><p style="font-size: 0.7rem; color: ' + getRarityColor(rarity) + '; text-transform: uppercase; letter-spacing: 0.1em;">' + rarity + '</p><p style="font-size: 0.7rem; color: var(--parchment-dark); margin-top: 0.5rem; font-style: italic;">Click to equip</p>';

    var style = document.createElement('style');
    style.textContent = '@keyframes tooltipFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);

    document.body.appendChild(tooltip);

    var rect = slot.getBoundingClientRect();
    var tooltipWidth = 200;
    var tooltipHeight = 120;

    var left = rect.right + 10;
    var top = rect.top;

    if (left + tooltipWidth > window.innerWidth) {
        left = rect.left - tooltipWidth - 10;
    }
    if (top + tooltipHeight > window.innerHeight) {
        top = window.innerHeight - tooltipHeight - 10;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';

    setTimeout(function() {
        var removeTooltip = function(e) {
            if (!slot.contains(e.target)) {
                tooltip.remove();
                document.removeEventListener('click', removeTooltip);
            }
        };
        document.addEventListener('click', removeTooltip);
    }, 100);
}

function getRarityColor(rarity) {
    var colors = {
        'Uncommon': '#5a9e5a',
        'Rare': '#6b8cae',
        'Epic': '#8b6bae',
        'Legendary': '#c9a84c'
    };
    return colors[rarity] || '#e8d5a3';
}

// ===== NAVIGATION HIGHLIGHT ON SCROLL =====
function initNavHighlight() {
    var sections = document.querySelectorAll('.section[id]');
    var navTabs = document.querySelectorAll('.nav-tab');

    var observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var id = entry.target.getAttribute('id');
                navTabs.forEach(function(tab) {
                    tab.classList.remove('active');
                    if (tab.getAttribute('href') === '#' + id) {
                        tab.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(function(section) { observer.observe(section); });
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    var cursor = document.querySelector('.cursor-quill');
    if (!cursor) return;

    var mouseX = 0;
    var mouseY = 0;
    var cursorX = 0;
    var cursorY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        var ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    var interactiveElements = document.querySelectorAll('a, button, .creature-card, .quest-notice, .inventory-slot, .book-nav-btn');

    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
}

// ===== STAT BAR ANIMATIONS =====
function initStatBarAnimations() {
    var statBars = document.querySelectorAll('.stat-fill');

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var fill = entry.target;
                var targetWidth = fill.style.width;
                fill.style.width = '0%';

                setTimeout(function() {
                    fill.style.width = targetWidth;
                }, 200);

                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });

    statBars.forEach(function(bar) {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// ===== PARALLAX EFFECT FOR CANDLES =====
window.addEventListener('scroll', function() {
    var candles = document.querySelectorAll('.candle');
    var scrollY = window.pageYOffset;

    candles.forEach(function(candle, index) {
        var speed = 0.3 + (index * 0.1);
        candle.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
});

// ===== TITLE LETTER ANIMATION =====
function animateTitleLetters() {
    var title = document.querySelector('.hero-title');
    if (!title) return;

    var text = title.innerHTML;
    title.innerHTML = '';

    var chars = text.split('');
    chars.forEach(function(char, index) {
        var span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = 'display: inline-block; opacity: 0; transform: translateY(20px) rotateX(-90deg); animation: letterDrop 0.6s ease forwards; animation-delay: ' + (0.5 + index * 0.03) + 's;';
        title.appendChild(span);
    });

    var style = document.createElement('style');
    style.textContent = '@keyframes letterDrop { to { opacity: 1; transform: translateY(0) rotateX(0); } }';
    document.head.appendChild(style);
}

setTimeout(animateTitleLetters, 500);

// ===== DYNAMIC BACKGROUND SHIFT =====
function initBackgroundShift() {
    var body = document.body;

    window.addEventListener('scroll', function() {
        var scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        var hue = 25 + (scrollPercent * 10);
        body.style.backgroundColor = 'hsl(' + hue + ', 20%, 7%)';
    });
}

initBackgroundShift();

// ===== CONSOLE EASTER EGG =====
console.log('%c⚔ The Arcane Codex ⚔', 'font-family: serif; font-size: 24px; color: #c9a84c; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c"Knowledge is the greatest treasure." - The Scribes of the Eternal Library', 'font-style: italic; color: #e8d5a3;');