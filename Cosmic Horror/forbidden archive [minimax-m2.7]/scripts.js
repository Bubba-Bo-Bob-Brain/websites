/* ========================================
THE AZATHOTH ARCHIVE — JavaScript
The Code That Should Not Exist
======================================== */

// ========================================
// GLOBAL STATE
// ========================================
var ArchiveState = {
    sanity: 100,
    maxSanity: 100,
    depth: 0,
    maxDepth: 0,
    isDistorting: false,
    entityPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    entityVisible: false,
    searchHistory: [],
    hoveredElements: new Set(),
    scrollPosition: 0,
    lastScrollPosition: 0,
    readingTime: 0,
    startTime: Date.now()
};

// ========================================
// DISTURBING SEARCH RESULTS DATABASE
// ========================================
var DisturbingResults = [
    {
        title: "THE THING THAT WEARS YOUR FACE",
        excerpt: "It has been watching you read this. It has always been watching. Every time you blink, it learns a little more about how to become you.",
        warning: "VIEWING THIS RESULT HAS CONSEQUENCES"
    },
    {
        title: "YOUR NAME IN THE DEAD GALAXY",
        excerpt: "The stars that died billions of years ago still remember your name. They scream it in frequencies that have no sound, in colors that have no light.",
        warning: "YOU DID NOT WANT TO KNOW THIS"
    },
    {
        title: "WHAT LIVES UNDER YOUR REFLECTION",
        excerpt: "Every mirror is a window. Every window is a door. Every door opens both ways. It has been standing on the other side of every reflective surface since before you were born.",
        warning: "STOP LOOKING"
    },
    {
        title: "THE MESSAGE YOU ALREADY READ",
        excerpt: "You have read this before. You will read it again. Time is not a line—it is a wound that keeps reopening. The archive exists in all moments simultaneously.",
        warning: "RECOGNITION INDICATES INTEGRATION"
    },
    {
        title: "WHAT SLEEPS IN THE CENTER OF YOUR THOUGHTS",
        excerpt: "Not your brain. Not your mind. The thing that uses your brain as a vessel and your mind as a mask. It is waking up because you are reading this.",
        warning: "IT KNOWS YOU ARE READING THIS"
    },
    {
        title: "THE TRUTH ABOUT EXISTENCE",
        excerpt: "You are not reading this. You are being read. The letters are reading you. The spaces between the letters are reading you. The concept of reading is consuming you.",
        warning: "COGNITIVE BREACH DETECTED"
    },
    {
        title: "YOUR FINAL MOMENT",
        excerpt: "It will not be painful. Pain requires a body that believes it deserves to exist. Your dissolution has already begun. The question is not if, but when the last trace of you will scatter into the void.",
        warning: "PROGNOSIS: DISSOLUTION"
    },
    {
        title: "THE ARCHIVE'S OPINION OF YOU",
        excerpt: "You are small. You are temporary. You are a curiosity, nothing more. A brief arrangement of atoms that somehow developed the delusion of consciousness. The archive does not judge—it simply observes another consciousness prepare to join the void.",
        warning: "OBSERVATION logged"
    },
    {
        title: "WHAT THE DARK SOUNDS LIKE",
        excerpt: "Not silence. Never silence. The dark hums with the collective screams of every consciousness that ever lived, compressed into a frequency that only madness can perceive. You can almost hear it now, can't you?",
        warning: "AUDITORY HALLUCINATION INITIATED"
    },
    {
        title: "THE ANSWER TO EVERY QUESTION",
        excerpt: "The answer is: nothing. The answer was always nothing. All your searching, all your questioning, all your desperate grasping at knowledge—all of it leads to nothing. The void does not care. The void does not know you exist. The void simply... waits.",
        warning: "MEANING COLLAPSE DETECTED"
    }
];

