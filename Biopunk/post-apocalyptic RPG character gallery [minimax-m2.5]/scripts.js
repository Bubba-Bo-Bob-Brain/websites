/* ============================================
MUTANT ROGUE - Biopunk RPG Character Gallery
JavaScript v2.4.7
============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initSearch();
    initStatAnimations();
    initScanlineEffect();
    initGlitchEffect();
    console.log('%c⚠ MUTANT ROGUE DATABASE ACCESSED ⚠', 'color: #00ff88; font-size: 16px; font-weight: bold;');
    console.log('%cUnauthorized access is punishable under BioGen Code 7.4', 'color: #ff3355; font-size: 12px;');
});

/* ============================================
Filter Functionality
============================================ */
function initFilters() {
    var filterButtons = document.querySelectorAll('.filter-btn');
    var characterCards = document.querySelectorAll('.character-card');
    
    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterButtons.forEach(function(b) {
                b.classList.remove('active');
            });
            
            btn.classList.add('active');
            
            var filterValue = btn.dataset.filter;
            
            characterCards.forEach(function(card) {
                var cardFaction = card.dataset.faction;
                if (filterValue === 'all' || cardFaction === filterValue) {
                    card.classList.remove('hidden');
                    animateCardIn(card);
                } else {
                    card.classList.add('hidden');
                }
            });
            
            updateResultsCount(filterValue, characterCards);
        });
    });
}

function animateCardIn(card) {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = 'card-reappear 0.4s ease forwards';
}

function updateResultsCount(filter, cards) {
    var visibleCards = Array.from(cards).filter(function(c) {
        return !c.classList.contains('hidden');
    });
    
    var countSpan = document.querySelector('.results-count');
    if (!countSpan) {
        var countEl = document.createElement('span');
        countEl.className = 'results-count';
        countEl.style.cssText = 'margin-left: 20px; color: var(--accent-green); font-size: 12px;';
        document.querySelector('.filter-group').appendChild(countEl);
    }
}

/* ============================================
Search Functionality
============================================ */
function initSearch() {
    var searchInput = document.getElementById('search-input');
    var characterCards = document.querySelectorAll('.character-card');
    var searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(function() {
            var searchTerm = e.target.value.toLowerCase().trim();
            var activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            
            characterCards.forEach(function(card) {
                var name = card.querySelector('.character-name').textContent.toLowerCase();
                var faction = card.dataset.faction;
                var bio = card.querySelector('.character-bio').textContent.toLowerCase();
                
                var matchesSearch = name.includes(searchTerm) || bio.includes(searchTerm);
                var matchesFilter = activeFilter === 'all' || faction === activeFilter;
                
                if (matchesSearch && matchesFilter) {
                    card.classList.remove('hidden');
                    animateCardIn(card);
                } else {
                    card.classList.add('hidden');
                }
            });
            
            checkEmptyResults(searchTerm);
        }, 300);
    });
}

function checkEmptyResults(searchTerm) {
    var visibleCards = document.querySelectorAll('.character-card:not(.hidden)');
    var container = document.querySelector('.gallery');
    var noResults = document.querySelector('.no-results');
    
    if (visibleCards.length === 0 && !noResults) {
        noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">' +
            '<div style="font-size: 48px; margin-bottom: 20px;">🔍</div>' +
            '<div style="color: var(--accent-red); font-size: 18px; letter-spacing: 2px; margin-bottom: 10px;">NO RECORDS FOUND</div>' +
            '<div style="color: var(--text-muted); font-size: 14px;">Search term: "' + searchTerm + '"</div>' +
            '<div style="color: var(--text-muted); font-size: 12px; margin-top: 20px;">Try a different search or faction filter</div>' +
            '</div>';
        container.appendChild(noResults);
    } else if (visibleCards.length > 0 && noResults) {
        noResults.remove();
    }
}

