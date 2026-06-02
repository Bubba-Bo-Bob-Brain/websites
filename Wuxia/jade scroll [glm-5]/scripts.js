document.addEventListener('DOMContentLoaded', function() {
    initScrollObserver();
    initSealNavigation();
    initRealmNodes();
    initTechniqueCards();
    initMeridianDiagram();
    initSkillTree();
    initParallax();
    initQiParticles();
});

function initScrollObserver() {
    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var target = entry.target;
                if (target.classList.contains('realm-node')) {
                    target.classList.add('visible');
                }
                if (target.classList.contains('technique-card')) {
                    target.classList.add('visible');
                }
                if (target.classList.contains('meridian-line')) {
                    target.classList.add('visible');
                }
                if (target.classList.contains('skill-branch')) {
                    target.classList.add('visible');
                }
                if (target.classList.contains('meridian-label')) {
                    target.classList.add('visible');
                }
            }
        });
    }, observerOptions);

    var realmNodes = document.querySelectorAll('.realm-node');
    realmNodes.forEach(function(node, index) {
        node.style.transitionDelay = (index * 0.15) + 's';
        revealObserver.observe(node);
    });

    var techniqueCards = document.querySelectorAll('.technique-card');
    techniqueCards.forEach(function(card, index) {
        card.style.transitionDelay = (index * 0.1) + 's';
        revealObserver.observe(card);
    });

    var meridianLines = document.querySelectorAll('.meridian-line');
    meridianLines.forEach(function(line, index) {
        line.style.animationDelay = (index * 0.2) + 's';
        revealObserver.observe(line);
    });

    var skillBranches = document.querySelectorAll('.skill-branch');
    skillBranches.forEach(function(branch, index) {
        branch.style.animationDelay = (index * 0.1) + 's';
        revealObserver.observe(branch);
    });

    var meridianLabels = document.querySelectorAll('.meridian-label');
    meridianLabels.forEach(function(label, index) {
        label.style.transitionDelay = (1 + index * 0.2) + 's';
        revealObserver.observe(label);
    });
}

function initSealNavigation() {
    var navItems = document.querySelectorAll('.seal-nav-item');
    var sections = ['intro', 'cultivation', 'techniques', 'meridians', 'skilltree'];

    var sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var sectionId = entry.target.id || 'intro';
                navItems.forEach(function(item) {
                    if (item.dataset.target === sectionId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0
    });

    var allSections = document.querySelectorAll('section, .scroll-header');
    allSections.forEach(function(section) {
        sectionObserver.observe(section);
    });

    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var targetId = this.dataset.target;
            var targetElement;

            if (targetId === 'intro') {
                targetElement = document.querySelector('.scroll-header');
            } else {
                targetElement = document.getElementById(targetId);
            }

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
}

function initRealmNodes() {
    var realmNodes = document.querySelectorAll('.realm-node');

    var realmData = {
        mortal: {
            name: '凡人境',
            description: 'The foundation of all cultivation. Train the physical body, strengthen the bones, and temper the will through hardship.'
        },
        foundation: {
            name: '筑基境',
            description: 'Build the dao foundation within. Begin to sense spiritual energy and open the meridians for qi flow.'
        },
        core: {
            name: '金丹境',
            description: 'Condense all gathered qi into a golden core. This core becomes the wellspring of martial power.'
        },
        nascent: {
            name: '元婴境',
            description: 'The soul takes form within the core. Transcend mortal limits and gain longevity beyond common men.'
        },
        immortal: {
            name: '飞升境',
            description: 'Break through the heavens barrier. Shed the mortal shell and ascend to become a true immortal.'
        }
    };

    var originalDesc = {
        mortal: 'The foundation. Train the body, temper the will.',
        foundation: 'Build the dao foundation. Sense spiritual energy.',
        core: 'Condense qi into a golden core of power.',
        nascent: 'The soul takes form. Transcend mortal limits.',
        immortal: 'Break the heavens\' barrier. Become legend.'
    };

    realmNodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            var realm = this.dataset.realm;
            if (realmData[realm]) {
                this.querySelector('.realm-desc').textContent = realmData[realm].description;
            }
        });

        node.addEventListener('mouseleave', function() {
            var realm = this.dataset.realm;
            if (originalDesc[realm]) {
                this.querySelector('.realm-desc').textContent = originalDesc[realm];
            }
        });
    });
}