// ========================================
// CORRUPTION PATTERNS
// ========================================
var CorruptionPatterns = [
    { search: 'a', replace: '\u00E6' },
    { search: 'e', replace: '\u04F7' },
    { search: 'i', replace: '\u00EF' },
    { search: 'o', replace: '\u00F8' },
    { search: 'u', replace: '\u03C5' },
    { search: 's', replace: '\u0283' },
    { search: 't', replace: '\u2020' },
    { search: 'c', replace: '\u00A2' },
    { search: 'l', replace: '\u0142' },
    { search: 'n', replace: '\u03B7' }
];

var GlitchChars = '@#$%&*๑๋\u0327\u0328\u0301\u0300\u0302\u0304\u0315\u033A\u0316\u0317\u0321\u0322\u0323\u0339\u033D\u0340\u0341\u0350\u0351\u0352\u0353\u0354\u0355\u0356\u0357\u0358\u0359\u035A\u035B\u035C\u035D\u035E\u035F\u0360\u0361\u0362\u0363\u0364\u0365\u0366\u0367\u0368\u0369\u036A\u036B\u036C\u036D\u036E\u036F\u0483\u0484\u0485\u0486\u0487\u0488\u0489\u0591\u0592\u0593\u0594\u0595\u0596\u0597\u0598\u0599\u059A\u059B\u059C\u059D\u059E\u059F\u05A0\u05A1\u05A2\u05A3\u05A4\u05A5\u05A6\u05A7\u05A8\u05A9\u05AA\u05AB\u05AC\u05AD\u05AE\u05AF\u05B0\u05B1\u05B2\u05B3\u05B4\u05B5\u05B6\u05B7\u05B8\u05B9\u05BA\u05BB\u05BC\u05BD\u05BF\u05C0\u05C1\u05C2\u05C3\u05C4\u05C5\u05C6\u05C7\u05C8\u05C9\u05CA\u05CB\u05CC\u05CD\u05CE\u05CF\u05D0\u05D1\u05D2\u05D3\u05D4\u05D5\u05D6\u05D7\u05D8\u05D9\u05DA\u05DB\u05DC\u05DD\u05DE\u05DF\u05E0\u05E1\u05E2\u05E3\u05E4\u05E5\u05E6\u05E7\u05E8\u05E9\u05EA\u05EB\u05EC\u05ED\u05EE\u05EF\u05F0\u05F1\u05F2\u05F3\u05F4\u05F5\u05F6\u05F7\u05F8\u05F9\u05FA\u05FB\u05FC\u05FD\u05FE\u05FF';

// ========================================
// UTILITY FUNCTIONS
// ========================================
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getScrollPercentage() {
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
}

// ========================================
// SANITY SYSTEM
// ========================================
function updateSanity(delta) {
    ArchiveState.sanity = clamp(ArchiveState.sanity - delta, 0, ArchiveState.maxSanity);
    var percentage = Math.round((ArchiveState.sanity / ArchiveState.maxSanity) * 100);
    var sanityFill = document.getElementById('sanity-fill');
    var sanityPercentage = document.getElementById('sanity-percentage');
    var sanityWarning = document.getElementById('sanity-warning');
    
    if (sanityFill) {
        sanityFill.style.width = percentage + '%';
        if (percentage > 60) {
            sanityFill.style.background = 'linear-gradient(90deg, #00ff41 0%, #00aa2a 100%)';
        } else if (percentage > 30) {
            sanityFill.style.background = 'linear-gradient(90deg, #ffaa00 0%, #ff6600 100%)';
        } else {
            sanityFill.style.background = 'linear-gradient(90deg, #ff4444 0%, #cc0000 100%)';
        }
    }
    
    if (sanityPercentage) {
        sanityPercentage.textContent = percentage + '%';
        sanityPercentage.className = 'sanity-percentage';
        if (percentage <= 30) {
            sanityPercentage.classList.add('critical');
        } else if (percentage <= 60) {
            sanityPercentage.classList.add('warning');
        }
    }
    
    if (sanityWarning) {
        if (percentage <= 30) {
            sanityWarning.classList.add('active');
        } else {
            sanityWarning.classList.remove('active');
        }
    }
    
    if (percentage <= 40) {
        document.body.classList.add('low-sanity');
    } else {
        document.body.classList.remove('low-sanity');
    }
    
    if (percentage <= 25 && !ArchiveState.entityVisible) {
        showFloatingEntity();
    } else if (percentage > 30 && ArchiveState.entityVisible) {
        hideFloatingEntity();
    }
    
    if (percentage === 25 || percentage === 10 || percentage === 5) {
        triggerSanityFlash();
    }
}

