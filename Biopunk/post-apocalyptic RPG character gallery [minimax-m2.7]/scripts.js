/* ═══════════════════════════════════════════════════════════════════════════
   MUTAGENESIS | Biopunk RPG Character Gallery JavaScript
   POST-APOCALYPTIC INTERACTIVE ENGINE
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeFilters();
    initializeSort();
    initializeCardEffects();
    initializeDateTime();
    initializeScrollEffects();
    console.log('MUTAGENESIS Terminal v2.097.284.17 initialized successfully.');
});

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLE SYSTEM
   ───────────────────────────────────────────────────────────────────────────── */
function initializeParticles() {
    var particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    var particleCount = 25;
    var particleTypes = [
        { color: '#39ff14', size: 4, opacity: 0.6 },
        { color: '#00f5d4', size: 3, opacity: 0.5 },
        { color: '#bf40bf', size: 5, opacity: 0.4 },
        { color: '#ff6b35', size: 3, opacity: 0.5 }
    ];
    
    for (var i = 0; i < particleCount; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        var type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        var duration = 15 + Math.random() * 20;
        var delay = Math.random() * 10;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = type.size + 'px';
        particle.style.height = type.size + 'px';
        particle.style.background = type.color;
        particle.style.opacity = type.opacity;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        particle.style.boxShadow = '0 0 ' + (type.size * 2) + 'px ' + type.color + '80';
        
        particlesContainer.appendChild(particle);
    }
    
    animateParticles();
}

function animateParticles() {
    var particles = document.querySelectorAll('.particle');
    var time = 0;
    
    function updateParticles() {
        time += 0.01;
        for (var i = 0; i < particles.length; i++) {
            (function(index) {
                var baseX = parseFloat(particles[index].style.left);
                var offsetX = Math.sin(time + index * 0.5) * 5;
                var offsetY = Math.cos(time * 0.7 + index * 0.3) * 3;
                particles[index].style.transform = 'translateX(' + offsetX + 'px) translateY(' + offsetY + 'px)';
            })(i);
        }
        requestAnimationFrame(updateParticles);
    }
    
    updateParticles();
}

/* ─────────────────────────────────────────────────────────────────────────────
   FILTER SYSTEM
   ───────────────────────────────────────────────────────────────────────────── */
function initializeFilters() {
    var filterButtons = document.querySelectorAll('.filter-btn');
    var characterCards = document.querySelectorAll('.character-card');
    
    for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', (function(button) {
            return function() {
                var allButtons = document.querySelectorAll('.filter-btn');
                for (var j = 0; j < allButtons.length; j++) {
                    allButtons[j].classList.remove('active');
                }
                button.classList.add('active');
                
                var filter = button.getAttribute('data-filter');
                var cards = document.querySelectorAll('.character-card');
                filterCharacters(filter, cards);
                updateSurvivorCount(filter);
            };
        })(filterButtons[i]));
    }
}

function filterCharacters(filter, cards) {
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var faction = card.getAttribute('data-faction');
        var shouldShow = (filter === 'all' || faction === filter);
        
        if (shouldShow) {
            card.classList.remove('hidden', 'filtering-out');
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'cardEntrance 0.6s ease-out backwards';
            card.style.animationDelay = (i * 0.1) + 's';
        } else {
            card.classList.add('filtering-out');
            setTimeout((function(c) {
                return function() {
                    if (c.classList.contains('filtering-out')) {
                        c.classList.add('hidden');
                    }
                };
            })(card), 500);
        }
    }
    
    setTimeout(function() {
        var visibleCards = document.querySelectorAll('.character-card:not(.hidden)');
        for (var k = 0; k < visibleCards.length; k++) {
            visibleCards[k].style.animationDelay = (k * 0.1) + 's';
        }
    }, 600);
}

function updateSurvivorCount(filter) {
    var counter = document.getElementById('survivor-count');
    if (!counter) return;
    
    var cards = document.querySelectorAll('.character-card');
    var count = 0;
    
    for (var i = 0; i < cards.length; i++) {
        var faction = cards[i].getAttribute('data-faction');
        if (filter === 'all' || faction === filter) {
            count++;
        }
    }
    
    animateCounter(counter, count);
}