function initTechniqueCards() {
    var cards = document.querySelectorAll('.technique-card');

    var techniqueDetails = {
        fire: {
            fullDesc: 'Phoenix Flame Palm channels the essence of the mythical phoenix through both palms. When striking, spiritual flames engulf the target, burning not just flesh but qi itself. Masters can incinerate enemies from within.',
            origin: 'Phoenix Mountain Sect',
            practice: '12 years to first ignition'
        },
        water: {
            fullDesc: 'Flowing River Sword embodies the eternal nature of water. Each strike flows seamlessly into the next, creating an unending torrent of blade energy that adapts to any defense the opponent may raise.',
            origin: 'Azure Lake Academy',
            practice: '8 years to initial mastery'
        },
        earth: {
            fullDesc: 'Mountain Stance draws power from the ancient peaks. The practitioner becomes rooted to the earth, capable of deflecting attacks that would level buildings. True masters have been known to stop falling boulders.',
            origin: 'Stone Fist Monastery',
            practice: '5 years to stability'
        },
        wind: {
            fullDesc: 'Seven Wind Steps traces the paths of the seven celestial winds. Practitioners move with supernatural speed, leaving afterimages that confuse enemies. Each step covers impossible distances.',
            origin: 'Cloud Walking Sect',
            practice: '10 years to first step'
        }
    };

    cards.forEach(function(card) {
        card.addEventListener('click', function() {
            var element = this.dataset.element;
            var info = techniqueDetails[element];

            if (info) {
                var isExpanded = this.classList.contains('expanded');

                cards.forEach(function(c) {
                    c.classList.remove('expanded');
                    var descEl = c.querySelector('.technique-desc');
                    if (descEl.dataset.original) {
                        descEl.textContent = descEl.dataset.original;
                    }
                });

                if (!isExpanded) {
                    this.classList.add('expanded');
                    var descEl = this.querySelector('.technique-desc');
                    if (!descEl.dataset.original) {
                        descEl.dataset.original = descEl.textContent;
                    }
                    descEl.textContent = info.fullDesc;
                }
            }
        });
    });
}

function initMeridianDiagram() {
    var meridianPoints = document.querySelectorAll('.meridian-point');
    var dantianCore = document.querySelector('.dantian-core');
    var qiFlowPath = document.querySelector('.qi-flow-particles');

    if (dantianCore) {
        setInterval(function() {
            dantianCore.style.transform = 'scale(1.2)';
            setTimeout(function() {
                dantianCore.style.transform = 'scale(1)';
            }, 500);
        }, 1500);
    }

    meridianPoints.forEach(function(point) {
        point.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.5)';
            createQiBurst(this);
        });

        point.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    animateQiFlow();
}

function createQiBurst(element) {
    var svg = document.querySelector('.meridian-svg');
    if (!svg) return;

    var bbox = element.getBoundingClientRect();
    var svgBbox = svg.getBoundingClientRect();
    var x = bbox.left - svgBbox.left + bbox.width / 2;
    var y = bbox.top - svgBbox.top + bbox.height / 2;

    for (var i = 0; i < 6; i++) {
        var particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('cx', x);
        particle.setAttribute('cy', y);
        particle.setAttribute('r', '3');
        particle.setAttribute('fill', '#c41e3a');
        particle.setAttribute('opacity', '0.8');
        svg.appendChild(particle);

        var angle = (i / 6) * Math.PI * 2;
        var distance = 30;
        var targetX = x + Math.cos(angle) * distance;
        var targetY = y + Math.sin(angle) * distance;

        animateParticle(particle, targetX, targetY);
    }
}