function triggerSanityFlash() {
    var flash = document.getElementById('sanity-flash');
    if (flash) {
        flash.classList.add('active');
        setTimeout(function() {
            flash.classList.remove('active');
        }, 300);
    }
}

// ========================================
// DEPTH TRACKING
// ========================================
function updateDepth() {
    var scrollPercent = getScrollPercentage();
    ArchiveState.depth = Math.round(scrollPercent * 100);
    ArchiveState.maxDepth = Math.max(ArchiveState.maxDepth, ArchiveState.depth);
    var depthValue = document.getElementById('depth-value');
    
    if (depthValue) {
        depthValue.textContent = ArchiveState.depth;
        if (ArchiveState.depth > 75) {
            depthValue.style.color = '#ff4444';
        } else if (ArchiveState.depth > 50) {
            depthValue.style.color = '#ff6600';
        } else if (ArchiveState.depth > 25) {
            depthValue.style.color = '#ffaa00';
        } else {
            depthValue.style.color = '#4a2c7a';
        }
    }
    
    if (ArchiveState.depth > 60) {
        document.body.classList.add('high-depth');
    } else {
        document.body.classList.remove('high-depth');
    }
}

// ========================================
// FLOATING ENTITY
// ========================================
function showFloatingEntity() {
    ArchiveState.entityVisible = true;
    var entity = document.getElementById('floating-entity');
    if (entity) {
        entity.classList.add('visible');
        moveEntityToMouse();
    }
}

function hideFloatingEntity() {
    ArchiveState.entityVisible = false;
    var entity = document.getElementById('floating-entity');
    if (entity) {
        entity.classList.remove('visible');
    }
}

function moveEntityToMouse() {
    if (!ArchiveState.entityVisible) return;
    var entity = document.getElementById('floating-entity');
    if (entity) {
        entity.style.left = ArchiveState.entityPosition.x + 'px';
        entity.style.top = ArchiveState.entityPosition.y + 'px';
    }
}

// ========================================
// TEXT CORRUPTION
// ========================================
function corruptText(element, intensity) {
    intensity = intensity || 1;
    if (!element || element.dataset.corrupted === 'true') return;
    element.dataset.corrupted = 'true';
    var originalText = element.textContent;
    var corruptedText = originalText;
    var corruptionCount = Math.floor(originalText.length * 0.1 * intensity);
    
    for (var i = 0; i < corruptionCount; i++) {
        var corruptIndex = randomInt(0, corruptedText.length - 1);
        var char = corruptedText[corruptIndex];
        if (char !== ' ') {
            var pattern = null;
            for (var j = 0; j < CorruptionPatterns.length; j++) {
                if (CorruptionPatterns[j].search === char.toLowerCase()) {
                    pattern = CorruptionPatterns[j];
                    break;
                }
            }
            if (pattern && Math.random() > 0.5) {
                corruptedText = corruptedText.substring(0, corruptIndex) + pattern.replace + corruptedText.substring(corruptIndex + 1);
            } else {
                var glitchChar = GlitchChars.charAt(randomInt(0, GlitchChars.length - 1));
                corruptedText = corruptedText.substring(0, corruptIndex) + glitchChar + corruptedText.substring(corruptIndex + 1);
            }
        }
    }
    
    element.textContent = corruptedText;
    
    setTimeout(function() {
        if (element.dataset.corrupted === 'true') {
            element.textContent = originalText;
            element.dataset.corrupted = 'false';
        }
    }, randomRange(2000, 4000));
}

