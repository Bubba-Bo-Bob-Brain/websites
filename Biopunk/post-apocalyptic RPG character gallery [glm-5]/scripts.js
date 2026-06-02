document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const characterCards = document.querySelectorAll('.character-card');
    const accessButtons = document.querySelectorAll('.access-btn');
    const modal = document.getElementById('characterModal');
    const modalClose = document.querySelector('.modal-close');

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const faction = this.getAttribute('data-faction');

            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            characterCards.forEach(function(card) {
                const cardFaction = card.getAttribute('data-faction');

                if (faction === 'all' || cardFaction === faction) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'card-appear 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    const styleSheet = document.createElement('style');
    styleSheet.textContent = '@keyframes card-appear { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(styleSheet);

    accessButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const card = this.closest('.character-card');
            openModal(card);
        });
    });

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal(card) {
        const name = card.querySelector('.character-name').textContent;
        const title = card.querySelector('.character-title').textContent;
        const factionBadge = card.querySelector('.faction-badge').outerHTML;
        const desc = card.querySelector('.character-desc').innerHTML;
        const traits = card.querySelector('.mutation-traits').innerHTML;
        const portraitImg = card.querySelector('.portrait-frame img').outerHTML;
        const mutationValue = card.querySelector('.meter-value').textContent;
        const mutationFill = card.querySelector('.meter-fill').classList;
        const viralLoad = card.querySelector('.stat-row:first-child .stat-value').textContent;
        const dnaStability = card.querySelector('.stat-row:last-child .stat-value').textContent;
        const viralFill = card.querySelector('.stat-row:first-child .stat-fill').classList;
        const stabilityFill = card.querySelector('.stat-row:last-child .stat-fill').classList;

        const modalPortrait = modal.querySelector('.modal-portrait');
        modalPortrait.innerHTML = '<div class="portrait-frame">' + portraitImg + '<div class="portrait-scan"></div></div>';

        const modalInfo = modal.querySelector('.modal-info');
        modalInfo.innerHTML = '\n            <h2 class="modal-name">' + name + '</h2>\n            <p class="modal-title">' + title + '</p>\n            <div class="modal-faction">' + factionBadge + '</div>\n        ';

        const modalDesc = modal.querySelector('.modal-desc');
        modalDesc.innerHTML = '\n            <p>' + desc.querySelector('p').textContent + '</p>\n            <div class="contamination-stats" style="margin-top: 20px;">\n                <div class="stat-row">\n                    <span class="stat-label">VIRAL LOAD</span>\n                    <div class="stat-bar">\n                        <div class="' + getFillClass(viralFill) + '" style="--width: ' + viralLoad.replace('%', '') + '%"></div>\n                    </div>\n                    <span class="stat-value">' + viralLoad + '</span>\n                </div>\n                <div class="stat-row">\n                    <span class="stat-label">DNA STABILITY</span>\n                    <div class="stat-bar">\n                        <div class="' + getFillClass(stabilityFill) + '" style="--width: ' + dnaStability.replace('%', '') + '%"></div>\n                    </div>\n                    <span class="stat-value">' + dnaStability + '</span>\n                </div>\n            </div>\n        ';

        const modalTraits = modal.querySelector('.modal-traits');
        modalTraits.innerHTML = traits;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        animateModalContent();
    }

    function getFillClass(classList) {
        const classes = Array.from(classList);
        return classes.filter(function(c) { return c !== 'stat-fill'; }).map(function(c) { return 'stat-fill ' + c; }).join(' ') || 'stat-fill';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function animateModalContent() {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'none';
        modalContent.offsetHeight;
        modalContent.style.animation = 'modal-appear 0.3s ease';
    }

    const modalStyle = document.createElement('style');
    modalStyle.textContent = '@keyframes modal-appear { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }';
    document.head.appendChild(modalStyle);

    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(function(text) {
        text.addEventListener('mouseenter', function() {
            this.classList.add('glitch-active');
            const element = this;
            setTimeout(function() {
                element.classList.remove('glitch-active');
            }, 500);
        });
    });

    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = '\n        .glitch-text.glitch-active {\n            animation: text-glitch 0.3s ease;\n        }\n        @keyframes text-glitch {\n            0%, 100% { transform: translate(0); }\n            20% { transform: translate(-3px, 1px); }\n            40% { transform: translate(3px, -1px); }\n            60% { transform: translate(-2px, -1px); }\n            80% { transform: translate(2px, 1px); }\n        }\n    ';
    document.head.appendChild(glitchStyle);

    function updateTimestamp() {
        const now = new Date();
        const year = 2847;
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timestamps = document.querySelectorAll('.footer-text');
        timestamps.forEach(function(ts) {
            if (ts.textContent.includes('SYSTEM TIME')) {
                ts.textContent = 'SYSTEM TIME: ' + year + '.' + month + '.' + day + ' ' + hours + ':' + minutes + ':' + seconds;
            }
        });
    }

    const radarFills = document.querySelectorAll('.radar-fill');
    radarFills.forEach(function(fill) {
        animateRadar(fill);
    });

    function animateRadar(element) {
        const originalPoints = element.getAttribute('points');
        let iteration = 0;

        setInterval(function() {
            iteration++;
            if (iteration % 2 === 0) {
                element.setAttribute('points', originalPoints);
            } else {
                const points = originalPoints.split(' ').map(function(point) {
                    const coords = point.split(',');
                    const x = parseFloat(coords[0]) + (Math.random() - 0.5) * 3;
                    const y = parseFloat(coords[1]) + (Math.random() - 0.5) * 3;
                    return x.toFixed(1) + ',' + y.toFixed(1);
                }).join(' ');
                element.setAttribute('points', points);
            }
        }, 2000);
    }

    const meterFills = document.querySelectorAll('.meter-fill');
    meterFills.forEach(function(fill) {
        const width = fill.style.getPropertyValue('--fill-width');
        fill.style.width = '0%';

        setTimeout(function() {
            fill.style.width = width;
        }, 100);
    });

    const statFills = document.querySelectorAll('.stat-fill');
    statFills.forEach(function(fill) {
        const width = fill.style.getPropertyValue('--width');
        fill.style.width = '0%';

        setTimeout(function() {
            fill.style.width = width;
        }, 100);
    });

    const cards = document.querySelectorAll('.character-card');
    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(function() {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });

    const cornerStyle = document.createElement('style');
    cornerStyle.textContent = '\n        .character-card:hover .frame-corner {\n            animation: corner-pulse 1s ease infinite;\n        }\n        @keyframes corner-pulse {\n            0%, 100% { border-color: var(--terminal-green-dim); }\n            50% { border-color: var(--terminal-green); }\n        }\n        .character-card[data-faction="neogen"]:hover .frame-corner {\n            animation-name: corner-pulse-cyan;\n        }\n        @keyframes corner-pulse-cyan {\n            0%, 100% { border-color: rgba(0, 255, 204, 0.5); }\n            50% { border-color: var(--toxic-cyan); }\n        }\n        .character-card[data-faction="scavengers"]:hover .frame-corner {\n            animation-name: corner-pulse-orange;\n        }\n        @keyframes corner-pulse-orange {\n            0%, 100% { border-color: rgba(255, 107, 0, 0.5); }\n            50% { border-color: var(--warning-orange); }\n        }\n        .character-card[data-faction="mycelium"]:hover .frame-corner {\n            animation-name: corner-pulse-magenta;\n        }\n        @keyframes corner-pulse-magenta {\n            0%, 100% { border-color: rgba(255, 0, 255, 0.5); }\n            50% { border-color: var(--bio-magenta); }\n        }\n        .character-card[data-faction="rogue"]:hover .frame-corner {\n            animation-name: corner-pulse-red;\n        }\n        @keyframes corner-pulse-red {\n            0%, 100% { border-color: rgba(255, 0, 64, 0.5); }\n            50% { border-color: var(--danger-red); }\n        }\n    ';
    document.head.appendChild(cornerStyle);

    const headerGlitch = document.querySelector('.header-glitch');
    let glitchInterval;

    function triggerHeaderGlitch() {
        headerGlitch.classList.add('glitch-active');
        setTimeout(function() {
            headerGlitch.classList.remove('glitch-active');
        }, 200);
    }

    glitchInterval = setInterval(triggerHeaderGlitch, 5000);

    const headerGlitchStyle = document.createElement('style');
    headerGlitchStyle.textContent = '\n        .header-glitch.glitch-active {\n            animation: header-glitch-anim 0.2s ease;\n        }\n        @keyframes header-glitch-anim {\n            0%, 100% { text-shadow: var(--glow-green); }\n            25% { text-shadow: -3px 0 var(--toxic-cyan), 3px 0 var(--bio-magenta); }\n            50% { text-shadow: 3px 0 var(--toxic-cyan), -3px 0 var(--bio-magenta); }\n            75% { text-shadow: 0 3px var(--toxic-cyan), 0 -3px var(--bio-magenta); }\n        }\n    ';
    document.head.appendChild(headerGlitchStyle);

    const terminalFooter = document.querySelector('.terminal-footer');
    if (terminalFooter) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'footer-version';
        statusDiv.innerHTML = '<span class="blink">●</span> TERMINAL ACTIVE — BROADCASTING ON SECURE FREQUENCY — <span id="systemTime">2847.' + String(new Date().getMonth() + 1).padStart(2, '0') + '.' + String(new Date().getDate()).padStart(2, '0') + '</span>';
        terminalFooter.appendChild(statusDiv);
    }

    function updateSystemTime() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timeElement = document.getElementById('systemTime');
        if (timeElement) {
            timeElement.textContent = '2847.' + month + '.' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        }
    }

    setInterval(updateSystemTime, 1000);

    const buttons = document.querySelectorAll('.filter-btn, .access-btn, .modal-close');
    buttons.forEach(function(button) {
        button.addEventListener('mouseenter', function() {
            playHoverSound();
        });
    });

    function playHoverSound() {
        return;
    }

    const traitTags = document.querySelectorAll('.trait-tag');
    traitTags.forEach(function(tag) {
        tag.addEventListener('click', function() {
            this.style.animation = 'none';
            this.offsetHeight;
            this.style.animation = 'tag-flash 0.3s ease';
        });
    });

    const tagStyle = document.createElement('style');
    tagStyle.textContent = '\n        @keyframes tag-flash {\n            0% { background: var(--bg-primary); }\n            50% { background: rgba(57, 255, 20, 0.3); }\n            100% { background: var(--bg-primary); }\n        }\n    ';
    document.head.appendChild(tagStyle);

    console.log('%cGENE-VAULT TERMINAL INITIALIZED', 'color: #39ff14; font-family: monospace; font-size: 14px; text-shadow: 0 0 10px #39ff14;');
    console.log('%c⚠ BIOLOGICAL CONTAINMENT PROTOCOLS ACTIVE', 'color: #ff6b00; font-family: monospace;');
    console.log('%c[6 SUBJECTS LOADED] [SCANNING COMPLETE]', 'color: #00ffcc; font-family: monospace;');
});