function animateParticle(particle, targetX, targetY) {
    var progress = 0;
    var startX = parseFloat(particle.getAttribute('cx'));
    var startY = parseFloat(particle.getAttribute('cy'));
    var duration = 500;
    var startTime = performance.now();

    function animate(currentTime) {
        var elapsed = currentTime - startTime;
        progress = Math.min(elapsed / duration, 1);
        var easeProgress = 1 - Math.pow(1 - progress, 3);
        var currentX = startX + (targetX - startX) * easeProgress;
        var currentY = startY + (targetY - startY) * easeProgress;

        particle.setAttribute('cx', currentX);
        particle.setAttribute('cy', currentY);
        particle.setAttribute('opacity', 0.8 * (1 - progress));

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }

    requestAnimationFrame(animate);
}

function animateQiFlow() {
    var meridianLines = document.querySelectorAll('.meridian-line');
    var flowIndex = 0;

    setInterval(function() {
        meridianLines.forEach(function(line, index) {
            var isFlowing = index === flowIndex % meridianLines.length;
            if (isFlowing) {
                line.style.stroke = '#c41e3a';
                line.style.opacity = '0.8';
                line.style.filter = 'drop-shadow(0 0 5px rgba(196, 30, 58, 0.8))';
            } else {
                line.style.stroke = '#1a1a1a';
                line.style.opacity = '0.5';
                line.style.filter = 'none';
            }
        });
        flowIndex++;
    }, 1000);
}

function initSkillTree() {
    var skillNodes = document.querySelectorAll('.skill-node');
    var tooltip = document.getElementById('skillTooltip');

    var skillData = {
        'qi-circulation': {
            name: 'Qi Circulation',
            chinese: '气循环',
            desc: 'The foundation of all inner cultivation. Learn to sense and guide qi through your meridians.',
            requires: 'None'
        },
        'yin-yang': {
            name: 'Yin-Yang Balance',
            chinese: '陰陽平衡',
            desc: 'Understand the dual nature of all energy. Balance internal forces for greater cultivation.',
            requires: 'Qi Circulation'
        },
        'yin-path': {
            name: 'Yin Path',
            chinese: '陰道',
            desc: 'Embrace the cold, dark, feminine energy. Master stealth, shadow, and ice techniques.',
            requires: 'Yin-Yang Balance'
        },
        'yang-path': {
            name: 'Yang Path',
            chinese: '陽道',
            desc: 'Embrace the hot, bright, masculine energy. Master fire, lightning, and offensive techniques.',
            requires: 'Yin-Yang Balance'
        },
        'shadow': {
            name: 'Shadow Arts',
            chinese: '影術',
            desc: 'Blend into darkness itself. Move unseen and strike from the void.',
            requires: 'Yin Path'
        },
        'ice': {
            name: 'Ice Manipulation',
            chinese: '冰功',
            desc: 'Freeze moisture in the air. Create weapons of ice and slow enemies with cold.',
            requires: 'Yin Path'
        },
        'fire': {
            name: 'Fire Control',
            chinese: '火控',
            desc: 'Generate and control flames with qi. Burn through obstacles and enemies alike.',
            requires: 'Yang Path'
        },
        'lightning': {
            name: 'Lightning Arts',
            chinese: '雷法',
            desc: 'Channel the fury of storms. Strike with the speed of lightning itself.',
            requires: 'Yang Path'
        },
        'void': {
            name: 'Void Walking',
            chinese: '空行',
            desc: 'Step between spaces. Become untouchable by physical attacks.',
            requires: 'Shadow Arts'
        },
        'frost': {
            name: 'Absolute Frost',
            chinese: '絶霜',
            desc: 'Freeze the very soul of your enemies. Ice that never melts.',
            requires: 'Ice Manipulation'
        },
        'inferno': {
            name: 'Inferno Nova',
            chinese: '炎爆',
            desc: 'Unleash a sun\'s worth of flame. Incinerate everything in range.',
            requires: 'Fire Control'
        },
        'thunder': {
            name: 'Thunder Strike',
            chinese: '雷霆',
            desc: 'Call down lightning from clear skies. Smite enemies from above.',
            requires: 'Lightning Arts'
        },
        'nirvana': {
            name: 'Nirvana State',
            chinese: '涅槃',
            desc: 'Transcend life and death. Become one with the void itself.',
            requires: 'Void Walking'
        },
        'absolute-zero': {
            name: 'Absolute Zero',
            chinese: '絶零',
            desc: 'The coldest cold. Freeze time itself in a localized area.',
            requires: 'Absolute Frost'
        },
        'solar-flare': {
            name: 'Solar Flare',
            chinese: '烈陽',
            desc: 'Become as the sun. Annihilate all darkness within a mile.',
            requires: 'Inferno Nova'
        },
        'divine-thunder': {
            name: 'Divine Thunder',
            chinese: '神雷',
            desc: 'The wrath of the heavens made manifest. Nothing survives.',
            requires: 'Thunder Strike'
        }
    };

    skillNodes.forEach(function(node) {
        node.addEventListener('mouseenter', function(e) {
            var skillId = this.dataset.skill;
            var data = skillData[skillId];

            if (data && tooltip) {
                tooltip.querySelector('.tooltip-chinese').textContent = data.chinese;
                tooltip.querySelector('.tooltip-name').textContent = data.name;
                tooltip.querySelector('.tooltip-desc').textContent = data.desc;
                tooltip.querySelector('.requirements-text').textContent = data.requires;
                tooltip.classList.add('visible');
                positionTooltip(e, tooltip);
            }
        });

        node.addEventListener('mousemove', function(e) {
            if (tooltip && tooltip.classList.contains('visible')) {
                positionTooltip(e, tooltip);
            }
        });

        node.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.classList.remove('visible');
            }
        });
    });

    animateSkillTreeNodes();
}

