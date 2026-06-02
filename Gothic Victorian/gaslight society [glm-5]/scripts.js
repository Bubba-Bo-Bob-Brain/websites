document.addEventListener('DOMContentLoaded', function() {
    initGrandfatherClock();
    initMemberCards();
    initFilterButtons();
    initSearch();
    initEnvelopeReveal();
    initCircleNavigation();
    initAmbientEnhancements();
});

function initGrandfatherClock() {
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');
    const chimeTime = document.querySelector('.chime-time');

    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const secondDegrees = (seconds / 60) * 360;
        const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
        const hourDegrees = ((hours + minutes / 60) / 12) * 360;

        if (secondHand) {
            secondHand.style.transform = 'translate(-50%, -100%) rotate(' + secondDegrees + 'deg)';
        }
        if (minuteHand) {
            minuteHand.style.transform = 'translate(-50%, -100%) rotate(' + minuteDegrees + 'deg)';
        }
        if (hourHand) {
            hourHand.style.transform = 'translate(-50%, -100%) rotate(' + hourDegrees + 'deg)';
        }

        if (minutes === 0 && seconds < 2) {
            triggerChime(hours || 12);
        }
    }

    function triggerChime(count) {
        if (chimeTime) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            chimeTime.textContent = timeString;
            chimeTime.style.color = '#d4a574';
            setTimeout(function() {
                chimeTime.style.color = '';
            }, 5000);
        }

        const clockCase = document.querySelector('.clock-case');
        if (clockCase) {
            clockCase.style.boxShadow = '0 0 40px rgba(205, 127, 50, 0.5), 0 0 80px rgba(205, 127, 50, 0.3)';
            setTimeout(function() {
                clockCase.style.boxShadow = '';
            }, 3000);
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

function initMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');

    memberCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const portrait = this.querySelector('.portrait-image');
            if (portrait) {
                portrait.style.transform = 'scale(1.05)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const portrait = this.querySelector('.portrait-image');
            if (portrait) {
                portrait.style.transform = '';
            }
        });

        card.addEventListener('click', function() {
            showMemberDetails(this.cloneNode(true));
        });
    });
}

function showMemberDetails(cardClone) {
    const existingModal = document.querySelector('.member-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'member-modal';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.appendChild(cardClone);

    modal.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);

    setTimeout(function() {
        modal.classList.add('visible');
    }, 10);

    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            modal.classList.remove('visible');
            setTimeout(function() {
                modal.remove();
            }, 400);
        }
    });
}

