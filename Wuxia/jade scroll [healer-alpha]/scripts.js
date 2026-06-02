/* ============================================
   武林秘典 — The Wuxia Compendium
   Interactive Scripts
   ============================================ */

(function() {
    'use strict';

    // ===== DOM Elements =====
    const scrollIntro = document.getElementById('scroll-intro');
    const mainScroll = document.getElementById('main-scroll');
    const sealNav = document.getElementById('seal-nav');
    const inkCanvas = document.getElementById('ink-canvas');
    const techniqueModal = document.getElementById('technique-modal');

    // ===== State =====
    let isIntroComplete = false;
    let lastScrollY = 0;
    let ticking = false;

    // ===== Technique Data =====
    const techniqueData = {
        sword: {
            seal: '剑',
            title: '独孤九剑',
            subtitle: 'The Nine Swords of Dugu',
            body: '<p>独孤求败，一生求败而不可得，乃创此剑法。九剑破尽天下武功：总诀式、破剑式、破掌式、破气式、破鞭式、破索式、破箭式、破枪式、破剑式。</p><p>此剑法不拘于形，以无招胜有招，以不变应万变。习至大成，草木竹石皆可为剑，无剑胜有剑。</p><p><em>Legend says Dugu Qiubai sought defeat all his life but never found a worthy opponent. His sword art breaks all techniques with nine forms.</em></p>'
        },
        palm: {
            seal: '掌',
            title: '降龙十八掌',
            subtitle: 'Eighteen Dragon Subduing Palms',
            body: '<p>天下第一刚猛掌法，乃丐帮镇帮绝学。十八式掌法，招招刚猛无匹，掌力所至，排山倒海，无坚不摧。</p><p>其势如龙，其力如雷。修习者须心存浩然正气，方能发挥此掌法之极致威力。</p><p><em>The supreme external martial art. Each palm strike channels the power of a divine dragon, creating shockwaves that can shatter mountains.</em></p>'
        },
        qigong: {
            seal: '功',
            title: '九阳神功',
            subtitle: 'Nine Suns Divine Art',
            body: '<p>至阳至刚之内功心法，习之可得无穷内力。内息如烈日当空，浩然磅礴，可疗伤祛毒，百毒不侵。</p><p>此功法为天下内功之根本，习成后可触类旁通，任何外功招式皆能信手拈来。</p><p><em>The ultimate yang cultivation method. Its practitioner generates boundless internal heat, healing wounds in moments and incinerating poisons.</em></p>'
        },
        movement: {
            seal: '步',
            title: '凌波微步',
            subtitle: 'Light Body Wave Treading',
            body: '<p>逍遥派绝顶轻功，按周易六十四卦方位施展。步法飘忽不定，如凌波踏水，曼妙无方。</p><p>习者身形如烟如幻，敌人未见其动，已失其踪。乃躲避强敌、游斗周旋之无上妙法。</p><p><em>An ethereal movement technique allowing the user to glide across water and walk on air. Based on the I Ching trigrams.</em></p>'
        },
        finger: {
            seal: '指',
            title: '六脉神剑',
            subtitle: 'Six Meridian Divine Sword',
            body: '<p>大理段氏之绝学，以内力化为剑气，从指尖激射而出。六脉对应六根手指，各具不同威能。</p><p>少商剑刚猛，商阳剑灵动，中冲剑沉雄，关冲剑浑厚，少冲剑锐利，少泽剑飘逸。六剑齐出，天下无敌。</p><p><em>The supreme finger-qi technique. Each finger projects a different form of sword Qi, corresponding to the six major meridians.</em></p>'
        },
        hidden: {
            seal: '暗',
            title: '小李飞刀',
            subtitle: "Little Li's Flying Dagger",
            body: '<p>例不虚发，小李飞刀——李寻欢之绝技。一刀既出，从无失手。此飞刀已非暗器，而是心之所在。</p><p>当对手看见飞刀出手时，刀已在心。速度、精准、意境三者合一，已达武学之化境。</p><p><em>Never miss — the legend of Li Xunhuan\'s flying dagger. A single throw that has never failed to find its mark.</em></p>'
        }
    };

    // ===== Initialization =====
    function init() {
        setupScrollIntro();
        setupParallax();
        setupInkCanvas();
        setupSealNavigation();
        setupScrollAnimations();
        setupSkillTree();
        setupTechniqueCards();
        setupModal();
        setupCounters();
    }

    // ===== Scroll Intro =====
    function setupScrollIntro() {
        if (!scrollIntro) return;

        scrollIntro.addEventListener('click', function() {
            if (isIntroComplete) return;
            
            scrollIntro.classList.add('unrolling');
            
            setTimeout(function() {
                scrollIntro.classList.add('hidden');
                isIntroComplete = true;
                document.body.style.overflow = 'auto';
                triggerInitialAnimations();
            }, 1500);
        });

        // Prevent scrolling until intro is complete
        document.body.style.overflow = 'hidden';
    }

    function triggerInitialAnimations() {
        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach(function(el, index) {
            el.style.animationDelay = (index * 0.2) + 's';
        });
    }

    // ===== Parallax Effect =====
    function setupParallax() {
        const layers = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    updateParallax(layers);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    function updateParallax(layers) {
        const scrollY = window.pageYOffset;
        
        layers.forEach(function(layer) {
            const speed = parseFloat(layer.dataset.speed) || 0.02;
            const yPos = -(scrollY * speed);
            layer.style.transform = 'translate3d(0, ' + yPos + 'px, 0)';
        });
    }

    // ===== Ink Canvas =====
    function setupInkCanvas() {
        if (!inkCanvas) return;

        const ctx = inkCanvas.getContext('2d');
        let width, height;
        let inkDrops = [];

        function resize() {
            width = inkCanvas.width = window.innerWidth;
            height = inkCanvas.height = window.innerHeight;
        }

        function createInkDrop() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 30 + 10,
                opacity: Math.random() * 0.1 + 0.02,
                growth: Math.random() * 0.02 + 0.005
            };
        }

        function initInkDrops() {
            inkDrops = [];
            for (let i = 0; i < 15; i++) {
                inkDrops.push(createInkDrop());
            }
        }

        function drawInk() {
            ctx.clearRect(0, 0, width, height);
            
            inkDrops.forEach(function(drop) {
                ctx.beginPath();
                ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(26, 26, 26, ' + drop.opacity + ')';
                ctx.fill();
                
                // Irregular edge effect
                for (let i = 0; i < 5; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = drop.radius * (0.8 + Math.random() * 0.4);
                    ctx.beginPath();
                    ctx.arc(
                        drop.x + Math.cos(angle) * dist,
                        drop.y + Math.sin(angle) * dist,
                        drop.radius * 0.2,
                        0, Math.PI * 2
                    );
                    ctx.fillStyle = 'rgba(26, 26, 26, ' + (drop.opacity * 0.5) + ')';
                    ctx.fill();
                }

                drop.radius += drop.growth;
                if (drop.radius > 50) {
                    Object.assign(drop, createInkDrop());
                    drop.radius = 5;
                }
            });

            requestAnimationFrame(drawInk);
        }

        resize();
        initInkDrops();
        drawInk();

        window.addEventListener('resize', function() {
            resize();
            initInkDrops();
        });
    }

    // ===== Seal Navigation =====
    function setupSealNavigation() {
        const markers = document.querySelectorAll('.seal-marker');
        const sections = document.querySelectorAll('.scroll-section');

        // Smooth scroll on click
        markers.forEach(function(marker) {
            marker.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Update active state on scroll
        function updateActiveNav() {
            const scrollPos = window.scrollY + window.innerHeight / 3;
            
            sections.forEach(function(section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    markers.forEach(function(marker) {
                        marker.classList.remove('active');
                        if (marker.getAttribute('data-section') === sectionId) {
                            marker.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();
    }

    // ===== Scroll Animations =====
    function setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Staggered animation for children
                    const children = entry.target.querySelectorAll('[data-stagger]');
                    children.forEach(function(child, index) {
                        setTimeout(function() {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe cultivation stages
        document.querySelectorAll('.cultivation-stage').forEach(function(stage, index) {
            stage.style.transitionDelay = (index * 0.1) + 's';
            observer.observe(stage);
        });

        // Observe technique cards
        document.querySelectorAll('.technique-card').forEach(function(card, index) {
            card.style.transitionDelay = (index * 0.15) + 's';
            observer.observe(card);
        });

        // Observe section headers
        document.querySelectorAll('.section-header').forEach(function(header) {
            observer.observe(header);
        });
    }

    // ===== Skill Tree =====
    function setupSkillTree() {
        const nodes = document.querySelectorAll('.skill-node');
        
        nodes.forEach(function(node) {
            // Add ripple effect on click
            node.addEventListener('click', function(e) {
                createRipple(this, e);
                
                // Toggle active state
                const wasActive = this.classList.contains('node-active');
                nodes.forEach(function(n) { n.classList.remove('node-active'); });
                if (!wasActive) {
                    this.classList.add('node-active');
                }
            });

            // Sound-like visual feedback on hover
            node.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });

        // Animate skill lines on scroll
        const skillTreeContainer = document.querySelector('.skill-tree-container');
        if (skillTreeContainer) {
            const skillObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const lines = entry.target.querySelectorAll('.skill-tree-branch, .skill-tree-trunk');
                        lines.forEach(function(line, index) {
                            setTimeout(function() {
                                line.style.opacity = '0.7';
                                line.style.transform = line.style.transform || 'scaleX(1)';
                            }, index * 200);
                        });
                    }
                });
            }, { threshold: 0.3 });

            skillObserver.observe(skillTreeContainer);
        }
    }

    function createRipple(element, event) {
        const circle = document.createElement('div');
        circle.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (event.clientX - rect.left - size / 2) + 'px';
        circle.style.top = (event.clientY - rect.top - size / 2) + 'px';
        
        element.querySelector('.node-circle').appendChild(circle);
        
        setTimeout(function() {
            circle.remove();
        }, 600);
    }

    // ===== Technique Cards =====
    function setupTechniqueCards() {
        const cards = document.querySelectorAll('.technique-card');
        
        cards.forEach(function(card) {
            // Animate stat bars when visible
            const statFills = card.querySelectorAll('.stat-fill');
            const statWidths = [];
            
            statFills.forEach(function(fill) {
                statWidths.push(fill.style.width);
                fill.style.width = '0';
            });

            const cardObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        card.classList.add('visible');
                        statFills.forEach(function(fill, index) {
                            setTimeout(function() {
                                fill.style.width = statWidths[index];
                            }, index * 150 + 300);
                        });
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            cardObserver.observe(card);

            // Card click to open modal
            card.addEventListener('click', function() {
                const technique = this.dataset.technique;
                if (technique && techniqueData[technique]) {
                    openTechniqueModal(techniqueData[technique]);
                }
            });
        });
    }

    // ===== Modal =====
    function setupModal() {
        if (!techniqueModal) return;

        const backdrop = techniqueModal.querySelector('.modal-backdrop');
        const closeBtn = techniqueModal.querySelector('.modal-close');

        if (backdrop) {
            backdrop.addEventListener('click', closeTechniqueModal);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeTechniqueModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && techniqueModal.classList.contains('active')) {
                closeTechniqueModal();
            }
        });
    }

    function openTechniqueModal(data) {
        if (!techniqueModal) return;

        const modalSeal = techniqueModal.querySelector('.modal-seal');
        const modalTitle = techniqueModal.querySelector('.modal-title');
        const modalSubtitle = techniqueModal.querySelector('.modal-subtitle');
        const modalBody = techniqueModal.querySelector('.modal-body');

        if (modalSeal) modalSeal.textContent = data.seal;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
        if (modalBody) modalBody.innerHTML = data.body;

        techniqueModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeTechniqueModal() {
        if (!techniqueModal) return;
        
        techniqueModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // ===== Counter Animation =====
    function setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target, 10);
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(start + (target - start) * easedProgress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // ===== Meridian Legend Interaction =====
    document.querySelectorAll('.legend-item').forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            const meridian = this.dataset.meridian;
            const lines = document.querySelectorAll('.meridian-line');
            
            lines.forEach(function(line) {
                line.style.opacity = '0.3';
                line.style.transition = 'opacity 0.3s ease';
            });

            const targetLine = document.querySelector('.meridian-' + meridian);
            if (targetLine) {
                targetLine.style.opacity = '1';
                targetLine.style.filter = 'drop-shadow(0 0 4px currentColor)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const lines = document.querySelectorAll('.meridian-line');
            lines.forEach(function(line) {
                line.style.opacity = '0.7';
                line.style.filter = 'none';
            });
        });
    });

    // ===== Smooth Scroll Polyfill for older browsers =====
    if (!('scrollBehavior' in document.documentElement.style)) {
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    smoothScrollTo(target.offsetTop, 800);
                }
            });
        });

        function smoothScrollTo(targetPosition, duration) {
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }
    }

    // ===== Bamboo Sway Animation =====
    function setupBambooSway() {
        const bamboos = document.querySelectorAll('.bamboo-stalk');
        
        bamboos.forEach(function(bamboo, index) {
            const delay = index * 0.5;
            const duration = 4 + Math.random() * 2;
            bamboo.style.animation = 'bambooSway ' + duration + 's ease-in-out ' + delay + 's infinite';
        });

        // Add bamboo sway keyframes dynamically
        const style = document.createElement('style');
        style.textContent = '\n' +
            '@keyframes bambooSway {\n' +
            '    0%, 100% { transform: rotate(0deg); }\n' +
            '    25% { transform: rotate(1deg); }\n' +
            '    75% { transform: rotate(-1deg); }\n' +
            '}\n';
        document.head.appendChild(style);
    }

    // ===== Mist Animation =====
    function setupMistAnimation() {
        const mist = document.querySelector('.mist-overlay');
        if (!mist) return;

        let opacity = 0.6;
        let direction = 1;

        function animateMist() {
            opacity += direction * 0.002;
            if (opacity > 0.8) direction = -1;
            if (opacity < 0.4) direction = 1;
            
            mist.style.opacity = opacity;
            requestAnimationFrame(animateMist);
        }

        animateMist();
    }

    // ===== Add Ripple CSS =====
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = '\n' +
            '.ripple-effect {\n' +
            '    position: absolute;\n' +
            '    border-radius: 50%;\n' +
            '    background: rgba(197, 61, 67, 0.3);\n' +
            '    transform: scale(0);\n' +
            '    animation: ripple 0.6s ease-out;\n' +
            '    pointer-events: none;\n' +
            '}\n' +
            '\n' +
            '@keyframes ripple {\n' +
            '    to {\n' +
            '        transform: scale(2);\n' +
            '        opacity: 0;\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '.node-active .node-circle {\n' +
            '    border-color: #c53d43 !important;\n' +
            '    box-shadow: 0 4px 12px rgba(197, 61, 67, 0.4), 0 0 20px rgba(197, 61, 67, 0.2) !important;\n' +
            '}\n' +
            '\n' +
            '.node-active .node-circle::after {\n' +
            '    content: "";\n' +
            '    position: absolute;\n' +
            '    inset: -6px;\n' +
            '    border: 2px solid rgba(197, 61, 67, 0.3);\n' +
            '    border-radius: 50%;\n' +
            '    animation: nodeGlow 2s ease-in-out infinite;\n' +
            '}\n' +
            '\n' +
            '@keyframes nodeGlow {\n' +
            '    0%, 100% { transform: scale(1); opacity: 0.5; }\n' +
            '    50% { transform: scale(1.15); opacity: 0.2; }\n' +
            '}\n' +
            '\n' +
            '.section-header.visible .section-title {\n' +
            '    animation: titleReveal 0.8s ease-out forwards;\n' +
            '}\n' +
            '\n' +
            '@keyframes titleReveal {\n' +
            '    from { opacity: 0; transform: translateY(20px); }\n' +
            '    to { opacity: 1; transform: translateY(0); }\n' +
            '}\n' +
            '\n' +
            '.technique-card.visible {\n' +
            '    animation: cardReveal 0.6s ease-out forwards;\n' +
            '}\n' +
            '\n' +
            '@keyframes cardReveal {\n' +
            '    from { opacity: 0; transform: translateY(30px); }\n' +
            '    to { opacity: 1; transform: translateY(0); }\n' +
            '}\n' +
            '\n' +
            '.skill-tree-trunk {\n' +
            '    opacity: 0;\n' +
            '    transition: opacity 1s ease-out;\n' +
            '}\n' +
            '\n' +
            '.skill-tree-branch {\n' +
            '    opacity: 0;\n' +
            '    transition: opacity 0.8s ease-out, transform 0.8s ease-out;\n' +
            '}\n' +
            '\n' +
            '.skill-tree-container.visible .skill-tree-trunk,\n' +
            '.skill-tree-container.visible .skill-tree-branch {\n' +
            '    opacity: 0.7;\n' +
            '}\n';
        document.head.appendChild(style);
    }

    // ===== Initialize Everything =====
    document.addEventListener('DOMContentLoaded', function() {
        init();
        setupBambooSway();
        setupMistAnimation();
        addDynamicStyles();
    });

})();