function animateCounter(element, target) {
    var current = parseInt(element.textContent) || 0;
    var diff = target - current;
    var steps = 20;
    var stepValue = diff / steps;
    var step = 0;
    
    var interval = setInterval(function() {
        step++;
        var value = Math.round(current + stepValue * step);
        element.textContent = value.toString().padStart(2, '0');
        if (step >= steps) {
            element.textContent = target.toString().padStart(2, '0');
            clearInterval(interval);
        }
    }, 30);
}

/* ─────────────────────────────────────────────────────────────────────────────
   SORT SYSTEM
   ───────────────────────────────────────────────────────────────────────────── */
function initializeSort() {
    var sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        var sortBy = sortSelect.value;
        var grid = document.getElementById('character-grid');
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.character-card'));
        
        cards.sort(function(a, b) {
            switch (sortBy) {
                case 'id':
                    return parseInt(a.getAttribute('data-id')) - parseInt(b.getAttribute('data-id'));
                case 'mutation':
                    return parseInt(b.getAttribute('data-mutation')) - parseInt(a.getAttribute('data-mutation'));
                case 'contamination':
                    return parseInt(b.getAttribute('data-contamination')) - parseInt(a.getAttribute('data-contamination'));
                case 'name':
                    var nameA = a.querySelector('.character-name').textContent;
                    var nameB = b.querySelector('.character-name').textContent;
                    return nameA.localeCompare(nameB);
                default:
                    return 0;
            }
        });
        
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.opacity = '0';
            cards[i].style.transform = 'translateY(20px) scale(0.95)';
        }
        
        setTimeout(function() {
            for (var j = 0; j < cards.length; j++) {
                grid.appendChild(cards[j]);
                setTimeout((function(card, index) {
                    return function() {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                        card.style.transition = 'all 0.5s ease-out';
                    };
                })(cards[j], j), j * 50);
            }
        }, 300);
    });
}

/* ─────────────────────────────────────────────────────────────────────────────
   CARD EFFECTS
   ───────────────────────────────────────────────────────────────────────────── */
function initializeCardEffects() {
    var cards = document.querySelectorAll('.character-card');
    
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        
        card.addEventListener('mouseenter', (function(c) {
            return function() {
                c.setAttribute('data-hovering', 'true');
                triggerGlitchEffect(c);
                createFactionBurst(c, c.getAttribute('data-faction'));
            };
        })(card));
        
        card.addEventListener('mouseleave', (function(c) {
            return function() {
                c.setAttribute('data-hovering', 'false');
            };
        })(card));
        
        var skillBars = card.querySelectorAll('.skill-fill');
        var observer = new IntersectionObserver(function(entries) {
            for (var j = 0; j < entries.length; j++) {
                if (entries[j].isIntersecting) {
                    animateSkillBars(skillBars);
                    observer.unobserve(entries[j].target);
                }
            }
        }, { threshold: 0.3 });
        
        observer.observe(card);
        applyFactionEffects(card);
    }
}

function animateSkillBars(bars) {
    for (var i = 0; i < bars.length; i++) {
        (function(bar, index) {
            var width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(function() {
                bar.style.width = width;
            }, index * 100);
        })(bars[i], i);
    }
}

function triggerGlitchEffect(card) {
    var portraitGlitch = card.querySelector('.portrait-glitch');
    var cardGlitch = card.querySelector('.card-glitch');
    var isHovering = card.getAttribute('data-hovering');
    
    if (portraitGlitch && isHovering === 'true') {
        portraitGlitch.style.opacity = '1';
        setTimeout(function() {
            if (card.getAttribute('data-hovering') === 'false') {
                portraitGlitch.style.opacity = '0';
            }
        }, 300);
    }
    
    if (cardGlitch && isHovering === 'true') {
        cardGlitch.style.opacity = '1';
        setTimeout(function() {
            if (card.getAttribute('data-hovering') === 'false') {
                cardGlitch.style.opacity = '0';
            }
        }, 300);
    }
}

