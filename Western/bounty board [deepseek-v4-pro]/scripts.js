(function() {
    var saloonDoors = document.getElementById('saloonDoors');
    var mainContent = document.getElementById('mainContent');
    var cylinderFaces = document.querySelectorAll('.cylinder-face');
    var cylinderNotch = document.getElementById('cylinderNotch');
    var contentPanels = document.querySelectorAll('.content-panel');
    var tumbleweed = document.getElementById('tumbleweed');
    var dustOverlay = document.getElementById('dustOverlay');
    var currentDateEl = document.getElementById('currentDate');

    var panelMap = {
        'bounty-board': document.getElementById('bountyBoardPanel'),
        'outlaw-profiles': document.getElementById('outlawProfilesPanel'),
        'dispatch-log': document.getElementById('dispatchLogPanel'),
        'reward-tiers': document.getElementById('rewardTiersPanel')
    };

    function setCurrentDate() {
        var now = new Date();
        var months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        var yearOffset = 1885 - 2024;
        var displayYear = now.getFullYear() + yearOffset;
        var dateString = months[now.getMonth()] + ' ' + now.getDate() + ', ' + displayYear;
        if (currentDateEl) {
            currentDateEl.textContent = dateString;
        }
    }

    function openSaloonDoors() {
        setTimeout(function() {
            saloonDoors.classList.add('open');
            setTimeout(function() {
                mainContent.classList.add('visible');
            }, 400);
        }, 600);
    }

    function createDustParticles() {
        var particleCount = 35;
        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('div');
            particle.classList.add('dust-particle');
            var size = Math.random() * 4 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = -(Math.random() * 30 + 5) + 'px';
            particle.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
            particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
            particle.style.animationDelay = (Math.random() * 15) + 's';
            dustOverlay.appendChild(particle);
        }
    }

    function resetTumbleweed() {
        tumbleweed.style.animation = 'none';
        tumbleweed.offsetHeight;
        tumbleweed.style.animation = 'tumbleweedRoll 18s linear infinite';
    }

    tumbleweed.addEventListener('animationiteration', function() {
        var randomDuration = Math.random() * 10 + 14;
        tumbleweed.style.animationDuration = randomDuration + 's';
    });

    function activatePanel(sectionName) {
        Object.keys(panelMap).forEach(function(key) {
            panelMap[key].classList.remove('active-panel');
        });
        if (panelMap[sectionName]) {
            panelMap[sectionName].classList.add('active-panel');
        }
    }

    function updateCylinderNotch(activeFace) {
        if (!activeFace) return;
        var containerRect = document.getElementById('cylinderContainer').getBoundingClientRect();
        var faceRect = activeFace.getBoundingClientRect();
        var notchLeft = faceRect.left + faceRect.width / 2 - containerRect.left;
        cylinderNotch.style.left = notchLeft + 'px';
    }

    cylinderFaces.forEach(function(face) {
        face.addEventListener('click', function() {
            cylinderFaces.forEach(function(f) {
                f.classList.remove('active');
            });
            face.classList.add('active');
            var section = face.getAttribute('data-section');
            activatePanel(section);
            updateCylinderNotch(face);

            var poster = face.closest('.wanted-poster');
            if (poster) {
                poster.style.transform = 'rotate(0deg) scale(1.05) translateY(-8px)';
                setTimeout(function() {
                    poster.style.transform = '';
                }, 300);
            }
        });
    });

    var wantedPosters = document.querySelectorAll('.wanted-poster');
    wantedPosters.forEach(function(poster) {
        poster.addEventListener('click', function() {
            var outlawName = poster.getAttribute('data-outlaw');
            cylinderFaces.forEach(function(face) {
                face.classList.remove('active');
                if (face.getAttribute('data-section') === 'outlaw-profiles') {
                    face.classList.add('active');
                    updateCylinderNotch(face);
                }
            });
            activatePanel('outlaw-profiles');

            var profileCards = document.querySelectorAll('.profile-card');
            profileCards.forEach(function(card) {
                card.style.boxShadow = '';
                card.style.transform = '';
            });

            var targetProfile = document.querySelector('.profile-card[data-outlaw="' + outlawName + '"]');
            if (targetProfile) {
                targetProfile.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetProfile.style.boxShadow = '0 0 40px rgba(196, 155, 42, 0.8), 0 8px 25px rgba(0, 0, 0, 0.5)';
                targetProfile.style.transform = 'scale(1.03)';
                setTimeout(function() {
                    targetProfile.style.transform = '';
                    targetProfile.style.boxShadow = '';
                }, 2000);
            }
        });
    });

    var dispatchEntries = document.querySelectorAll('.dispatch-entry');
    dispatchEntries.forEach(function(entry, index) {
        entry.style.opacity = '0';
        entry.style.transform = 'translateX(-20px)';
        entry.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        entry.style.transitionDelay = (index * 0.1) + 's';
    });

    var dispatchPanel = document.getElementById('dispatchLogPanel');
    var dispatchObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('active-panel')) {
                dispatchEntries.forEach(function(entry, index) {
                    setTimeout(function() {
                        entry.style.opacity = '1';
                        entry.style.transform = 'translateX(0)';
                    }, index * 120);
                });
            }
        });
    });

    dispatchObserver.observe(dispatchPanel, { attributes: true, attributeFilter: ['class'] });

    var tierCards = document.querySelectorAll('.tier-card');
    tierCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            var badge = card.querySelector('.tier-badge');
            if (badge) {
                badge.style.animation = 'none';
                badge.offsetHeight;
                badge.style.animation = 'starPulse 0.8s ease-in-out 3';
            }
        });
    });

    var profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var outlawData = card.getAttribute('data-outlaw');
            cylinderFaces.forEach(function(face) {
                face.classList.remove('active');
                if (face.getAttribute('data-section') === 'bounty-board') {
                    face.classList.add('active');
                    updateCylinderNotch(face);
                }
            });
            activatePanel('bounty-board');

            var matchingPoster = document.querySelector('.wanted-poster[data-outlaw="' + outlawData + '"]');
            if (matchingPoster) {
                matchingPoster.scrollIntoView({ behavior: 'smooth', block: 'center' });
                matchingPoster.style.boxShadow = '0 0 50px rgba(196, 155, 42, 0.9), 0 20px 45px rgba(0, 0, 0, 0.5)';
                matchingPoster.style.transform = 'rotate(0deg) scale(1.08) translateY(-10px)';
                matchingPoster.style.zIndex = '20';
                setTimeout(function() {
                    matchingPoster.style.boxShadow = '';
                    matchingPoster.style.transform = '';
                    matchingPoster.style.zIndex = '';
                }, 2500);
            }
        });
    });

    var headerStars = document.querySelectorAll('.star-badge');
    headerStars.forEach(function(star, index) {
        star.addEventListener('mouseenter', function() {
            star.style.transform = 'scale(1.3) rotate(' + (index === 0 ? '-20deg' : '20deg') + ')';
            star.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        });
        star.addEventListener('mouseleave', function() {
            star.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    document.addEventListener('keydown', function(event) {
        var activeFace = document.querySelector('.cylinder-face.active');
        if (!activeFace) return;
        var facesArray = Array.from(cylinderFaces);
        var currentIndex = facesArray.indexOf(activeFace);

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            var nextIndex = (currentIndex + 1) % facesArray.length;
            facesArray[nextIndex].click();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            var prevIndex = (currentIndex - 1 + facesArray.length) % facesArray.length;
            facesArray[prevIndex].click();
        }
    });

    setCurrentDate();
    createDustParticles();
    openSaloonDoors();
    resetTumbleweed();

    var initialActiveFace = document.querySelector('.cylinder-face.active');
    if (initialActiveFace) {
        updateCylinderNotch(initialActiveFace);
    }

    window.addEventListener('resize', function() {
        var currentActive = document.querySelector('.cylinder-face.active');
        if (currentActive) {
            updateCylinderNotch(currentActive);
        }
    });

    var posterPins = document.querySelectorAll('.poster-pin');
    posterPins.forEach(function(pin) {
        pin.addEventListener('click', function(event) {
            event.stopPropagation();
            var poster = pin.closest('.wanted-poster');
            if (poster) {
                poster.style.transform = 'rotate(' + (Math.random() * 10 - 5) + 'deg) scale(1.02)';
                poster.style.transition = 'transform 0.1s ease';
                setTimeout(function() {
                    poster.style.transform = '';
                    poster.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 100);
            }
        });
    });

    console.log('🤠 Dust Creek Sheriff Office - Bounty Board ready, partner.');
    console.log('Use arrow keys to navigate sections, or click on posters and profiles.');
})();