function positionTooltip(e, tooltip) {
    var tooltipRect = tooltip.getBoundingClientRect();
    var x = e.clientX + 15;
    var y = e.clientY + 15;

    if (x + tooltipRect.width > window.innerWidth) {
        x = e.clientX - tooltipRect.width - 15;
    }

    if (y + tooltipRect.height > window.innerHeight) {
        y = e.clientY - tooltipRect.height - 15;
    }

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function animateSkillTreeNodes() {
    var nodes = document.querySelectorAll('.skill-node:not(.locked)');

    nodes.forEach(function(node) {
        node.addEventListener('mouseenter', function() {
            pulseConnectedBranches();
        });
    });
}

function pulseConnectedBranches() {
    var branches = document.querySelectorAll('.skill-branch');

    branches.forEach(function(branch) {
        branch.style.stroke = '#1a1a1a';
        branch.style.opacity = '0.6';
    });

    setTimeout(function() {
        branches.forEach(function(branch) {
            branch.style.stroke = '#4a4a4a';
            branch.style.opacity = '0.5';
        });
    }, 500);
}

function initParallax() {
    var bambooBack = document.querySelector('.bamboo-back');
    var bambooMid = document.querySelector('.bamboo-mid');
    var cloud1 = document.querySelector('.cloud-layer-1');
    var cloud2 = document.querySelector('.cloud-layer-2');
    var ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                var scrollY = window.scrollY;

                if (bambooBack) {
                    bambooBack.style.transform = 'translateY(' + (scrollY * 0.05) + 'px)';
                }

                if (bambooMid) {
                    bambooMid.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
                }

                if (cloud1) {
                    cloud1.style.transform = 'translateX(' + (-scrollY * 0.02) + 'px)';
                }

                if (cloud2) {
                    cloud2.style.transform = 'translateX(' + (scrollY * 0.015) + 'px)';
                }

                ticking = false;
            });

            ticking = true;
        }
    });
}

function initQiParticles() {
    var particleContainer = document.querySelector('.qi-flow-particles');
    if (!particleContainer) return;

    var meridianSection = document.querySelector('.meridian-section');
    if (!meridianSection) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                startQiParticleAnimation(particleContainer);
            } else {
                stopQiParticleAnimation();
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(meridianSection);
}

var qiParticleInterval = null;

function startQiParticleAnimation(container) {
    if (qiParticleInterval) return;

    qiParticleInterval = setInterval(function() {
        createQiParticle(container);
    }, 300);
}