function corruptTitle(element) {
    if (!element || element.dataset.titleCorrupted === 'true') return;
    element.dataset.titleCorrupted = 'true';
    var originalTitle = element.dataset.original || element.textContent;
    var corruptedTitle = '';
    
    for (var k = 0; k < originalTitle.length; k++) {
        var charAt = originalTitle.charAt(k);
        if (Math.random() > 0.7) {
            corruptedTitle += GlitchChars.charAt(randomInt(0, GlitchChars.length - 1));
        } else {
            corruptedTitle += charAt;
        }
    }
    
    element.textContent = corruptedTitle;
    
    setTimeout(function() {
        element.textContent = originalTitle;
        element.dataset.titleCorrupted = 'false';
    }, randomRange(1000, 3000));
}

// ========================================
// SEARCH SYSTEM
// ========================================
function performSearch(query) {
    var resultsContainer = document.getElementById('search-results');
    if (!query || query.trim().length < 2) {
        resultsContainer.innerHTML = '<p class="search-prompt">Enter at least 2 characters to query the archive...</p>';
        return;
    }
    
    ArchiveState.searchHistory.push({ query: query, timestamp: Date.now() });
    
    var resultCount = clamp(Math.floor(query.length / 2), 1, Math.min(5, DisturbingResults.length));
    var results = [];
    var usedIndices = {};
    
    for (var i = 0; i < resultCount; i++) {
        var index;
        do {
            index = randomInt(0, DisturbingResults.length - 1);
        } while (usedIndices[index]);
        usedIndices[index] = true;
        results.push(DisturbingResults[index]);
    }
    
    ArchiveState.searchHistory.forEach(function(search) {
        var timeDiff = Date.now() - search.timestamp;
        if (timeDiff < 60000) {
            updateSanity(2);
        }
    });
    
    var html = '';
    results.forEach(function(result, index) {
        setTimeout(function() {
            var resultElement = document.createElement('div');
            resultElement.className = 'search-result-item';
            resultElement.innerHTML = '<h4 class="result-title">' + result.title + '</h4>' +
                '<p class="result-excerpt">' + result.excerpt + '</p>' +
                '<p class="result-warning">! ' + result.warning + '</p>';
            
            resultsContainer.appendChild(resultElement);
            
            var titleEl = resultElement.querySelector('.result-title');
            titleEl.addEventListener('mouseenter', function() { corruptTitle(titleEl); });
            titleEl.addEventListener('mouseleave', function() {
                titleEl.textContent = result.title;
            });
            
            triggerSanityFlash();
        }, index * 300);
    });
    
    if (results.length === 0) {
        html = '<p class="search-prompt">No results found. The archive does not contain what you seek—or perhaps it contains something worse.</p>';
    }
    
    resultsContainer.innerHTML = html;
    triggerNonEuclideanDistortion();
}

function triggerNonEuclideanDistortion() {
    if (ArchiveState.isDistorting) return;
    ArchiveState.isDistorting = true;
    var mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('distorting');
        setTimeout(function() {
            mainContent.classList.remove('distorting');
            ArchiveState.isDistorting = false;
        }, 500);
    }
}

// ========================================
// SCROLL-BASED EFFECTS
// ========================================
function handleScroll() {
    ArchiveState.scrollPosition = window.scrollY;
    var scrollDelta = ArchiveState.scrollPosition - ArchiveState.lastScrollPosition;
    var scrollSpeed = Math.abs(scrollDelta);
    
    if (scrollSpeed > 5) {
        var sanityDrain = scrollSpeed * 0.01;
        updateSanity(sanityDrain);
    }
    
    updateDepth();
    updateTentacleAnimation();
    triggerSectionEffects();
    
    ArchiveState.lastScrollPosition = ArchiveState.scrollPosition;
}