function applyFactionEffects(card) {
    var faction = card.getAttribute('data-faction');
    var portraitFrame = card.querySelector('.portrait-frame');
    if (!portraitFrame) return;
    
    var glowColor = getFactionColor(faction);
    portraitFrame.style.boxShadow = '0 0 30px ' + glowColor + '20, inset 0 0 20px ' + glowColor + '10';
}

function getFactionColor(faction) {
    var colors = {
        feral: '#ff6b35',
        corporate: '#00a8ff',
        nomad: '#39ff14',
        synth: '#e040fb'
    };
    return colors[faction] || '#39ff14';
}

function createFactionBurst(card, faction) {
    var portrait = card.querySelector('.portrait-frame');
    if (!portrait) return;
    
    var rect = portrait.getBoundingClientRect();
    var burstCount = 8;
    var color = getFactionColor(faction);
    
    for (var i = 0; i < burstCount; i++) {
        (function(index) {
            var particle = document.createElement('div');
            var angle = (index / burstCount) * Math.PI * 2;
            var distance = 50 + Math.random() * 50;
            var duration = 500 + Math.random() * 300;
            
            particle.style.position = 'fixed';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.boxShadow = '0 0 10px ' + color;
            
            document.body.appendChild(particle);
            
            var startX = 0;
            var startY = 0;
            var endX = Math.cos(angle) * distance;
            var endY = Math.sin(angle) * distance;
            
            var animation = particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: 'translate(' + endX + 'px, ' + endY + 'px) scale(0)', opacity: 0 }
            ], {
                duration: duration,
                easing: 'ease-out'
            });
            
            animation.onfinish = function() {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        })(i);
    }
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATE/TIME SYSTEM
   ───────────────────────────────────────────────────────────────────────────── */
function initializeDateTime() {
    var dateElement = document.getElementById('last-update');
    if (!dateElement) return;
    
    updateDateTime();
    setInterval(updateDateTime, 10000);
}

function updateDateTime() {
    var dateElement = document.getElementById('last-update');
    if (!dateElement) return;
    
    var year = 2097;
    var day = Math.floor(Math.random() * 365) + 1;
    var hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    var minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    var second = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    
    dateElement.textContent = year + '.' + String(day).padStart(3, '0') + '.' + hour + '.' + minute + '.' + second;
    
    dateElement.style.animation = 'none';
    dateElement.offsetHeight;
    dateElement.style.animation = 'dateGlitch 0.3s steps(2)';
}

var dateGlitchStyle = document.createElement('style');
dateGlitchStyle.textContent = '' +
    '@keyframes dateGlitch {' +
    '  0% { opacity: 1; transform: translateX(0); }' +
    '  25% { opacity: 0.5; transform: translateX(-2px); }' +
    '  50% { opacity: 1; transform: translateX(2px); }' +
    '  75% { opacity: 0.5; transform: translateX(-1px); }' +
    '  100% { opacity: 1; transform: translateX(0); }' +
    '}';
document.head.appendChild(dateGlitchStyle);

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL EFFECTS
   ───────────────────────────────────────────────────────────────────────────── */
