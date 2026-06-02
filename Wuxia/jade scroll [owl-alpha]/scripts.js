/* ============================================================
   武道秘典 · Wulin Codex — Interactive Scripts
   Ink Wash Painting Aesthetic on Silk Scroll
   ============================================================ */

(function () {
    'use strict';

    /* --------------------------------------------------------
       UTILITY FUNCTIONS
       -------------------------------------------------------- */

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    function createSVGElement(tag, attrs) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [key, val] of Object.entries(attrs || {})) {
            el.setAttribute(key, val);
        }
        return el;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randInt(min, max) {
        return Math.floor(rand(min, max + 1));
    }

    /* --------------------------------------------------------
       LOADING SCREEN
       -------------------------------------------------------- */

    function initLoadingScreen() {
        const loader = $('#loading-screen');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 3200);
        });

        setTimeout(() => {
            loader.classList.add('hidden');
        }, 6000);
    }

    /* --------------------------------------------------------
       FLOATING INK PARTICLES
       -------------------------------------------------------- */

    function initInkParticles() {
        const container = $('#ink-particles');
        if (!container) return;

        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('ink-particle');

            const size = rand(20, 80);
            const left = rand(0, 100);
            const duration = rand(15, 35);
            const delay = rand(0, 20);
            const drift = rand(-50, 50);

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                --drift: ${drift}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;

            container.appendChild(particle);
        }
    }

    /* --------------------------------------------------------
       PARALLAX BACKGROUNDS
       -------------------------------------------------------- */

    function initParallax() {
        const layers = $$('.bg-layer');

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;

            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.parallax) || 0.1;
                const yOffset = scrollY * speed;
                layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /* --------------------------------------------------------
       SCROLL PROGRESS INDICATOR
       -------------------------------------------------------- */

    function initScrollProgress() {
        const progressFill = $('#progress-fill');
        const progressMarker = $('#progress-marker');
        if (!progressFill || !progressMarker) return;

        let ticking = false;

        function updateProgress() {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollY = window.scrollY;
            const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

            progressFill.style.height = `${Math.min(progress, 100)}%`;
            progressMarker.style.top = `${Math.min(progress, 100)}%`;

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    /* --------------------------------------------------------
       SEAL NAVIGATION
       -------------------------------------------------------- */

    function initSealNavigation() {
        const navItems = $$('.seal-nav-item');
        const sections = $$('.scroll-section');

        if (!navItems.length || !sections.length) return;

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.dataset.target;
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        let ticking = false;

        function updateActiveNav() {
            const scrollY = window.scrollY + window.innerHeight / 3;
            let currentSection = null;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                if (scrollY >= top) {
                    currentSection = section.id;
                }
            });

            navItems.forEach(item => {
                item.classList.toggle('active', item.dataset.target === currentSection);
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveNav);
                ticking = true;
            }
        }, { passive: true });

        updateActiveNav();
    }

    /* --------------------------------------------------------
       SCROLL-TRIGGERED FADE-IN ANIMATIONS
       -------------------------------------------------------- */

    function initScrollAnimations() {
        const animatedElements = $$('.path-card, .technique-card, .colophon-content, .meridian-figure-container, .skill-tree-svg-container');

        animatedElements.forEach(el => {
            el.classList.add('scroll-fade-in');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    /* --------------------------------------------------------
       YIN YANG ROTATION ON SCROLL
       -------------------------------------------------------- */

    function initYinYang() {
        const yinYang = $('#yin-yang');
        if (!yinYang) return;

        let ticking = false;

        function updateRotation() {
            const scrollY = window.scrollY;
            const rotation = scrollY * 0.5;
            yinYang.style.transform = `rotate(${rotation}deg)`;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateRotation);
                ticking = true;
            }
        }, { passive: true });
    }

    /* --------------------------------------------------------
       SKILL TREE — Ink Brush Branching Diagram
       -------------------------------------------------------- */

    const skillTreeData = {
        root: { x: 450, y: 750, nameCn: '武道起源', nameEn: 'Origin', desc: 'The primordial source of all martial arts. Where the journey begins.', power: 0, defense: 0, speed: 0 },
        branches: [
            {
                id: 'inner', labelCn: '內功', labelEn: 'Inner',
                x: 250, y: 620,
                nameCn: '內功心法', nameEn: 'Inner Power',
                desc: 'Master the flow of qi within. Forge your dantian and open the meridians.',
                power: 30, defense: 50, speed: 20,
                children: [
                    { id: 'dantian', x: 150, y: 500, nameCn: '丹田凝氣', nameEn: 'Dantian Focus', desc: 'Concentrate qi into the lower dantian, creating an unshakeable core.', power: 45, defense: 70, speed: 25, children: [
                        { id: 'golden', x: 80, y: 370, nameCn: '金丹大道', nameEn: 'Golden Core', desc: 'Condense qi into a golden elixir within. The first step toward immortality.', power: 70, defense: 90, speed: 40 },
                        { id: 'spirit', x: 200, y: 370, nameCn: '元嬰出竅', nameEn: 'Nascent Soul', desc: 'Birth a spiritual infant within your core. Project your consciousness beyond flesh.', power: 90, defense: 80, speed: 60 }
                    ]},
                    { id: 'meridian', x: 320, y: 500, nameCn: '奇經八脈', nameEn: 'Eight Meridians', desc: 'Open all eight extraordinary meridians to achieve transcendent qi flow.', power: 55, defense: 65, speed: 50, children: [
                        { id: 'heaven', x: 320, y: 370, nameCn: '天人合一', nameEn: 'Heaven Unity', desc: 'Merge your consciousness with the natural order. Become one with the Dao.', power: 85, defense: 85, speed: 70 }
                    ]}
                ]
            },
            {
                id: 'external', labelCn: '外功', labelEn: 'External',
                x: 650, y: 620,
                nameCn: '外功招式', nameEn: 'External Arts',
                desc: 'Harden the body and perfect combat technique. The warrior\'s path.',
                power: 50, defense: 30, speed: 40,
                children: [
                    { id: 'fist', x: 560, y: 500, nameCn: '拳法精通', nameEn: 'Fist Mastery', desc: 'Master the five elemental fists — crack mountains with a single strike.', power: 75, defense: 40, speed: 60, children: [
                        { id: 'iron', x: 490, y: 370, nameCn: '鐵布衫', nameEn: 'Iron Body', desc: 'Temper your skin to become impervious to ordinary weapons.', power: 80, defense: 95, speed: 45 },
                        { id: 'palm', x: 620, y: 370, nameCn: '如來神掌', nameEn: 'Divine Palm', desc: 'Channel qi through devastating palm strikes that shatter stone.', power: 95, defense: 50, speed: 65 }
                    ]},
                    { id: 'sword', x: 730, y: 500, nameCn: '御劍術', nameEn: 'Sword Arts', desc: 'Unite with your blade. The sword becomes an extension of your will.', power: 85, defense: 35, speed: 80, children: [
                        { id: 'flying', x: 730, y: 370, nameCn: '飛劍萬里', nameEn: 'Flying Sword', desc: 'Send your sword across vast distances with but a thought.', power: 100, defense: 30, speed: 95 }
                    ]}
                ]
            },
            {
                id: 'movement', labelCn: '身法', labelEn: 'Movement',
                x: 450, y: 560,
                nameCn: '輕功身法', nameEn: 'Lightness Arts',
                desc: 'Defy the bonds of earth. Move like wind, strike like lightning.',
                power: 20, defense: 25, speed: 70,
                children: [
                    { id: 'wind', x: 400, y: 440, nameCn: '御風而行', nameEn: 'Wind Walking', desc: 'Ride the currents of air. Walk upon leaves and water.', power: 35, defense: 30, speed: 85, children: [
                        { id: 'void', x: 400, y: 310, nameCn: '破碎虛空', nameEn: 'Void Step', desc: 'Tear through the fabric of space itself. Appear anywhere instantly.', power: 60, defense: 60, speed: 100 }
                    ]},
                    { id: 'shadow', x: 500, y: 440, nameCn: '影分身', nameEn: 'Shadow Clone', desc: 'Create illusory copies of yourself to confuse and overwhelm foes.', power: 50, defense: 45, speed: 90 }
                ]
            }
        ]
    };

    function drawSkillTree() {
        const svg = $('#skill-tree-svg');
        const branchesGroup = $('#tree-branches');
        const nodesGroup = $('#tree-nodes');
        if (!svg || !branchesGroup || !nodesGroup) return;

        function drawBranch(x1, y1, x2, y2, depth) {
            const path = createSVGElement('path', {
                class: 'branch',
                d: `M${x1},${y1} C${x1},${lerp(y1, y2, 0.4)} ${x2},${lerp(y1, y2, 0.6)} ${x2},${y2}`,
                'stroke-width': Math.max(1.5, 3 - depth * 0.5)
            });

            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.transition = `stroke-dashoffset ${1.2 - depth * 0.2}s var(--ease-silk) ${depth * 0.3}s`;

            branchesGroup.appendChild(path);

            setTimeout(() => {
                path.classList.add('visible');
            }, 100 + depth * 300);

            return path;
        }

        function drawNode(node, depth, parentX, parentY) {
            if (parentX !== null && parentY !== null) {
                drawBranch(parentX, parentY, node.x, node.y, depth);
            }

            const g = createSVGElement('g', { class: 'node-group' });

            const isLeaf = !node.children || node.children.length === 0;
            const radius = isLeaf ? 18 : (depth === 0 ? 26 : 22);

            const circle = createSVGElement('circle', {
                class: 'node-circle',
                cx: node.x,
                cy: node.y,
                r: radius,
                'data-id': node.id || 'root'
            });

            const textCn = createSVGElement('text', {
                class: 'node-text',
                x: node.x,
                y: node.y - (node.nameEn ? 3 : 0)
            });
            textCn.textContent = node.nameCn || node.labelCn || '';

            const textEn = createSVGElement('text', {
                class: 'node-text-en',
                x: node.x,
                y: node.y + 12
            });
            textEn.textContent = node.nameEn || node.labelEn || '';

            g.appendChild(circle);
            g.appendChild(textCn);
            if (node.nameEn || node.labelEn) {
                g.appendChild(textEn);
            }
            nodesGroup.appendChild(g);

            g.addEventListener('click', (e) => {
                e.stopPropagation();
                showSkillDetail(node);
            });

            g.addEventListener('mouseenter', () => {
                circle.setAttribute('r', radius + 4);
            });

            g.addEventListener('mouseleave', () => {
                circle.setAttribute('r', radius);
            });

            if (node.children) {
                node.children.forEach(child => {
                    drawNode(child, depth + 1, node.x, node.y);
                });
            }
        }

        drawNode(skillTreeData.root, 0, null, null);
    }

    function showSkillDetail(node) {
        const panel = $('#skill-detail-panel');
        const nameEl = $('#skill-name');
        const descEl = $('#skill-desc');
        const statsEl = $('#skill-stats');
        if (!panel || !nameEl || !descEl || !statsEl) return;

        nameEl.textContent = `${node.nameCn} · ${node.nameEn}`;
        descEl.textContent = node.desc;
        statsEl.innerHTML = '';

        if (node.power !== undefined) {
            const stats = [
                { label: '威力 Power', value: node.power },
                { label: '防禦 Defense', value: node.defense },
                { label: '身法 Speed', value: node.speed }
            ];

            stats.forEach(stat => {
                const statItem = document.createElement('div');
                statItem.className = 'stat-item';
                statItem.innerHTML = `
                    <span class="stat-label">${stat.label}</span>
                    <span class="stat-value">${stat.value}</span>
                `;
                statsEl.appendChild(statItem);
            });
        }

        panel.classList.add('visible');
    }

    function hideSkillDetail() {
        const panel = $('#skill-detail-panel');
        if (panel) panel.classList.remove('visible');
    }

    function initSkillTree() {
        drawSkillTree();

        const closeBtn = $('#skill-close');
        const panel = $('#skill-detail-panel');

        if (closeBtn) {
            closeBtn.addEventListener('click', hideSkillDetail);
        }

        if (panel) {
            panel.addEventListener('click', (e) => {
                if (e.target === panel) {
                    hideSkillDetail();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSkillDetail();
            }
        });
    }

    /* --------------------------------------------------------
       MERIDIAN QI FLOW ANIMATION
       -------------------------------------------------------- */

    function initMeridianFlow() {
        const svg = $('#meridian-svg');
        if (!svg) return;

        const meridianLines = $$('.meridian-line');
        const dantianGlow = $('#dantian-glow');
        const qiParticlesGroup = $('#qi-particles');

        // Animate meridian lines drawing in
        setTimeout(() => {
            meridianLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.strokeDashoffset = '0';
                }, index * 400);
            });
        }, 500);

        // Dantian glow pulse
        if (dantianGlow) {
            let glowPhase = 0;
            function pulseDantian() {
                glowPhase += 0.02;
                const opacity = 0.3 + Math.sin(glowPhase) * 0.2;
                dantianGlow.setAttribute('opacity', opacity.toString());
                requestAnimationFrame(pulseDantian);
            }
            setTimeout(pulseDantian, 2500);
        }

        // Qi particles flowing along meridians
        const qiPaths = [
            { id: 'meridian-ren', count: 4, speed: 3 },
            { id: 'meridian-du', count: 4, speed: 3 },
            { id: 'meridian-larm', count: 2, speed: 2 },
            { id: 'meridian-rarm', count: 2, speed: 2 },
            { id: 'meridian-lleg', count: 3, speed: 2.5 },
            { id: 'meridian-rleg', count: 3, speed: 2.5 }
        ];

        function createQiParticle(pathData) {
            const path = svg.querySelector(`#${pathData.id}`);
            if (!path) return;

            const particle = createSVGElement('circle', {
                class: 'qi-particle',
                r: rand(2, 4),
                filter: 'url(#qi-glow)'
            });

            let progress = 0;
            const totalLength = path.getTotalLength();

            function animateParticle() {
                progress += (pathData.speed / totalLength);
                if (progress > 1) progress = 0;

                const point = path.getPointAtLength(progress * totalLength);
                particle.setAttribute('cx', point.x);
                particle.setAttribute('cy', point.y);

                const fadeIn = Math.min(progress * 10, 1);
                const fadeOut = Math.max(0, (progress - 0.85) * 6.67);
                const opacity = Math.max(0, fadeIn - fadeOut);
                particle.setAttribute('opacity', opacity.toString());

                requestAnimationFrame(animateParticle);
            }

            particle.style.opacity = '0';
            qiParticlesGroup.appendChild(particle);
            setTimeout(animateParticle, rand(0, 2000));
        }

        qiPaths.forEach(pathData => {
            for (let i = 0; i < pathData.count; i++) {
                setTimeout(() => {
                    createQiParticle(pathData);
                }, rand(0, 3000));
            }
        });

        // Acupoint tooltips
        const acupoints = $$('.acupoint');
        const tooltip = $('#acupoint-tooltip');
        const tooltipName = $('#tooltip-name');
        const tooltipDesc = $('#tooltip-desc');

        acupoints.forEach(point => {
            point.addEventListener('mouseenter', (e) => {
                const name = point.dataset.name;
                const desc = point.dataset.desc;

                if (tooltipName && name) tooltipName.textContent = name;
                if (tooltipDesc && desc) tooltipDesc.textContent = desc;

                if (tooltip) {
                    tooltip.classList.add('visible');
                    positionTooltip(e);
                }
            });

            point.addEventListener('mousemove', (e) => {
                positionTooltip(e);
            });

            point.addEventListener('mouseleave', () => {
                if (tooltip) tooltip.classList.remove('visible');
            });
        });

        function positionTooltip(e) {
            if (!tooltip) return;

            const padding = 15;
            let left = e.clientX + padding;
            let top = e.clientY + padding;

            const tooltipRect = tooltip.getBoundingClientRect();

            if (left + tooltipRect.width > window.innerWidth) {
                left = e.clientX - tooltipRect.width - padding;
            }
            if (top + tooltipRect.height > window.innerHeight) {
                top = e.clientY - tooltipRect.height - padding;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }

        // Animate acupoints appearing
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    acupoints.forEach((point, index) => {
                        setTimeout(() => {
                            point.style.transition = 'r 0.5s var(--ease-silk), opacity 0.5s var(--ease-silk)';
                            point.style.opacity = '1';
                        }, index * 150);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        acupoints.forEach(point => {
            point.style.opacity = '0';
        });

        observer.observe(svg);
    }

    /* --------------------------------------------------------
       TECHNIQUES CATALOG — Dynamic Generation
       -------------------------------------------------------- */

    const techniquesData = [
        {
            nameCn: '亢龍有悔', nameEn: 'Dragon\'s Regret',
            category: 'strike',
            desc: 'The most powerful of the Eighteen Dragon-Subduing Palms. A devastating forward strike that channels all qi into a single explosive blow.',
            power: 95, qiCost: 40, difficulty: 9
        },
        {
            nameCn: '獨孤九劍', nameEn: 'Dugu Nine Swords',
            category: 'sword',
            desc: 'Nine sword techniques that cut through all forms of attack. Formless yet all-encompassing. The pinnacle of sword mastery.',
            power: 90, qiCost: 35, difficulty: 10
        },
        {
            nameCn: '易筋經', nameEn: 'Muscle Tendon Change',
            category: 'qigong',
            desc: 'The legendary Shaolin internal art. Completely reshape your body\'s foundation, strengthening bones, tendons, and meridians.',
            power: 60, qiCost: 25, difficulty: 8
        },
        {
            nameCn: '凌波微步', nameEn: 'Wave Treading Steps',
            category: 'movement',
            desc: 'Glide across any surface as though walking on water. Each step follows the sixty-four hexagrams of the I Ching.',
            power: 20, qiCost: 30, difficulty: 7
        },
        {
            nameCn: '六脈神劍', nameEn: 'Six Meridian Sword',
            category: 'sword',
            desc: 'Project sword qi from six fingers without a physical blade. Invisible attacks that pierce any defense.',
            power: 98, qiCost: 60, difficulty: 10
        },
        {
            nameCn: '太極拳', nameEn: 'Tai Chi Fist',
            category: 'strike',
            desc: 'Soft overcomes hard. Redirect force with circular movements. The art of winning without opposing.',
            power: 70, qiCost: 20, difficulty: 6
        },
        {
            nameCn: '九陽神功', nameEn: 'Nine Yang Divine Art',
            category: 'qigong',
            desc: 'Cultivate the pure yang qi within. Heal all wounds, purge all poisons, and generate limitless inner strength.',
            power: 75, qiCost: 50, difficulty: 9
        },
        {
            nameCn: '葵花寶典', nameEn: 'Sunflower Manual',
            category: 'qigong',
            desc: 'A forbidden technique of unparalleled speed. The practitioner moves faster than the eye can follow.',
            power: 85, qiCost: 55, difficulty: 10
        },
        {
            nameCn: '降龍十八掌', nameEn: 'Dragon Subduing Palms',
            category: 'strike',
            desc: 'Eighteen palm techniques passed down through generations. Each strike carries the might of a dragon.',
            power: 92, qiCost: 45, difficulty: 9
        },
        {
            nameCn: '追風步', nameEn: 'Wind Chasing Steps',
            category: 'movement',
            desc: 'Run faster than the wind itself. Leave afterimages that confuse pursuers. Escape any encirclement.',
            power: 15, qiCost: 20, difficulty: 5
        },
        {
            nameCn: '玄鐵劍法', nameEn: 'Dark Iron Sword Art',
            category: 'sword',
            desc: 'Heavy sword technique that relies on overwhelming force. One strike cleaves through armor and bone alike.',
            power: 88, qiCost: 30, difficulty: 7
        },
        {
            nameCn: '洗髓經', nameEn: 'Marrow Cleansing Classic',
            category: 'qigong',
            desc: 'Purify your very marrow and essence. Achieve a body of jade that ages not and knows no illness.',
            power: 50, qiCost: 35, difficulty: 8
        }
    ];

    function initTechniques() {
        const grid = $('.techniques-grid');
        if (!grid) return;

        techniquesData.forEach((tech, index) => {
            const card = document.createElement('div');
            card.className = 'technique-card';
            card.dataset.category = tech.category;
            card.style.animationDelay = `${index * 0.08}s`;

            card.innerHTML = `
                <span class="tech-category ${tech.category}">${tech.category}</span>
                <h3 class="tech-name-cn">${tech.nameCn}</h3>
                <h4 class="tech-name-en">${tech.nameEn}</h4>
                <p class="tech-desc">${tech.desc}</p>
                <div class="tech-stats">
                    <div class="tech-stat">
                        <span class="tech-stat-label">威力 Power</span>
                        <span class="tech-stat-value">${tech.power}</span>
                    </div>
                    <div class="tech-stat">
                        <span class="tech-stat-label">耗氣 Qi</span>
                        <span class="tech-stat-value">${tech.qiCost}</span>
                    </div>
                    <div class="tech-stat">
                        <span class="tech-stat-label">難度 Diff</span>
                        <span class="tech-stat-value">${tech.difficulty}</span>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        // Filter functionality
        const filterBtns = $$('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const cards = $$('.technique-card');
                cards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Add scroll animation observer for technique cards
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        $$('.technique-card').forEach(card => {
            card.classList.add('scroll-fade-in');
            observer.observe(card);
        });
    }

    /* --------------------------------------------------------
       PATH CARD INTERACTIONS
       -------------------------------------------------------- */

    function initPathCards() {
        const cards = $$('.path-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = 'rgba(194, 58, 34, 0.3)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.borderColor = 'rgba(192, 180, 152, 0.5)';
            });

            card.addEventListener('click', () => {
                const path = card.dataset.path;
                const section = document.getElementById('section-skilltree');
                if (section && path) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /* --------------------------------------------------------
       INK SPLASH ON CLICK
       -------------------------------------------------------- */

    function initInkSplashOnClick() {
        document.addEventListener('click', (e) => {
            // Don't create splashes on interactive elements
            if (e.target.closest('button') ||
                e.target.closest('a') ||
                e.target.closest('.node-circle') ||
                e.target.closest('.acupoint') ||
                e.target.closest('.skill-detail-panel') ||
                e.target.closest('.filter-btn')) {
                return;
            }

            const splash = document.createElement('div');
            const size = rand(10, 30);
            splash.style.cssText = `
                position: fixed;
                left: ${e.clientX - size / 2}px;
                top: ${e.clientY - size / 2}px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(26,26,26,0.15) 0%, transparent 70%);
                pointer-events: none;
                z-index: 9999;
                animation: inkClickExpand 0.8s ease-out forwards;
            `;

            document.body.appendChild(splash);

            setTimeout(() => {
                splash.remove();
            }, 800);
        });

        // Add the keyframe dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes inkClickExpand {
                0% { transform: scale(0); opacity: 0.6; }
                100% { transform: scale(3); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /* --------------------------------------------------------
       SMOOTH SCROLL UNROLLING EFFECT
       -------------------------------------------------------- */

    function initScrollUnroll() {
        const scrollWrapper = document.querySelector('.scroll-wrapper');
        if (!scrollWrapper) return;

        let lastScrollY = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const direction = scrollY > lastScrollY ? 'down' : 'up';
                    lastScrollY = scrollY;

                    // Subtle scale effect on scroll
                    const scrollPercent = Math.min(scrollY / 500, 1);
                    const scale = 1 - scrollPercent * 0.02;
                    const opacity = 1 - scrollPercent * 0.1;

                    // Apply subtle transform to the scroll wrapper for unroll feel
                    if (scrollPercent < 1) {
                        scrollWrapper.style.opacity = Math.max(0.85, opacity).toString();
                    } else {
                        scrollWrapper.style.opacity = '';
                    }

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* --------------------------------------------------------
       TYPOGRAPHY ENHANCEMENT — Character reveal
       -------------------------------------------------------- */

    function initTypographyEnhancement() {
        // Add hover effect to Chinese text characters
        const dropCaps = $$('.drop-cap');

        dropCaps.forEach(cap => {
            cap.addEventListener('mouseenter', () => {
                cap.style.transition = 'transform 0.3s var(--ease-silk), color 0.3s';
                cap.style.transform = 'scale(1.2)';
                cap.style.color = '#8b1a1a';
            });

            cap.addEventListener('mouseleave', () => {
                cap.style.transform = 'scale(1)';
                cap.style.color = '';
            });
        });
    }

    /* --------------------------------------------------------
       DYNAMIC MOUSE CURSOR TRAIL (subtle ink effect)
       -------------------------------------------------------- */

    function initCursorTrail() {
        const trail = [];
        const trailLength = 5;

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                width: ${4 - i * 0.6}px;
                height: ${4 - i * 0.6}px;
                border-radius: 50%;
                background: rgba(26, 26, 26, ${0.08 - i * 0.012});
                pointer-events: none;
                z-index: 9998;
                transition: left ${0.1 + i * 0.05}s ease-out, top ${0.1 + i * 0.05}s ease-out;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }

        let mouseX = 0;
        let mouseY = 0;
        let ticking = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!ticking) {
                requestAnimationFrame(() => {
                    trail.forEach((dot, i) => {
                        const delay = i * 30;
                        setTimeout(() => {
                            dot.style.left = `${mouseX - (4 - i * 0.6) / 2}px`;
                            dot.style.top = `${mouseY - (4 - i * 0.6) / 2}px`;
                        }, delay);
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* --------------------------------------------------------
       INTERSECTION OBSERVER FOR SECTION ANIMATIONS
       -------------------------------------------------------- */

    function initSectionObserver() {
        const sections = $$('.scroll-section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    /* --------------------------------------------------------
       KEYBOARD NAVIGATION
       -------------------------------------------------------- */

    function initKeyboardNav() {
        const sections = Array.from($$('.scroll-section'));
        let currentIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, sections.length - 1);
                sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                sections[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    /* --------------------------------------------------------
       INITIALIZE EVERYTHING
       -------------------------------------------------------- */

    document.addEventListener('DOMContentLoaded', () => {
        initLoadingScreen();
        initInkParticles();
        initParallax();
        initScrollProgress();
        initSealNavigation();
        initScrollAnimations();
        initYinYang();
        initSkillTree();
        initMeridianFlow();
        initTechniques();
        initPathCards();
        initInkSplashOnClick();
        initScrollUnroll();
        initTypographyEnhancement();
        initCursorTrail();
        initSectionObserver();
        initKeyboardNav();
    });

})();