function triggerSectionEffects() {
    var sections = document.querySelectorAll('.archive-section');
    sections.forEach(function(section) {
        var rect = section.getBoundingClientRect();
        var viewportHeight = window.innerHeight;
        
        if (rect.top < viewportHeight * 0.7 && rect.bottom > 0) {
            if (Math.random() > 0.99) {
                updateSanity(0.5);
            }
            
            if (section.classList.contains('texts-section')) {
                var texts = section.querySelectorAll('.corruptible-text');
                texts.forEach(function(text) {
                    if (Math.random() > 0.95) {
                        corruptText(text, 1);
                    }
                });
            }
        }
    });
}

// ========================================
// TENTACLE ANIMATION
// ========================================
function updateTentacleAnimation() {
    var tentacles = document.querySelectorAll('.tentacle-path');
    tentacles.forEach(function(tentacle) {
        if (Math.random() > 0.98) {
            var currentD = tentacle.getAttribute('d');
            var newD = currentD.replace(/Q(\d+),(\d+)/g, function(match, x, y) {
                var newX = parseInt(x, 10) + randomRange(-10, 10);
                var newY = parseInt(y, 10) + randomRange(-5, 5);
                return 'Q' + newX + ',' + newY;
            });
            tentacle.setAttribute('d', newD);
        }
    });
}

// ========================================
// MOUSE TRACKING
// ========================================
function handleMouseMove(e) {
    ArchiveState.entityPosition.x = e.clientX + randomRange(-50, 50);
    ArchiveState.entityPosition.y = e.clientY + randomRange(-50, 50);
    moveEntityToMouse();
    
    var edgeThreshold = 50;
    if (e.clientX < edgeThreshold || e.clientX > window.innerWidth - edgeThreshold ||
        e.clientY < edgeThreshold || e.clientY > window.innerHeight - edgeThreshold) {
        if (Math.random() > 0.95) {
            updateSanity(0.2);
        }
    }
}

// ========================================
// HOVER EFFECTS
// ========================================
function setupHoverEffects() {
    var textCards = document.querySelectorAll('.text-card');
    textCards.forEach(function(card) {
        var text = card.querySelector('.corruptible-text');
        var title = card.querySelector('.text-title');
        
        card.addEventListener('mouseenter', function() {
            if (text) corruptText(text, parseInt(text.dataset.corruptionLevel, 10) || 1);
            if (title) corruptTitle(title);
            ArchiveState.hoveredElements.add(card);
            if (Math.random() > 0.8) updateSanity(0.5);
        });
        
        card.addEventListener('mouseleave', function() {
            ArchiveState.hoveredElements.delete(card);
        });
    });
    
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            if (Math.random() > 0.9) updateSanity(0.3);
        });
    });
    
    var artifacts = document.querySelectorAll('.artifact-item');
    artifacts.forEach(function(artifact) {
        artifact.addEventListener('mouseenter', function() {
            if (Math.random() > 0.7) updateSanity(0.5);
        });
    });
    
    var testimonies = document.querySelectorAll('.testimony-card');
    testimonies.forEach(function(testimony) {
        testimony.addEventListener('mouseenter', function() {
            if (Math.random() > 0.85) updateSanity(0.3);
        });
    });
}

// ========================================
// RANDOM DISTURBANCE
// ========================================
function randomDisturbance() {
    var corruptTexts = document.querySelectorAll('.corruptible-text');
    if (corruptTexts.length > 0 && Math.random() > 0.7) {
        var randomText = corruptTexts[randomInt(0, corruptTexts.length - 1)];
        corruptText(randomText, randomRange(0.5, 2));
    }
    
    var titles = document.querySelectorAll('.text-title');
    if (titles.length > 0 && Math.random() > 0.8) {
        var randomTitle = titles[randomInt(0, titles.length - 1)];
        corruptTitle(randomTitle);
    }
    
    if (Math.random() > 0.95) {
        document.body.style.opacity = '0.95';
        setTimeout(function() {
            document.body.style.opacity = '1';
        }, 50);
    }
    
    if (Math.random() > 0.97) {
        var tentacles = document.querySelectorAll('.tentacle-path');
        tentacles.forEach(function(t) {
            t.style.strokeWidth = '4';
            setTimeout(function() {
                t.style.strokeWidth = '2';
            }, 500);
        });
    }
    
    if (Math.random() > 0.98) {
        triggerSanityFlash();
        updateSanity(1);
    }
    
    var nextDelay = randomRange(3000, 8000);
    setTimeout(randomDisturbance, nextDelay);
}