function stopQiParticleAnimation() {
    if (qiParticleInterval) {
        clearInterval(qiParticleInterval);
        qiParticleInterval = null;
    }
}

function createQiParticle(container) {
    var particle = document.createElement('div');
    particle.className = 'qi-particle';

    var startX = Math.random() * 100;
    var startY = Math.random() * 100;
    var endX = 50 + (Math.random() - 0.5) * 40;
    var endY = 50;

    particle.style.cssText = 'position: absolute; width: 4px; height: 4px; background: radial-gradient(circle, rgba(196, 30, 58, 0.8), transparent); border-radius: 50%; left: ' + startX + '%; top: ' + startY + '%; pointer-events: none; opacity: 0;';

    container.appendChild(particle);

    particle.animate([
        { opacity: 0, transform: 'translate(0, 0) scale(1)' },
        { opacity: 1, transform: 'translate(' + (endX - startX) * 2 + 'px, ' + (endY - startY) * 2 + 'px) scale(1.5)', offset: 0.5 },
        { opacity: 0, transform: 'translate(' + (endX - startX) * 4 + 'px, ' + (endY - startY) * 4 + 'px) scale(0)' }
    ], {
        duration: 2000,
        easing: 'ease-out'
    });

    setTimeout(function() {
        particle.remove();
    }, 2000);
}

var sealStamps = document.querySelectorAll('.seal-stamp');
sealStamps.forEach(function(seal) {
    seal.addEventListener('click', function() {
        this.style.animation = 'none';
        this.offsetHeight;
        this.style.animation = 'sealStamp 0.3s ease';
    });
});

var sealStampStyle = document.createElement('style');
sealStampStyle.textContent = '@keyframes sealStamp { 0% { transform: rotate(-5deg) scale(1); } 50% { transform: rotate(-5deg) scale(1.2); } 100% { transform: rotate(-5deg) scale(1); } }';
document.head.appendChild(sealStampStyle);

var rootNodes = document.querySelectorAll('.root-node');
rootNodes.forEach(function(node) {
    setInterval(function() {
        var ring = node.querySelector('.node-ring');
        if (ring) {
            ring.style.stroke = 'rgba(196, 30, 58, 0.5)';
            ring.style.animation = 'rootPulse 2s ease infinite';
        }
    }, 1000);
});

var rootPulseStyle = document.createElement('style');
rootPulseStyle.textContent = '@keyframes rootPulse { 0%, 100% { stroke-width: 4; opacity: 0.5; } 50% { stroke-width: 8; opacity: 0.2; } }';
document.head.appendChild(rootPulseStyle);

window.addEventListener('scroll', function() {
    var scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    var header = document.querySelector('.scroll-header');

    if (header) {
        var parallaxOffset = scrollPercent * 20;
        header.style.transform = 'translateY(' + (-parallaxOffset) + 'px)';
    }
});

var loadingOverlay = document.createElement('div');
loadingOverlay.className = 'loading-overlay';

var loadingContent = document.createElement('div');
loadingContent.className = 'loading-scroll';

var loadingText = document.createElement('div');
loadingText.className = 'loading-text';
loadingText.textContent = 'Unrolling Ancient Scroll...';

loadingContent.appendChild(loadingText);
loadingOverlay.appendChild(loadingContent);

loadingOverlay.style.cssText = 'position: fixed; inset: 0; background: linear-gradient(180deg, #1a1a1a, #2d2420, #1a1a1a); z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 1; transition: opacity 0.8s ease;';

var loadingScrollStyle = document.createElement('style');
loadingScrollStyle.textContent = '.loading-scroll { text-align: center; } .loading-text { font-family: "Ma Shan Zheng", cursive; font-size: 2rem; color: #f5f0e6; letter-spacing: 0.2em; animation: loadingPulse 2s ease infinite; } @keyframes loadingPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }';
document.head.appendChild(loadingScrollStyle);

document.body.appendChild(loadingOverlay);

setTimeout(function() {
    loadingOverlay.style.opacity = '0';
    setTimeout(function() {
        loadingOverlay.remove();
    }, 800);
}, 1500);