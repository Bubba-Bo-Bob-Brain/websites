/* ========================================
TONALPOHUALI - Sacred Calendar JavaScript
Divine Interactive Elements
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSacredCalendar();
});

function initSacredCalendar() {
    initTooltipSystem();
    initCalendarWheel();
    initEclipseCountdown();
    initSerpentAnimation();
    initDeityCards();
    initRitualItems();
    initStarfield();
    initSmoothScroll();
    initWheelControls();
    initGlyphHover();
    initStaggeredAnimations();
    console.log('🔮 Tonalpohualli Calendar Initialized');
}

function initTooltipSystem() {
    var tooltip = document.getElementById('glyphTooltip');
    var tooltipGlyph = tooltip.querySelector('.tooltip-glyph');
    var tooltipName = tooltip.querySelector('.tooltip-name');
    var tooltipTranslation = tooltip.querySelector('.tooltip-translation');
    var hideTimeout;

    var glyphElements = document.querySelectorAll('[data-glyph]');
    
    glyphElements.forEach(function(element) {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mousemove', moveTooltip);
        element.addEventListener('mouseleave', hideTooltipDelayed);
        element.addEventListener('click', showTooltip);
        element.addEventListener('touchstart', showTooltip);
    });

    function showTooltip(e) {
        clearTimeout(hideTimeout);
        var element = e.currentTarget;
        var glyph = element.dataset.glyph;
        var translation = element.dataset.translation;
        var displayGlyph = element.textContent.trim() || element.innerHTML;
        
        tooltipGlyph.textContent = displayGlyph;
        tooltipName.textContent = formatGlyphName(glyph);
        tooltipTranslation.textContent = translation;
        tooltip.classList.add('visible');
        moveTooltip(e);
    }

    function moveTooltip(e) {
        var padding = 15;
        var x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        var y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        var tooltipRect = tooltip.getBoundingClientRect();
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;

        if (x + tooltipRect.width + padding > viewportWidth) {
            x = x - tooltipRect.width - padding;
        } else {
            x = x + padding;
        }

        if (y + tooltipRect.height + padding > viewportHeight) {
            y = y - tooltipRect.height - padding;
        } else {
            y = y + padding;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    function hideTooltipDelayed() {
        hideTimeout = setTimeout(function() {
            tooltip.classList.remove('visible');
        }, 300);
    }

    function formatGlyphName(glyph) {
        return glyph.split('-').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }
}

function initCalendarWheel() {
    var ringMarkers = document.querySelector('.ring-markers');
    var daySignMarkers = document.querySelectorAll('.day-sign-marker');
    var totalSigns = daySignMarkers.length;
    var currentRotation = 0;
    var currentSignIndex = 0;

    var daySigns = [
        { name: 'Cipactli', glyph: '🐊', meaning: 'Crocodile - The Earth Monster', deity: 'Tlaltecuhtli', direction: 'East' },
        { name: 'Ehécatl', glyph: '🌬️', meaning: 'Wind - The Breath', deity: 'Quetzalcoatl', direction: 'North' },
        { name: 'Calli', glyph: '🏠', meaning: 'House - The Dwelling', deity: 'Tonacatecuhtli', direction: 'West' },
        { name: 'Cuetzpallin', glyph: '🦎', meaning: 'Lizard - The Reptile', deity: 'Chalchiuhtlicue', direction: 'South' },
        { name: 'Coatl', glyph: '🐍', meaning: 'Serpent - The Snake', deity: 'Quetzalcoatl', direction: 'East' },
        { name: 'Mazatl', glyph: '🦌', meaning: 'Deer - The Antelope', deity: 'Xipe Totec', direction: 'North' },
        { name: 'Tochtli', glyph: '🐰', meaning: 'Rabbit - The Lagomorph', deity: 'Ometochtli', direction: 'West' },
        { name: 'Atl', glyph: '🌊', meaning: 'Water - The Liquid', deity: 'Tlaloc', direction: 'South' },
        { name: 'Itzcuintli', glyph: '🐕', meaning: 'Dog - The Canine', deity: 'Xolotl', direction: 'East' },
        { name: 'Ozomatli', glyph: '🐒', meaning: 'Monkey - The Primate', deity: 'Xochipilli', direction: 'North' },
        { name: 'Malinalli', glyph: '🌿', meaning: 'Grass - The Herb', deity: 'Patecatl', direction: 'West' },
        { name: 'Acatl', glyph: '🎋', meaning: 'Reed - The Cane', deity: 'Xiuhtecuhtli', direction: 'South' },
        { name: 'Ocelotl', glyph: '🐆', meaning: 'Ocelot - The Jaguar', deity: 'Tlaloc', direction: 'East' },
        { name: 'Cuauhtli', glyph: '🦅', meaning: 'Eagle - The Raptor', deity: 'Huitzilopochtli', direction: 'North' },
        { name: 'Coatl', glyph: '🐍', meaning: 'Snake - The Serpent', deity: 'Quetzalcoatl', direction: 'West' },
        { name: 'Mazatl', glyph: '🦌', meaning: 'Deer - The Antelope', deity: 'Xipe Totec', direction: 'South' },
        { name: 'Tochtli', glyph: '🐰', meaning: 'Rabbit - The Lagomorph', deity: 'Ometochtli', direction: 'East' },
        { name: 'Atl', glyph: '🌊', meaning: 'Water - The Liquid', deity: 'Tlaloc', direction: 'North' },
        { name: 'Itzcuintli', glyph: '🐕', meaning: 'Dog - The Canine', deity: 'Xolotl', direction: 'West' },
        { name: 'Ozomatli', glyph: '🐒', meaning: 'Monkey - The Primate', deity: 'Xochipilli', direction: 'South' }
    ];

    daySignMarkers.forEach(function(marker, index) {
        marker.addEventListener('click', function() {
            var rotationAmount = index * (360 / totalSigns);
            rotateToSign(index, rotationAmount);
        });

        marker.addEventListener('mouseenter', function() {
            var signData = daySigns[index];
            marker.setAttribute('data-glyph', signData.name.toLowerCase());
            marker.setAttribute('data-translation', signData.meaning + ' - Deity: ' + signData.deity + ' - Direction: ' + signData.direction);
        });
    });

    function rotateWheel(degrees) {
        currentRotation += degrees;
        if (ringMarkers) {
            ringMarkers.style.transform = 'rotate(' + currentRotation + 'deg)';
        }
        currentSignIndex = Math.abs(Math.floor(currentRotation / (360 / totalSigns))) % totalSigns;
        updateCurrentDayDisplay();
    }

    function rotateToSign(index, rotation) {
        currentRotation = rotation;
        if (ringMarkers) {
            ringMarkers.style.transform = 'rotate(' + currentRotation + 'deg)';
        }
        currentSignIndex = index;
        updateCurrentDayDisplay();

        var centerOrb = document.querySelector('.center-orb');
        if (centerOrb) {
            centerOrb.style.animation = 'none';
            centerOrb.offsetHeight;
            centerOrb.style.animation = 'orb-pulse 0.5s ease-in-out 3';
        }
    }

    function updateCurrentDayDisplay() {
        var daySign = daySigns[currentSignIndex];
        var dayNumber = (currentSignIndex + 1).toString().padStart(2, '0');

        var dayNameElement = document.querySelector('.day-name');
        var daySignElement = document.querySelector('.current-era .day-sign');

        if (dayNameElement) {
            dayNameElement.textContent = dayNumber + ' ' + daySign.name;
        }
        if (daySignElement) {
            daySignElement.textContent = daySign.glyph;
            daySignElement.setAttribute('data-glyph', daySign.name.toLowerCase());
            daySignElement.setAttribute('data-translation', daySign.meaning);
        }
    }

    window.sacredCalendar = {
        rotateWheel: rotateWheel,
        rotateToSign: rotateToSign,
        daySigns: daySigns,
        getCurrentSign: function() { return currentSignIndex; }
    };
}

function initWheelControls() {
    var prevBtn = document.getElementById('prevDay');
    var nextBtn = document.getElementById('nextDay');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            if (window.sacredCalendar) {
                window.sacredCalendar.rotateWheel(-18);
            }
        });

        nextBtn.addEventListener('click', function() {
            if (window.sacredCalendar) {
                window.sacredCalendar.rotateWheel(18);
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            if (window.sacredCalendar) {
                window.sacredCalendar.rotateWheel(-18);
            }
        }
        if (e.key === 'ArrowRight') {
            if (window.sacredCalendar) {
                window.sacredCalendar.rotateWheel(18);
            }
        }
    });
}

function initEclipseCountdown() {
    var eclipseDate = new Date();
    eclipseDate.setDate(eclipseDate.getDate() + 30);
    eclipseDate.setHours(22, 30, 0, 0);

    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');
    var eclipseDateEl = document.getElementById('eclipseDate');

    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    if (eclipseDateEl) {
        eclipseDateEl.textContent = 'Expected: ' + eclipseDate.toLocaleDateString('en-US', options);
    }

    function updateCountdown() {
        var now = new Date();
        var diff = eclipseDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            triggerEclipseEvent();
            return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        animateNumberChange(daysEl, days);
        animateNumberChange(hoursEl, hours);
        animateNumberChange(minutesEl, minutes);
        animateNumberChange(secondsEl, seconds);
    }

    function animateNumberChange(element, value) {
        var formattedValue = value.toString().padStart(2, '0');
        if (element.textContent !== formattedValue) {
            element.style.transform = 'scale(1.2)';
            element.style.textShadow = '0 0 30px var(--gold-glow)';
            setTimeout(function() {
                element.style.transform = 'scale(1)';
                element.style.textShadow = '';
            }, 150);
            element.textContent = formattedValue;
        }
    }

    function triggerEclipseEvent() {
        var flash = document.createElement('div');
        flash.className = 'eclipse-flash';
        flash.style.cssText = 'position:fixed;inset:0;background:var(--blood-bright);z-index:9999;animation:eclipseFlash 2s ease-out forwards;pointer-events:none;';
        document.body.appendChild(flash);

        var style = document.createElement('style');
        style.textContent = '@keyframes eclipseFlash{0%{opacity:0.8}50%{opacity:0.4}100%{opacity:0}}';
        document.head.appendChild(style);

        setTimeout(function() { flash.remove(); }, 2000);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    var moonSurface = document.querySelector('.moon-surface');
    if (moonSurface) {
        var shadowOverlay = moonSurface.querySelector('.shadow-overlay');
        if (shadowOverlay) {
            var shadowAngle = 0;
            function animateShadow() {
                shadowAngle += 0.02;
                var xPos = 50 + Math.sin(shadowAngle) * 30;
                shadowOverlay.style.background = 'linear-gradient(' + xPos + 'deg, transparent 40%, rgba(0,0,0,' + (0.4 + Math.sin(shadowAngle) * 0.2) + ') 100%)';
                requestAnimationFrame(animateShadow);
            }
            animateShadow();
        }
    }
}

function initSerpentAnimation() {
    var serpentBorders = document.querySelectorAll('.serpent-border');
    
    serpentBorders.forEach(function(border) {
        border.addEventListener('mousemove', function(e) {
            var rect = border.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            border.style.transform = 'translate(' + (x * 5) + 'px, ' + (y * 3) + 'px)';
        });

        border.addEventListener('mouseleave', function() {
            border.style.transform = 'translate(0, 0)';
        });
    });

    var scales = document.querySelectorAll('.serpent-scales circle');
    scales.forEach(function(scale, index) {
        setInterval(function() {
            scale.style.r = '8';
            setTimeout(function() {
                scale.style.r = '10';
            }, 100);
        }, 2000 + index * 200);
    });
}

function initDeityCards() {
    var deityCards = document.querySelectorAll('.deity-card');

    deityCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            var auras = card.querySelectorAll('.deity-aura');
            auras.forEach(function(aura) {
                aura.style.animationDuration = '1.5s';
            });
        });

        card.addEventListener('mouseleave', function() {
            var auras = card.querySelectorAll('.deity-aura');
            auras.forEach(function(aura) {
                aura.style.animationDuration = '3s';
            });
        });

        card.addEventListener('click', function() {
            card.classList.toggle('expanded');
            if (card.classList.contains('expanded')) {
                card.style.maxHeight = '500px';
            } else {
                card.style.maxHeight = '150px';
            }
        });
    });

    var cycleBars = document.querySelectorAll('.cycle-bar');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.getPropertyValue('--power');
            }
        });
    }, { threshold: 0.5 });

    cycleBars.forEach(function(bar) {
        observer.observe(bar);
    });
}

function initRitualItems() {
    var ritualItems = document.querySelectorAll('.ritual-item');

    ritualItems.forEach(function(item, index) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';

        setTimeout(function() {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + index * 100);

        var statusBadge = item.querySelector('.status-badge');
        if (statusBadge && statusBadge.classList.contains('active')) {
            statusBadge.addEventListener('mouseenter', function() {
                statusBadge.style.transform = 'scale(1.1)';
                statusBadge.style.boxShadow = '0 0 20px var(--gold-glow)';
            });
            statusBadge.addEventListener('mouseleave', function() {
                statusBadge.style.transform = 'scale(1)';
                statusBadge.style.boxShadow = '';
            });
        }
    });
}

function initStarfield() {
    var starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;

    var numStars = 100;
    for (var i = 0; i < numStars; i++) {
        var star = document.createElement('div');
        star.className = 'dynamic-star';
        var size = Math.random() * 3 + 1;
        var x = Math.random() * 100;
        var y = Math.random() * 100;
        var duration = Math.random() * 5 + 3;
        var delay = Math.random() * 5;

        star.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;background:radial-gradient(circle,rgba(255,255,255,0.9),transparent);border-radius:50%;left:' + x + '%;top:' + y + '%;animation:starTwinkle ' + duration + 's ease-in-out ' + delay + 's infinite;';
        starsContainer.appendChild(star);
    }

    function createShootingStar() {
        var shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        var startX = Math.random() * 100;
        var startY = Math.random() * 50;
        shootingStar.style.cssText = 'position:absolute;width:100px;height:2px;background:linear-gradient(90deg,transparent,var(--gold-light),transparent);left:' + startX + '%;top:' + startY + '%;transform:rotate(-45deg);animation:shootingStar 1s ease-out forwards;pointer-events:none;';
        starsContainer.appendChild(shootingStar);
        setTimeout(function() { shootingStar.remove(); }, 1000);
    }

    setInterval(function() {
        if (Math.random() > 0.7) {
            createShootingStar();
        }
    }, 5000 + Math.random() * 5000);

    if (!document.querySelector('#star-animations')) {
        var style = document.createElement('style');
        style.id = 'star-animations';
        style.textContent = '@keyframes starTwinkle{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}@keyframes shootingStar{0%{transform:rotate(-45deg) translateX(0);opacity:1}100%{transform:rotate(-45deg) translateX(500px);opacity:0}}';
        document.head.appendChild(style);
    }
}

function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    var sections = document.querySelectorAll('section');
    var sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(function(section) {
        sectionObserver.observe(section);
    });
}

function initGlyphHover() {
    var glyphs = document.querySelectorAll('.glyph');

    glyphs.forEach(function(glyph) {
        glyph.addEventListener('mouseenter', function() {
            glyph.style.animation = 'glyph-float 0.5s ease-in-out';
        });
        glyph.addEventListener('mouseleave', function() {
            glyph.style.animation = '';
        });
    });

    var headerGlyphs = document.querySelectorAll('.header-glyphs .glyph');
    headerGlyphs.forEach(function(glyph, index) {
        setInterval(function() {
            glyph.style.transform = 'scale(1.2)';
            glyph.style.filter = 'drop-shadow(0 0 15px var(--gold-glow))';
            setTimeout(function() {
                glyph.style.transform = 'scale(1)';
                glyph.style.filter = '';
            }, 500);
        }, 4000 + index * 1500);
    });
}

function initStaggeredAnimations() {
    var panels = document.querySelectorAll('.deity-cycles, .ritual-schedule, .astronomical-events, .tribute-schedule, .glyph-legend');

    panels.forEach(function(panel, index) {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(30px)';

        setTimeout(function() {
            panel.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, 500 + index * 150);
    });

    var footerGlyphs = document.querySelectorAll('.footer-glyph');
    footerGlyphs.forEach(function(glyph, index) {
        glyph.style.opacity = '0';

        setTimeout(function() {
            glyph.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            glyph.style.opacity = '1';
            glyph.style.transform = 'rotate(0deg)';
        }, 2000 + index * 200);
    });

    var systemBadges = document.querySelectorAll('.system-badge');
    systemBadges.forEach(function(badge, index) {
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0.8)';

        setTimeout(function() {
            badge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }, 1500 + index * 300);
    });
}

function formatMesoDate(date) {
    var months = [
        'Atlcahualo', 'Tlacaxipehualiztli', 'Tlacelel', 'Tomo', 'Toxcatl',
        'Etzalcualiztli', 'Tecuilhontomi', 'Teotleco', 'Tepeilhuitl', 'Quecholli',
        'Panquetzaliztli', 'Atemoztli', 'Tititl', 'Izcalli'
    ];

    var day = date.getDate();
    var month = months[date.getMonth()];
    return day + ' ' + month;
}

function getCurrentTrecena() {
    var startDate = new Date();
    startDate.setMonth(0, 1);
    var daysSinceStart = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24));
    var trecenaDay = (daysSinceStart % 13) + 1;
    var trecenaNumber = Math.floor(daysSinceStart / 13) + 1;
    return { day: trecenaDay, number: trecenaNumber };
}

function getYearBearer() {
    var year = new Date().getFullYear();
    var yearBearers = [
        '1 Reed', '2 Flint', '3 House', '4 Rabbit', '5 Water',
        '6 Dog', '7 Monkey', '8 Grass', '9 Serpent', '10 Death',
        '11 Deer', '12 Eagle', '13 Owl'
    ];
    return yearBearers[year % 13];
}

console.log('%c🌟 Tonalpohualli 🌟', 'font-size:24px;color:#d4af37;font-weight:bold;');
console.log('%cThe sacred count of days guides us through the divine cycles...', 'font-style:italic;color:#00a86b;');