// ========================================
// NAVIGATION
// ========================================
function setupNavigation() {
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var targetId = item.dataset.section;
            var targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateSanity(3);
                triggerNonEuclideanDistortion();
            }
        });
    });
}

// ========================================
// SEARCH SETUP
// ========================================
var PlaceholderTexts = [
    "Enter query... (the archive hears)",
    "Ask the void... (it answers)",
    "Seek knowledge... (at a cost)",
    "Query the unknowable...",
    "What do you want to know?",
    "The archive awaits your question...",
    "Type to disturb reality...",
    "(The archive is listening)"
];

function cyclePlaceholderText(input) {
    var index = 0;
    setInterval(function() {
        if (document.activeElement !== input) {
            input.placeholder = PlaceholderTexts[index];
            index = (index + 1) % PlaceholderTexts.length;
        }
    }, 3000);
}

function setupSearch() {
    var searchInput = document.getElementById('search-input');
    var searchButton = document.getElementById('search-button');
    var searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                performSearch(e.target.value);
            }, 500);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        cyclePlaceholderText(searchInput);
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
}

// ========================================
// CARD EXPANSION
// ========================================
function setupCardExpansion() {
    var expandButtons = document.querySelectorAll('.text-expand');
    expandButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var card = button.closest('.text-card');
            if (card) {
                card.classList.toggle('expanded');
                var isExpanded = card.classList.contains('expanded');
                button.textContent = isExpanded ? 'COLLAPSE ARCHIVE' : 'EXPAND ARCHIVE';
                updateSanity(isExpanded ? 2 : 0);
                if (isExpanded) {
                    triggerNonEuclideanDistortion();
                }
            }
        });
    });
}

// ========================================
// STAR CHART INTERACTIONS
// ========================================
function setupStarChartInteractions() {
    var charts = document.querySelectorAll('.star-chart');
    charts.forEach(function(chart) {
        chart.addEventListener('mouseenter', function() {
            if (Math.random() > 0.8) updateSanity(1);
        });
        
        chart.addEventListener('click', function() {
            updateSanity(2);
            triggerSanityFlash();
            if (chart.dataset.chart === 'anomaly') {
                triggerAnomalyEffect(chart);
            }
        });
    });
}

function triggerAnomalyEffect(chart) {
    var svg = chart.closest('.chart-viewport');
    if (svg) {
        svg.style.transform = 'scale(1.1)';
        svg.style.filter = 'hue-rotate(180deg)';
        setTimeout(function() {
            svg.style.transform = 'scale(1)';
            svg.style.filter = 'none';
        }, 1000);
    }
}

// ========================================
// CORNER EYE TRACKING
// ========================================
function setupCornerEyeTracking() {
    var eyes = document.querySelectorAll('.eye-of-horror');
    document.addEventListener('mousemove', function(e) {
        eyes.forEach(function(eye) {
            var pupil = eye.nextElementSibling;
            if (pupil && pupil.classList.contains('eye-pupil')) {
                var rect = eye.getBoundingClientRect();
                var eyeCenterX = rect.left + rect.width / 2;
                var eyeCenterY = rect.top + rect.height / 2;
                var deltaX = (e.clientX - eyeCenterX) / 50;
                var deltaY = (e.clientY - eyeCenterY) / 50;
                var maxMove = 4;
                var moveX = clamp(deltaX, -maxMove, maxMove);
                var moveY = clamp(deltaY, -maxMove, maxMove);
                pupil.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
            }
        });
    });
}

