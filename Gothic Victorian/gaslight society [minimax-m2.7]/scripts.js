/**
 * THE ORDER OF THE CRIMSON VEIL
 * Members' Directory JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initializeClock();
    initializeTabs();
    initializeFilters();
    initializeSearch();
    initializeModal();
    initializeWaxSeal();
    initializeInvitationForm();
    initializeAnimations();
});

// =====================================================
// GRANDFATHER CLOCK
// =====================================================
function initializeClock() {
    var clockHands = {
        hour: document.getElementById('hourHand'),
        minute: document.getElementById('minuteHand'),
        second: document.getElementById('secondHand')
    };
    var moonPhase = document.getElementById('moonShape');
    
    function updateClock() {
        var now = new Date();
        var hours = now.getHours() % 12;
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var milliseconds = now.getMilliseconds();
        
        var secondAngle = (seconds * 6) + (milliseconds * 0.006);
        var minuteAngle = (minutes * 6) + (seconds * 0.1);
        var hourAngle = (hours * 30) + (minutes * 0.5);
        
        if (clockHands.hour) {
            clockHands.hour.style.transform = 'rotate(' + hourAngle + 'deg)';
        }
        if (clockHands.minute) {
            clockHands.minute.style.transform = 'rotate(' + minuteAngle + 'deg)';
        }
        if (clockHands.second) {
            clockHands.second.style.transform = 'rotate(' + secondAngle + 'deg)';
        }
        
        updateMoonPhase(now, moonPhase);
    }
    
    function updateMoonPhase(date, element) {
        if (!element) return;
        var lunationNumber = 2551583;
        var msPerDay = 86400000;
        var daysSinceNewMoon = (date.getTime() - lunationNumber * msPerDay) / msPerDay;
        var lunarAge = ((daysSinceNewMoon % 29.53059) + 29.53059) % 29.53059;
        var illumination = 0.5 * (1 - Math.cos(2 * Math.PI * lunarAge / 29.53059));
        var x = 30 + illumination * 20;
        var pathD = 'M30,5 A25,25 0 0,1 ' + x + ',30 A25,25 0 0,1 30,55 Q30,30 ' + x + ',5';
        element.setAttribute('d', pathD);
    }
    
    updateClock();
    setInterval(updateClock, 50);
}

// =====================================================
// TAB NAVIGATION
// =====================================================
function initializeTabs() {
    var tabs = document.querySelectorAll('.nav-tab');
    var contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var targetId = tab.dataset.tab;
            
            tabs.forEach(function(t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            contents.forEach(function(content) {
                content.classList.remove('active');
                if (content.id === targetId + '-content') {
                    content.classList.add('active');
                }
            });
            
            window.history.pushState(null, null, '#' + targetId);
        });
    });
    
    if (window.location.hash) {
        var targetTab = document.querySelector('[data-tab="' + window.location.hash.slice(1) + '"]');
        if (targetTab) targetTab.click();
    }
}

// =====================================================
// MEMBER FILTERING
// =====================================================
function initializeFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var specialtySelect = document.getElementById('specialtyFilter');
    var memberCards = document.querySelectorAll('.member-card');
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.dataset.filter;
            
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            applyFilters(filter, specialtySelect.value);
        });
    });
    
    if (specialtySelect) {
        specialtySelect.addEventListener('change', function() {
            var circleFilter = document.querySelector('.filter-btn.active');
            circleFilter = circleFilter ? circleFilter.dataset.filter : 'all';
            applyFilters(circleFilter, specialtySelect.value);
        });
    }
    
    function applyFilters(circleFilter, specialtyFilter) {
        var visibleCount = 0;
        
        memberCards.forEach(function(card) {
            var cardCircle = card.dataset.circle;
            var cardSpecialty = card.dataset.specialty;
            var circleMatch = circleFilter === 'all' || cardCircle === circleFilter;
            var specialtyMatch = specialtyFilter === 'all' || cardSpecialty === specialtyFilter;
            
            if (circleMatch && specialtyMatch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

// =====================================================
// SEARCH
// =====================================================
function initializeSearch() {
    var searchInput = document.getElementById('memberSearch');
    var memberCards = document.querySelectorAll('.member-card');
    var searchTimeout;
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        var query = e.target.value.toLowerCase().trim();
        
        searchTimeout = setTimeout(function() {
            memberCards.forEach(function(card) {
                var name = card.querySelector('.member-name');
                name = name ? name.textContent.toLowerCase() : '';
                var title = card.querySelector('.member-title');
                title = title ? title.textContent.toLowerCase() : '';
                var sigil = card.querySelector('.sigil-mark');
                sigil = sigil ? sigil.textContent : '';
                
                var match = name.includes(query) || title.includes(query) || sigil.includes(query);
                
                if (match || query === '') {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }, 300);
    });
}

// =====================================================
// MEMBER MODAL
// =====================================================
function initializeModal() {
    var modal = document.getElementById('memberModal');
    var modalClose = document.getElementById('modalClose');
    var viewProfileBtns = document.querySelectorAll('.view-profile, .view-profil');
    
    var memberData = {
        ashworth: {
            name: 'Lord Mortimer Ashworth III',
            title: 'Archsummoner & Grand Master',
            circle: 'Core Council',
            specialty: 'Necromancy & Spirit Binding',
            seances: 'Every Full Moon',
            chamber: 'Sanctum Primus, Sub-Level III',
            since: '1832',
            sigil: '𓂀',
            biography: 'Lord Ashworth has presided over the Order since its reformation in the aftermath of the Napoleonic Wars. His command of spirit binding is unparalleled in modern times.',
            achievements: [
                'Founded the Order in its current form',
                'Author of "The Binding Rites"',
                'Performed the Great Sealing of 1847',
                'Mentor to three generations of summoners'
            ],
            rating: 5
        },
        vesper: {
            name: 'Eleanor Vesper-Blackwood',
            title: 'Mistress of the Alchemical Arts',
            circle: 'Inner Circle',
            specialty: 'Alchemical Transmutation',
            seances: 'New & Full Moon',
            chamber: 'The Mercurial Chamber',
            since: '1856',
            sigil: '⚗',
            biography: 'Born to a family of apothecaries, Eleanor discovered her gift for transmutation at age sixteen.',
            achievements: [
                'Discovered the Vesper Tincture',
                'Created the Philosopher\'s Stone variant',
                'Pioneered lunar-aligned transmutation',
                'Trained twelve apprentices'
            ],
            rating: 4
        },
        thornwood: {
            name: 'Cassandra Thornwood',
            title: 'Seer & Keeper of the Scrying Pool',
            circle: 'Inner Circle',
            specialty: 'Divination & Scrying',
            seances: 'Weekly, Wednesdays',
            chamber: 'The Obsidian Mirror',
            since: '1861',
            sigil: '🔮',
            biography: 'Cassandra\'s visions have guided the Order through three major crises. Her eyes, permanently marked with silver, see threads of fate.',
            achievements: [
                'Predicted the Great Fire of 1866',
                'Foresew the Order\'s near-dissolution in 1872',
                'Created the Obsidian Mirror scrying pool',
                'Maintains the Book of Prophetic Dreams'
            ],
            rating: 5
        },
        nightwing: {
            name: 'Silas Nightwing',
            title: 'Stargazer & Celestial Cartographer',
            circle: 'Outer Circle',
            specialty: 'Celestial Mechanics',
            seances: 'Monthly, Solstice',
            chamber: 'The Celestial Tower',
            since: '1867',
            sigil: '♁',
            biography: 'Silas spent seven years in the Orient studying astronomical texts before returning to London.',
            achievements: [
                'Charted 847 new celestial bodies',
                'Translated the Persian Star Codex',
                'Built the Order\'s primary observatory',
                'Predicts eclipse patterns with 99% accuracy'
            ],
            rating: 3
        },
        widdershins: {
            name: 'Agnes Widdershins',
            title: 'Hedge Witch & Poison Master',
            circle: 'Outer Circle',
            specialty: 'Herbalism & Poison',
            seances: 'As Required',
            chamber: 'The Widdershins Workshop',
            since: '1869',
            sigil: '🧪',
            biography: 'Agnes practices the old ways of hedge witchcraft, passed down through her family for generations.',
            achievements: [
                'Compiled the "Compendium of Venoms"',
                'Developed seven universal antidotes',
                'Maintains the Order\'s herb garden',
                'Created the detection tincture'
            ],
            rating: 3
        },
        thorne: {
            name: 'Dr. Aldous Thorne',
            title: 'Thaumaturgic Theorist & Ritual Architect',
            circle: 'Inner Circle',
            specialty: 'Thaumaturgic Arts',
            seances: 'Bi-Weekly',
            chamber: 'The Sigil Library',
            since: '1859',
            sigil: '✨',
            biography: 'A former Oxford don who abandoned academia for the arcane, Dr. Thorne has revolutionized the Order\'s ritual methodology.',
            achievements: [
                'Authored "Theoretical Thaumaturgy" (3 vols.)',
                'Designed the modern binding circles',
                'Discovered seventeen new sigils',
                'Invented the Thorne Safety Protocol'
            ],
            rating: 4
        },
        matriarch: {
            name: 'The Matriarch',
            title: 'Supreme Oracle & Founding Voice',
            circle: 'Core Council',
            specialty: 'Divination & Prophetic Visions',
            seances: 'Solely by Summons',
            chamber: 'The Veiled Sanctum',
            since: '1828',
            sigil: '👁',
            biography: 'No one knows the Matriarch\'s true name. She claims to have been present at the Order\'s founding in the dying days of Alexandria.',
            achievements: [
                'Founded the Order (according to legend)',
                'Witnessed the Fall of Alexandria',
                'Possesses the original founding documents',
                'Has never been seen to age'
            ],
            rating: 5
        },
        corvus: {
            name: 'Corvus Black',
            title: 'Grave-Walker & Death Whisperer',
            circle: 'Outer Circle',
            specialty: 'Necromancy & Spirit Binding',
            seances: 'Samhain & Beltane',
            chamber: 'St. Ambrose Cemetery',
            since: '1871',
            sigil: '🦅',
            biography: 'Corvus operates primarily among the dead, spending more nights in cemeteries than in the Order\'s halls.',
            achievements: [
                'Established communication with 200+ spirits',
                'Maps the boundary between worlds',
                'Created the Death Whisper technique',
                'Guards the Order\'s cemetery entrances'
            ],
            rating: 2
        }
    };
    
    viewProfileBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var memberId = btn.dataset.member;
            var member = memberData[memberId];
            if (member) {
                openMemberModal(member);
            }
        });
    });
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('visible')) {
            closeModal();
        }
    });
    
    function openMemberModal(member) {
        var modalInner = modal.querySelector('.modal-inner');
        var achievementsHtml = '';
        
        member.achievements.forEach(function(achievement) {
            achievementsHtml += '<li>✧ ' + achievement + '</li>';
        });
        
        var starsHtml = '';
        for (var i = 0; i < 5; i++) {
            starsHtml += '<span class="rating-star ' + (i < member.rating ? 'filled' : '') + '">' + (i < member.rating ? '★' : '☆') + '</span>';
        }
        
        var rankIcon = '';
        if (member.circle === 'Core Council') {
            rankIcon = '<svg viewBox="0 0 20 20"><path d="M10,2 L12,8 L18,8 L13,12 L15,18 L10,14 L5,18 L7,12 L2,8 L8,8 Z" fill="#D4A574"/></svg>';
        } else if (member.circle === 'Inner Circle') {
            rankIcon = '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="#D4A574" stroke-width="2"/><circle cx="10" cy="10" r="4" fill="#D4A574"/></svg>';
        } else {
            rankIcon = '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" fill="none" stroke="#D4A574" stroke-width="2" stroke-dasharray="3,2"/></svg>';
        }
        
        modalInner.innerHTML = 
            '<div class="member-detail-view">' +
                '<div class="detail-header">' +
                    '<div class="detail-portrait">' +
                        '<div class="daguerreotype-frame-lg">' +
                            '<div class="portrait-wrapper">' +
                                '<img src="' + getPortraitForMember(member.sigil) + '" alt="' + member.name + '" class="portrait daguerreotype">' +
                                '<div class="portrait-vignette"></div>' +
                                '<div class="portrait-scratches"></div>' +
                                '<div class="portrait-sepia"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="detail-intro">' +
                        '<div class="rank-badge ' + member.circle.toLowerCase().replace(' ', '-') + '">' + rankIcon + '<span>' + member.circle + '</span></div>' +
                        '<h2 class="detail-name">' + member.name + '</h2>' +
                        '<p class="detail-title">' + member.title + '</p>' +
                        '<div class="detail-sigil">Sigil: <span>' + member.sigil + '</span></div>' +
                    '</div>' +
                '</div>' +
                '<div class="detail-content">' +
                    '<div class="detail-section">' +
                        '<h3>Biography</h3>' +
                        '<p>' + member.biography + '</p>' +
                    '</div>' +
                    '<div class="detail-section">' +
                        '<h3>Arcane Details</h3>' +
                        '<div class="detail-grid">' +
                            '<div class="detail-item"><span class="detail-label">Specialty</span><span class="detail-value">' + member.specialty + '</span></div>' +
                            '<div class="detail-item"><span class="detail-label">Seance Attendance</span><span class="detail-value">' + member.seances + '</span></div>' +
                            '<div class="detail-item"><span class="detail-label">Chamber</span><span class="detail-value">' + member.chamber + '</span></div>' +
                            '<div class="detail-item"><span class="detail-label">Member Since</span><span class="detail-value">' + member.since + '</span></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="detail-section">' +
                        '<h3>Notable Achievements</h3>' +
                        '<ul class="achievements-list">' + achievementsHtml + '</ul>' +
                    '</div>' +
                    '<div class="detail-section">' +
                        '<h3>Standing</h3>' +
                        '<div class="standing-rating">' + starsHtml + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }
    
    function getPortraitForMember(sigil) {
        var portraits = {
            '𓂀': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
            '⚗': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face',
            '🔮': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop&crop=face',
            '♁': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face',
            '🧪': 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=400&fit=crop&crop=face',
            '✨': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face',
            '👁': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face',
            '🦅': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face'
        };
        return portraits[sigil] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face';
    }
}

// =====================================================
// WAX SEAL
// =====================================================
function initializeWaxSeal() {
    var waxSeal = document.getElementById('waxSeal');
    var envelopeFlap = document.querySelector('.envelope-flap');
    var invitationReveal = document.getElementById('invitationReveal');
    var envelopeInstruction = document.querySelector('.envelope-instruction');
    var isSealed = true;
    
    if (!waxSeal) return;
    
    waxSeal.addEventListener('click', function() {
        if (!isSealed) return;
        isSealed = false;
        
        showToast('The seal is broken...', 'The invitation reveals itself');
        
        waxSeal.style.animation = 'sealBreak 0.5s ease forwards';
        
        setTimeout(function() {
            if (envelopeFlap) {
                envelopeFlap.style.transform = 'rotateX(180deg)';
                envelopeFlap.style.transition = 'transform 0.8s ease';
            }
        }, 300);
        
        setTimeout(function() {
            waxSeal.style.opacity = '0';
            waxSeal.style.transform = 'translate(-50%, -50%) scale(0.5) rotate(180deg)';
            waxSeal.style.transition = 'all 0.5s ease';
        }, 500);
        
        setTimeout(function() {
            if (envelopeInstruction) {
                envelopeInstruction.style.opacity = '0';
            }
            if (invitationReveal) {
                invitationReveal.classList.add('visible');
            }
        }, 1200);
        
        addSealBreakStyle();
    });
    
    function addSealBreakStyle() {
        if (document.getElementById('sealBreakStyle')) return;
        var style = document.createElement('style');
        style.id = 'sealBreakStyle';
        style.textContent = '@keyframes sealBreak { 0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); } 50% { transform: translate(-50%, -50%) scale(1.2) rotate(10deg); } 100% { transform: translate(-50%, -50%) scale(0.8) rotate(20deg); opacity: 0; } }';
        document.head.appendChild(style);
    }
}

// =====================================================
// INVITATION FORM
// =====================================================
function initializeInvitationForm() {
    var form = document.getElementById('acceptanceForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(form)) return;
        
        var submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '<span>Sealing Your Fate...</span>';
        submitBtn.disabled = true;
        
        setTimeout(function() {
            submitBtn.innerHTML = '<span>Your Fate is Sealed</span><svg viewBox="0 0 24 24"><path d="M20,6 L9,17 L4,12" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
            submitBtn.style.background = 'linear-gradient(135deg, #2D4A3E 0%, #1A3028 100%)';
            submitBtn.style.borderColor = '#4A7A5A';
            showToast('Your application has been received', 'The Order will be in touch...');
            
            setTimeout(function() {
                form.reset();
                submitBtn.innerHTML = '<span>Seal My Fate</span><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3,8 L12,14 L21,8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
            }, 3000);
        }, 2000);
    });
    
    function validateForm(form) {
        var required = form.querySelectorAll('[required]');
        var isValid = true;
        
        required.forEach(function(field) {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#8B1C28';
                field.addEventListener('input', function handler() {
                    this.style.borderColor = '';
                    this.removeEventListener('input', handler);
                });
            }
        });
        
        var oathCheckbox = form.querySelector('#oathAccept');
        if (oathCheckbox && !oathCheckbox.checked) {
            isValid = false;
            showToast('You must accept the oath to proceed', 'The binding awaits your consent');
        }
        
        if (!isValid) {
            showToast('Please complete all required fields', 'The archives require completeness');
        }
        
        return isValid;
    }
}

// =====================================================
// ANIMATIONS
// =====================================================
function initializeAnimations() {
    var cards = document.querySelectorAll('.member-card');
    
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 50;
            var rotateY = (centerX - x) / 50;
            
            var cardFrame = card.querySelector('.card-frame');
            if (cardFrame) {
                cardFrame.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            var cardFrame = card.querySelector('.card-frame');
            if (cardFrame) {
                cardFrame.style.transform = '';
            }
        });
    });
    
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.circle-level, .event-card, .moon-phase').forEach(function(el) {
        observer.observe(el);
    });
    
    addAnimationStyles();
    
    var pageNums = document.querySelectorAll('.page-num');
    pageNums.forEach(function(num) {
        num.addEventListener('click', function() {
            pageNums.forEach(function(n) {
                n.classList.remove('active');
            });
            num.classList.add('active');
            
            var membersGrid = document.getElementById('membersGrid');
            if (membersGrid) {
                membersGrid.scrollIntoView({ behavior: 'smooth' });
            }
            showToast('Navigating to page ' + num.textContent, 'Turning the registry pages');
        });
    });
    
    var prevMonth = document.querySelector('.prev-month');
    var nextMonth = document.querySelector('.next-month');
    var currentMonth = document.querySelector('.current-month');
    
    var months = [
        'January — The Month of Frozen Whispers',
        'February — The Month of Candlelight',
        'March — The Month of Awakening',
        'April — The Month of Spring Terrors',
        'May — The Month of Flower Crowns',
        'June — The Month of Midsummer Madness',
        'July — The Month of Storm Chasing',
        'August — The Month of Harvest Sorrows',
        'September — The Month of Falling Leaves',
        'October — The Month of Gathering Shadows',
        'November — The Month of the Dying Sun',
        'December — The Month of Long Nights'
    ];
    
    var currentMonthIndex = 9;
    
    if (prevMonth) {
        prevMonth.addEventListener('click', function() {
            currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;
            if (currentMonth) {
                currentMonth.textContent = months[currentMonthIndex];
                currentMonth.style.opacity = '0';
                setTimeout(function() {
                    currentMonth.style.opacity = '1';
                }, 100);
            }
            showToast('Viewing ' + months[currentMonthIndex], 'Turning the calendar pages');
        });
    }
    
    if (nextMonth) {
        nextMonth.addEventListener('click', function() {
            currentMonthIndex = (currentMonthIndex + 1) % 12;
            if (currentMonth) {
                currentMonth.textContent = months[currentMonthIndex];
                currentMonth.style.opacity = '0';
                setTimeout(function() {
                    currentMonth.style.opacity = '1';
                }, 100);
            }
            showToast('Viewing ' + months[currentMonthIndex], 'Turning the calendar pages');
        });
    }
}

function addAnimationStyles() {
    if (document.getElementById('animateStyles')) return;
    
    var style = document.createElement('style');
    style.id = 'animateStyles';
    style.textContent = [
        '.circle-level, .event-card, .moon-phase { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }',
        '.circle-level.animate-in, .event-card.animate-in, .moon-phase.animate-in { opacity: 1; transform: translateY(0); }',
        '.event-card:nth-child(1) { transition-delay: 0.1s; }',
        '.event-card:nth-child(2) { transition-delay: 0.2s; }',
        '.event-card:nth-child(3) { transition-delay: 0.3s; }',
        '.event-card:nth-child(4) { transition-delay: 0.4s; }',
        '.event-card:nth-child(5) { transition-delay: 0.5s; }',
        '.moon-phase:nth-child(1) { transition-delay: 0.1s; }',
        '.moon-phase:nth-child(2) { transition-delay: 0.2s; }',
        '.moon-phase:nth-child(3) { transition-delay: 0.3s; }',
        '.moon-phase:nth-child(4) { transition-delay: 0.4s; }',
        '.moon-phase:nth-child(5) { transition-delay: 0.5s; }',
        '.member-detail-view { color: var(--color-text-primary); }',
        '.detail-header { display: flex; gap: var(--space-xl); margin-bottom: var(--space-xl); padding-bottom: var(--space-xl); border-bottom: 1px solid var(--color-gold-dark); }',
        '.detail-portrait .daguerreotype-frame-lg { padding: var(--space-lg); background: linear-gradient(135deg, var(--color-gold-dark) 0%, var(--color-gold) 50%, var(--color-gold-dark) 100%); border-radius: var(--radius-md); }',
        '.detail-portrait .portrait-wrapper { width: 180px; height: 220px; overflow: hidden; border-radius: var(--radius-sm); background: var(--color-sepia); }',
        '.detail-portrait .portrait-wrapper img { width: 100%; height: 100%; object-fit: cover; filter: sepia(80%) contrast(1.1) brightness(0.9) saturate(70%); }',
        '.detail-intro { flex: 1; display: flex; flex-direction: column; justify-content: center; }',
        '.detail-name { font-family: var(--font-heading); font-size: 2rem; color: var(--color-gold-light); margin: var(--space-md) 0 var(--space-xs); }',
        '.detail-title { font-family: var(--font-body); font-size: 1.2rem; font-style: italic; color: var(--color-text-secondary); margin-bottom: var(--space-md); }',
        '.detail-sigil { font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-text-muted); }',
        '.detail-sigil span { color: var(--color-gold-light); font-size: 1.5rem; margin-left: var(--space-sm); }',
        '.detail-content { display: flex; flex-direction: column; gap: var(--space-xl); }',
        '.detail-section h3 { font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-gold); letter-spacing: 1px; margin-bottom: var(--space-md); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--color-gold-dark); }',
        '.detail-section p { font-family: var(--font-body); font-size: 1rem; line-height: 1.8; color: var(--color-text-secondary); }',
        '.detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); }',
        '.detail-item { padding: var(--space-md); background: var(--color-shadow-deep); border-radius: var(--radius-sm); border-left: 3px solid var(--color-gold-dark); }',
        '.detail-item .detail-label { display: block; font-family: var(--font-heading); font-size: 0.75rem; color: var(--color-text-muted); letter-spacing: 1px; margin-bottom: var(--space-xs); }',
        '.detail-item .detail-value { font-family: var(--font-body); font-size: 1rem; color: var(--color-gold-light); }',
        '.achievements-list { list-style: none; display: grid; gap: var(--space-sm); }',
        '.achievements-list li { font-family: var(--font-body); font-size: 0.95rem; color: var(--color-text-secondary); padding: var(--space-sm) 0; border-bottom: 1px dotted var(--color-gold-dark); }',
        '.achievements-list li:last-child { border-bottom: none; }',
        '.standing-rating { display: flex; gap: var(--space-xs); }',
        '.rating-star { font-size: 1.5rem; color: var(--color-gold-dark); transition: color 0.3s ease; }',
        '.rating-star.filled { color: var(--color-gold-light); text-shadow: 0 0 10px rgba(212, 165, 116, 0.5); }',
        '.current-month { transition: opacity 0.3s ease; }',
        '@media (max-width: 600px) { .detail-header { flex-direction: column; align-items: center; text-align: center; } }'
    ].join(' ');
    
    document.head.appendChild(style);
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================
function showToast(message, subtitle, type) {
    if (typeof subtitle === 'undefined') subtitle = '';
    if (typeof type === 'undefined') type = 'info';
    
    var container = document.getElementById('toastContainer');
    if (!container) return;
    
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    
    var icons = {
        info: '📜',
        success: '✓',
        error: '✗',
        warning: '⚠'
    };
    
    var toastContent = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>';
    toastContent += '<div class="toast-content"><span class="toast-message">' + message + '</span>';
    if (subtitle) {
        toastContent += '<span class="toast-subtitle">' + subtitle + '</span>';
    }
    toastContent += '</div>';
    
    toast.innerHTML = toastContent;
    container.appendChild(toast);
    
    setTimeout(function() {
        if (toast.parentNode) toast.remove();
    }, 3000);
    
    toast.addEventListener('click', function() {
        if (toast.parentNode) toast.remove();
    });
}

// =====================================================
// CONSOLE MESSAGE
// =====================================================
console.log('%c ✧ ORDO VELUM RUBRUM ✧ ', 'background: #4A1219; color: #D4A574; font-size: 20px; font-family: serif; padding: 10px 20px; border-radius: 5px;');
console.log('%cThe archives are open to those who know where to look...', 'color: #8B7355; font-style: italic;');