/* ============================================
Stat Bar Animations
============================================ */
function initStatAnimations() {
    var statBars = document.querySelectorAll('.stat-fill, .mutation-fill');
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var bar = entry.target;
                var fillWidth = bar.style.getPropertyValue('--fill');
                bar.style.width = '0%';
                
                setTimeout(function() {
                    bar.style.width = fillWidth;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    statBars.forEach(function(bar) {
        observer.observe(bar);
    });
}

/* ============================================
Enhanced Scanline Effect
============================================ */
function initScanlineEffect() {
    var scanlines = document.querySelector('.scanlines');
    var scanlineSpeed = 1;
    
    setInterval(function() {
        scanlineSpeed = 0.5 + Math.random() * 1.5;
        scanlines.style.background = 'repeating-linear-gradient(0deg, rgba(0, 0, 0, ' + (0.1 + Math.random() * 0.1) + '), rgba(0, 0, 0, ' + (0.1 + Math.random() * 0.1) + ') 1px, transparent 1px, transparent ' + (2 + scanlineSpeed) + 'px)';
    }, 100);
}

/* ============================================
Random Glitch Effect
============================================ */
function initGlitchEffect() {
    var titles = document.querySelectorAll('.game-title, .character-name');
    
    titles.forEach(function(title) {
        title.addEventListener('mouseenter', function() {
            triggerGlitch(title);
        });
    });
    
    setInterval(function() {
        var gameTitle = document.querySelector('.game-title');
        if (Math.random() > 0.7) {
            triggerGlitch(gameTitle);
        }
    }, 5000);
}

function triggerGlitch(element) {
    var originalText = element.textContent;
    var glitchChars = ['@', '#', '$', '%', '∆', 'Ω', 'µ', '§'];
    var glitchCount = 0;
    
    var glitchInterval = setInterval(function() {
        element.textContent = originalText.split('').map(function(char, i) {
            if (i < glitchCount) {
                return originalText[i];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }).join('');
        
        glitchCount++;
        
        if (glitchCount > originalText.length) {
            clearInterval(glitchInterval);
            element.textContent = originalText;
        }
    }, 50);
}

/* ============================================
Character Card Hover Effects
============================================ */
function initHoverEffects() {
    var cards = document.querySelectorAll('.character-card');
    
    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            card.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.3), inset 0 0 30px rgba(0, 255, 136, 0.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.boxShadow = '';
        });
    });
}

/* ============================================
Keyboard Navigation
============================================ */
function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
        var searchInput = document.getElementById('search-input');
        
        if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
            if (document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        } else if (e.key === 'Escape') {
            searchInput.blur();
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            document.querySelector('.filter-btn[data-filter="all"]').click();
        } else if (e.key >= '1' && e.key <= '4') {
            var filters = ['all', 'scavengers', 'synthetics', 'mutants'];
            var index = parseInt(e.key) - 1;
            
            if (filters[index]) {
                document.querySelector('[data-filter="' + filters[index] + '"]').click();
            }
        }
    });
}

/* ============================================
Stats Tooltip on Hover
============================================ */
function initStatTooltips() {
    var stats = document.querySelectorAll('.stat-block');
    
    var statDescriptions = {
        'BIO-CONTAMINATION': 'Percentage of mutated cells in subject body. Above 80% risks permanent transformation.',
        'SURVIVAL': 'Ability to survive in the wasteland. Includes foraging, shelter-building, and endurance.',
        'COMBAT': 'Proficiency in weapons and combat tactics. Measured against standard wasteland threats.',
        'STEALTH': 'Ability to remain undetected. Critical for scavenging and avoiding Corp patrols.'
    };
    
    stats.forEach(function(stat) {
        var label = stat.querySelector('.stat-label').textContent;
        var description = statDescriptions[label];
        
        if (description) {
            stat.style.cursor = 'help';
            stat.title = description;
        }
    });
}

/* ============================================
Random Radiation Fluctuation
============================================ */
function initRadiationMonitor() {
    var radValue = document.querySelector('.rad-value');
    
    setInterval(function() {
        var baseRad = 847;
        var fluctuation = Math.floor(Math.random() * 200 - 100);
        var newRad = baseRad + fluctuation;
        
        radValue.textContent = newRad + ' μSv/h';
        
        if (newRad > 900) {
            radValue.style.color = 'var(--accent-red)';
        } else if (newRad > 800) {
            radValue.style.color = 'var(--accent-orange)';
        } else {
            radValue.style.color = 'var(--accent-green)';
        }
    }, 2000);
}

/* ============================================
Faction Counter Updates
============================================ */
function updateFactionCounts() {
    var cards = document.querySelectorAll('.character-card');
    var factions = {
        'scavengers': 0,
        'synthetics': 0,
        'mutants': 0,
        'corporation': 0
    };
    
    cards.forEach(function(card) {
        var faction = card.dataset.faction;
        if (factions.hasOwnProperty(faction)) {
            factions[faction]++;
        }
    });
    
    console.log('Faction Distribution:', factions);
}

/* ============================================
Print Functionality
============================================ */
function initPrintStyles() {
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
}

/* ============================================
Add CSS Animation Dynamically
============================================ */
var style = document.createElement('style');
style.textContent = '@keyframes card-reappear { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(style);