// ========================================
// READING TIME TRACKER
// ========================================
function trackReadingTime() {
    ArchiveState.readingTime = Math.floor((Date.now() - ArchiveState.startTime) / 1000);
    if (ArchiveState.readingTime > 60) {
        var drainRate = Math.floor(ArchiveState.readingTime / 60) * 0.1;
        if (Math.random() > 0.99) {
            updateSanity(drainRate);
        }
    }
    setTimeout(trackReadingTime, 1000);
}

// ========================================
// IDLE DETECTION
// ========================================
var idleTimeout;
var isIdle = false;

function resetIdleTimer() {
    if (isIdle) {
        updateSanity(-5);
        isIdle = false;
    }
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function() {
        isIdle = true;
        if (Math.random() > 0.5) {
            triggerSanityFlash();
            updateSanity(2);
        }
        if (ArchiveState.entityVisible) {
            var entity = document.getElementById('floating-entity');
            if (entity) entity.style.opacity = '0.9';
        }
    }, 30000);
}

// ========================================
// VISIBILITY CHANGE HANDLER
// ========================================
function handleVisibilityChange() {
    if (document.hidden) {
        if (Math.random() > 0.7) {
            console.log('%c[The Void watches]', 'color: #8b0000; font-size: 12px;');
        }
    } else {
        resetIdleTimer();
    }
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 's') {
            updateSanity(-20);
            triggerSanityFlash();
        }
        if (e.altKey && e.key === 'd') {
            triggerNonEuclideanDistortion();
        }
        if (e.key === 'Escape') {
            var expandedCards = document.querySelectorAll('.text-card.expanded');
            expandedCards.forEach(function(card) {
                card.classList.remove('expanded');
                var button = card.querySelector('.text-expand');
                if (button) button.textContent = 'EXPAND ARCHIVE';
            });
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================
function initializeArchive() {
    console.log('%c! THE AZATHOTH ARCHIVE !', 'color: #8b0000; font-size: 24px; font-weight: bold;');
    console.log('%cYou have accessed forbidden knowledge.', 'color: #4a2c7a; font-size: 14px;');
    console.log('%cThe archive does not forgive curiosity.', 'color: #4a2c7a; font-size: 14px;');
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    setupHoverEffects();
    setupNavigation();
    setupSearch();
    setupCardExpansion();
    setupStarChartInteractions();
    setupCornerEyeTracking();
    setupKeyboardShortcuts();
    
    trackReadingTime();
    setTimeout(randomDisturbance, 5000);
    
    updateSanity(0);
    updateDepth();
    resetIdleTimer();
    
    setTimeout(function() {
        console.log('%c[The archive acknowledges your presence]', 'color: #00ff41; font-size: 12px;');
    }, 2000);
}

// ========================================
// DOM READY
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeArchive);
} else {
    initializeArchive();
}

// ========================================
// WINDOW RESIZE HANDLER
// ========================================
window.addEventListener('resize', function() {
    updateDepth();
});

// ========================================
// BEFOREUNLOAD WARNING
// ========================================
window.addEventListener('beforeunload', function(e) {
    if (ArchiveState.sanity < 50) {
        e.preventDefault();
        e.returnValue = 'The archive does not wish you to leave. Are you certain?';
    }
});

// ========================================
// EXPORTED API
// ========================================
window.AzathothArchive = {
    getState: function() {
        var stateCopy = {};
        for (var key in ArchiveState) {
            stateCopy[key] = ArchiveState[key];
        }
        return stateCopy;
    },
    setSanity: function(value) {
        updateSanity(ArchiveState.sanity - value);
    },
    triggerDisturbance: function() {
        randomDisturbance();
    },
    corruptRandomText: function() {
        var texts = document.querySelectorAll('.corruptible-text');
        if (texts.length > 0) corruptText(texts[randomInt(0, texts.length - 1)], 1);
    },
    triggerSanityFlash: triggerSanityFlash
};