function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const memberCards = document.querySelectorAll('.member-card');

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            const filter = this.dataset.filter;

            memberCards.forEach(function(card) {
                const specialization = card.dataset.specialization;
                if (filter === 'all' || specialization === filter) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.pointerEvents = 'auto';
                    card.style.display = '';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    card.style.pointerEvents = 'none';
                    setTimeout(function() {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

function initSearch() {
    const searchInput = document.querySelector('.member-search');
    const memberCards = document.querySelectorAll('.member-card');

    if (!searchInput) return;

    let searchTimeout = null;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.toLowerCase().trim();

        searchTimeout = setTimeout(function() {
            memberCards.forEach(function(card) {
                const name = card.querySelector('.member-name');
                const title = card.querySelector('.member-title');
                const bio = card.querySelector('.member-bio');
                const spec = card.querySelector('.specialization-text');

                const nameText = name ? name.textContent.toLowerCase() : '';
                const titleText = title ? title.textContent.toLowerCase() : '';
                const bioText = bio ? bio.textContent.toLowerCase() : '';
                const specText = spec ? spec.textContent.toLowerCase() : '';

                const matches = nameText.includes(query) || titleText.includes(query) || bioText.includes(query) || specText.includes(query);

                if (query === '' || matches) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.pointerEvents = 'auto';
                } else {
                    card.style.opacity = '0.3';
                    card.style.transform = 'scale(0.95)';
                    card.style.pointerEvents = 'none';
                }
            });
        }, 200);
    });
}

function initEnvelopeReveal() {
    const envelope = document.getElementById('envelope');
    const invitation = document.getElementById('invitation');

    if (!envelope || !invitation) return;

    let isOpen = false;

    envelope.addEventListener('click', function() {
        if (!isOpen) {
            envelope.classList.add('open');
            setTimeout(function() {
                invitation.classList.add('visible');
            }, 600);
            isOpen = true;
        } else {
            invitation.classList.remove('visible');
            setTimeout(function() {
                envelope.classList.remove('open');
            }, 400);
            isOpen = false;
        }
    });

    const envelopeSeal = envelope.querySelector('.envelope-seal');
    if (envelopeSeal) {
        envelopeSeal.addEventListener('click', function(e) {
            e.stopPropagation();
            envelope.click();
        });
    }
}

function initCircleNavigation() {
    const circleItems = document.querySelectorAll('.circle-item');
    const directoryTitle = document.querySelector('.directory-title');

    circleItems.forEach(function(item) {
        if (item.classList.contains('locked')) {
            item.addEventListener('click', function() {
                this.style.animation = 'shake 0.5s ease';
                const lockIcon = this.querySelector('.lock-icon');
                if (lockIcon) {
                    lockIcon.style.transform = 'scale(1.3)';
                    setTimeout(function() {
                        item.style.animation = '';
                        if (lockIcon) lockIcon.style.transform = '';
                    }, 500);
                }
                showSecretMessage('This circle remains sealed to the uninitiated.');
            });
        } else {
            item.addEventListener('click', function() {
                circleItems.forEach(function(i) {
                    i.classList.remove('active');
                });
                this.classList.add('active');

                const circleName = this.querySelector('.circle-name');
                if (directoryTitle && circleName) {
                    directoryTitle.style.opacity = '0';
                    setTimeout(function() {
                        directoryTitle.textContent = circleName.textContent;
                        directoryTitle.style.opacity = '1';
                    }, 300);
                }

                const cards = document.querySelectorAll('.member-card');
                cards.forEach(function(card, index) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(function() {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100 + index * 80);
                });
            });
        }
    });
}

function showSecretMessage(message) {
    const existingMessage = document.querySelector('.secret-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageEl = document.createElement('div');
    messageEl.className = 'secret-message';
    messageEl.textContent = message;

    messageEl.style.position = 'fixed';
    messageEl.style.top = '50%';
    messageEl.style.left = '50%';
    messageEl.style.transform = 'translate(-50%, -50%)';
    messageEl.style.background = 'linear-gradient(145deg, rgba(74, 28, 43, 0.98), rgba(26, 15, 10, 0.98))';
    messageEl.style.border = '1px solid #8a3a55';
    messageEl.style.padding = '30px 50px';
    messageEl.style.fontFamily = "'Cinzel Decorative', serif";
    messageEl.style.fontSize = '1rem';
    messageEl.style.color = '#e8c49a';
    messageEl.style.textAlign = 'center';
    messageEl.style.zIndex = '10000';
    messageEl.style.boxShadow = '0 0 50px rgba(26, 15, 10, 0.8), 0 0 100px rgba(212, 165, 116, 0.2)';
    messageEl.style.letterSpacing = '2px';
    messageEl.style.opacity = '0';
    messageEl.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(messageEl);

    setTimeout(function() {
        messageEl.style.opacity = '1';
    }, 10);

    setTimeout(function() {
        messageEl.style.opacity = '0';
        setTimeout(function() {
            messageEl.remove();
        }, 300);
    }, 3000);
}

function initAmbientEnhancements() {
    const modalStyle = document.createElement('style');
    modalStyle.textContent = 
        '.member-modal {' +
            'position: fixed;' +
            'top: 0;' +
            'left: 0;' +
            'width: 100%;' +
            'height: 100%;' +
            'background: rgba(26, 15, 10, 0.95);' +
            'display: flex;' +
            'justify-content: center;' +
            'align-items: center;' +
            'z-index: 10000;' +
            'opacity: 0;' +
            'transition: opacity 0.4s ease;' +
        '}' +
        '.member-modal.visible {' +
            'opacity: 1;' +
        '}' +
        '.modal-content {' +
            'transform: scale(0.8);' +
            'transition: transform 0.4s ease;' +
        '}' +
        '.member-modal.visible .modal-content {' +
            'transform: scale(1);' +
        '}' +
        '.modal-close {' +
            'position: absolute;' +
            'top: 30px;' +
            'right: 30px;' +
            'font-size: 2.5rem;' +
            'color: #d4a574;' +
            'cursor: pointer;' +
            'font-family: serif;' +
            'transition: transform 0.3s ease, color 0.3s ease;' +
            'z-index: 10001;' +
        '}' +
        '.modal-close:hover {' +
            'transform: rotate(90deg);' +
            'color: #e8c49a;' +
        '}' +
        '@keyframes shake {' +
            '0%, 100% { transform: translateX(0); }' +
            '20% { transform: translateX(-5px); }' +
            '40% { transform: translateX(5px); }' +
            '60% { transform: translateX(-5px); }' +
            '80% { transform: translateX(5px); }' +
        '}';
    document.head.appendChild(modalStyle);

    const directoryTitle = document.querySelector('.directory-title');
    if (directoryTitle) {
        directoryTitle.style.transition = 'opacity 0.3s ease';
    }

    initScheduleCountdown();
    initDustParticles();
}

function initScheduleCountdown() {
    const scheduleItems = document.querySelectorAll('.schedule-item');

    scheduleItems.forEach(function(item) {
        const dateDay = item.querySelector('.date-day');
        const dateMonth = item.querySelector('.date-month');

        if (!dateDay || !dateMonth) return;

        const day = parseInt(dateDay.textContent, 10);
        const monthText = dateMonth.textContent;

        const monthMap = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
            'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7,
            'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };

        const month = monthMap[monthText];
        if (month === undefined) return;

        const now = new Date();
        const eventYear = now.getFullYear();
        const eventDate = new Date(eventYear, month, day, 22, 0, 0);

        if (eventDate < now) {
            eventDate.setFullYear(eventYear + 1);
        }

        const daysUntil = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntil <= 7 && daysUntil > 0) {
            const badge = document.createElement('span');
            badge.className = 'days-until-badge';
            badge.textContent = daysUntil === 1 ? 'Tomorrow' : daysUntil + ' days';
            badge.style.display = 'block';
            badge.style.fontSize = '0.7rem';
            badge.style.color = '#e8c49a';
            badge.style.marginTop = '5px';
            badge.style.fontStyle = 'italic';

            const dateEl = item.querySelector('.schedule-date');
            if (dateEl) {
                dateEl.appendChild(badge);
            }

            if (daysUntil <= 3) {
                item.style.borderColor = '#b8860b';
                item.style.boxShadow = '0 0 20px rgba(184, 134, 11, 0.3)';
            }
        }
    });
}

function initDustParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'dust-particles';
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '998';
    particleContainer.style.overflow = 'hidden';

    document.body.appendChild(particleContainer);

    const dustStyle = document.createElement('style');
    dustStyle.textContent = 
        '@keyframes dustFloat {' +
            '0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }' +
            '10% { opacity: 1; }' +
            '90% { opacity: 1; }' +
            '100% { transform: translate(50px, -100vh) rotate(360deg); opacity: 0; }' +
        '}';
    document.head.appendChild(dustStyle);

    for (let i = 0; i < 15; i++) {
        createDustParticle(particleContainer);
    }
}

function createDustParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 10;

    particle.style.position = 'absolute';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.background = 'rgba(212, 165, 116, ' + (Math.random() * 0.2 + 0.1) + ')';
    particle.style.borderRadius = '50%';
    particle.style.left = startX + '%';
    particle.style.top = startY + '%';
    particle.style.animation = 'dustFloat ' + duration + 's linear ' + delay + 's infinite';

    container.appendChild(particle);
}