function initializeScrollEffects() {
    var header = document.querySelector('.site-header');
    var filterSection = document.querySelector('.filter-section');
    var ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(header, filterSection);
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleScroll(header, filterSection) {
    var scrollY = window.scrollY;
    
    if (header) {
        if (scrollY > 100) {
            header.style.opacity = Math.max(0.5, 1 - scrollY / 500);
            header.style.transform = 'translateY(' + (scrollY * 0.1) + 'px)';
        } else {
            header.style.opacity = 1;
            header.style.transform = 'translateY(0)';
        }
    }
    
    if (filterSection) {
        var filterTop = filterSection.getBoundingClientRect().top;
        if (filterTop <= 0) {
            filterSection.style.position = 'fixed';
            filterSection.style.top = '0';
            filterSection.style.left = '0';
            filterSection.style.right = '0';
            filterSection.style.zIndex = '100';
            filterSection.style.margin = '0';
            filterSection.style.borderRadius = '0';
            filterSection.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            filterSection.style.position = '';
            filterSection.style.top = '';
            filterSection.style.left = '';
            filterSection.style.right = '';
            filterSection.style.zIndex = '';
            filterSection.style.boxShadow = '';
        }
    }
}

function handleParallax() {
    var scrollY = window.scrollY;
    var dnaHelixes = document.querySelectorAll('.dna-helix');
    
    for (var i = 0; i < dnaHelixes.length; i++) {
        var speed = 0.1 + i * 0.05;
        dnaHelixes[i].style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    }
}

/* ─────────────────────────────────────────────────────────────────────────────
   AUDIO SYSTEM
   ───────────────────────────────────────────────────────────────────────────── */
var audioContext = null;

function initializeAmbientSounds() {
    document.body.addEventListener('click', function() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, { once: true });
}

function playHoverSound() {
    if (!audioContext) return;
    try {
        var oscillator = audioContext.createOscillator();
        var gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800 + Math.random() * 400;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio not available, fail silently
    }
}

function playClickSound() {
    if (!audioContext) return;
    try {
        var oscillator = audioContext.createOscillator();
        var gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 1200;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
        // Audio not available, fail silently
    }
}

/* ─────────────────────────────────────────────────────────────────────────────
   TOUCH SUPPORT FOR MOBILE
   ───────────────────────────────────────────────────────────────────────────── */
function initializeTouchSupport() {
    if (!('ontouchstart' in window)) return;
    
    var cards = document.querySelectorAll('.character-card');
    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        cards[i].addEventListener('touchend', function() {
            var self = this;
            setTimeout(function() {
                self.classList.remove('touch-active');
            }, 300);
        });
    }
    
    var touchStyle = document.createElement('style');
    touchStyle.textContent = '' +
        '.character-card.touch-active .card-frame {' +
        '  transform: scale(0.98);' +
        '  border-color: #00f5d4;' +
        '}' +
        '.character-card.expanded {' +
        '  z-index: 50;' +
        '}' +
        '.character-card.expanded .card-frame {' +
        '  transform: scale(1.02);' +
        '  box-shadow: 0 0 50px rgba(0, 245, 212, 0.5);' +
        '}';
    document.head.appendChild(touchStyle);
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONSOLE MESSAGE
   ───────────────────────────────────────────────────────────────────────────── */
console.log('========================================================');
console.log('  MUTAGENESIS TERMINAL v2.097.284.17');
console.log('  BIOPUNK SURVIVOR DATABASE');
console.log('  ------------------------------------------------');
console.log('  WARNING: Unauthorized access will be met with');
console.log('  immediate termination protocols.');
console.log('  ------------------------------------------------');
console.log('  "In the wasteland, mutation is not a curse—');
console.log('   it\'s evolution."');
console.log('========================================================');

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL API FOR DEBUGGING
   ───────────────────────────────────────────────────────────────────────────── */
window.Mutagenesis = {
    version: '2.097.284.17',
    characters: function() {
        return document.querySelectorAll('.character-card');
    },
    filter: function(faction) {
        filterCharacters(faction, document.querySelectorAll('.character-card'));
    },
    sort: function(by) {
        var select = document.getElementById('sort-select');
        if (select) select.value = by;
    },
    getStats: function() {
        var cards = document.querySelectorAll('.character-card');
        var total = cards.length;
        var contaminationSum = 0;
        
        for (var i = 0; i < cards.length; i++) {
            contaminationSum += parseInt(cards[i].getAttribute('data-contamination'));
        }
        
        return {
            totalCharacters: total,
            factions: {
                feral: document.querySelectorAll('[data-faction="feral"]').length,
                corporate: document.querySelectorAll('[data-faction="corporate"]').length,
                nomad: document.querySelectorAll('[data-faction="nomad"]').length,
                synth: document.querySelectorAll('[data-faction="synth"]').length
            },
            averageContamination: contaminationSum / total
        };
    }
};