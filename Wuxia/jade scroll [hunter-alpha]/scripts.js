/* ============================================
   玄武真經 — The Mysterious Martial Sutra
   Interactive JavaScript
   ============================================ */

(function() {
    'use strict';

    // === State ===
    const state = {
        currentSection: 'scroll-prologue',
        currentTree: 'water',
        isLoaded: false,
        scrollY: 0
    };

    // === Skill Data ===
    const skillData = {
        'water-1': {
            name: '靜心訣',
            nameEn: 'Calm Heart Mantra',
            desc: '入門心法，修煉內心寧靜。通過調息冥想，培養水之柔韌，為後續修行奠定基礎。心若止水，方能洞察萬物。',
            stats: { '內力': 20, '心性': 80, '根基': 90 }
        },
        'water-2a': {
            name: '碧波掌',
            nameEn: 'Azure Wave Palm',
            desc: '以掌代波，連綿不絕。每一掌都如水波般層層推進，看似柔和卻蘊含深沉內力，可化解敵人剛猛之力。',
            stats: { '剛猛': 30, '柔韌': 85, '速度': 60 }
        },
        'water-2b': {
            name: '流水步',
            nameEn: 'Flowing Water Step',
            desc: '身法如流水，隨形就勢。步法輕盈飄忽，可隨敵人攻擊方向自然流轉，使敵人攻擊落空。',
            stats: { '身法': 85, '閃避': 80, '內力': 40 }
        },
        'water-3a': {
            name: '漩渦功',
            nameEn: 'Vortex Art',
            desc: '將內力化為漩渦，可吸附敵人攻擊並反彈。修煉至高深處，能形成無形氣場，令敵人難以近身。',
            stats: { '防禦': 75, '吸收': 70, '控制': 85 }
        },
        'water-3b': {
            name: '寒冰勁',
            nameEn: 'Frost Force',
            desc: '陰寒內勁，可凍結敵人經脈。掌力帶有寒氣，中者手腳僵硬，內力運轉遲緩，實戰中極為可怕。',
            stats: { '攻擊': 70, '控制': 90, '特效': 85 }
        },
        'water-3c': {
            name: '潮汐劍',
            nameEn: 'Tidal Sword',
            desc: '劍法如潮汐漲落，有進有退。劍勢時而洶湧澎湃，時而悄然退去，令敵人無從捉摸。',
            stats: { '劍法': 85, '變化': 90, '速度': 75 }
        },
        'water-4': {
            name: '無量水經',
            nameEn: 'Boundless Water Scripture',
            desc: '水道最高心法。修煉者如水之無形，可化為萬形。內力生生不息，無窮無盡。達到此境界者，已臻水之大道。',
            stats: { '內力': 100, '變化': 100, '境界': 100 }
        },
        'earth-1': {
            name: '磐石功',
            nameEn: 'Bedrock Art',
            desc: '土道基礎心法。通過站樁冥想，培養穩固根基。如磐石般堅定，不受外物動搖。',
            stats: { '防禦': 70, '根基': 90, '耐力': 80 }
        },
        'earth-2a': {
            name: '鐵壁拳',
            nameEn: 'Iron Wall Fist',
            desc: '剛猛拳法，以守為攻。拳勢沉穩厚重，每一拳都如鐵壁般堅不可摧。',
            stats: { '剛猛': 85, '防禦': 80, '速度': 40 }
        },
        'earth-2b': {
            name: '山岳步',
            nameEn: 'Mountain Stance',
            desc: '穩如泰山的步法。雖不如他派輕功迅捷，但穩固無比，任敵人如何攻擊都難以撼動。',
            stats: { '穩固': 95, '閃避': 30, '防禦': 85 }
        },
        'earth-3a': {
            name: '金鐘罩',
            nameEn: 'Golden Bell Shield',
            desc: '至高防禦功法。修煉者體表形成無形護罩，刀槍不入。修煉至大成，可硬接利刃而不傷。',
            stats: { '防禦': 100, '內力': 70, '耐力': 90 }
        },
        'earth-3b': {
            name: '地裂掌',
            nameEn: 'Earth Split Palm',
            desc: '剛猛無匹的掌法。一掌擊出，可震裂大地。將內力集中於掌心，瞬間爆發，威力驚人。',
            stats: { '剛猛': 95, '爆發': 85, '內力': 80 }
        },
        'earth-3c': {
            name: '剛體術',
            nameEn: 'Adamantine Body',
            desc: '強化肉體的秘法。修煉者筋骨如鐵，肌肉如鋼。可承受巨大傷害而不倒。',
            stats: { '體魄': 100, '防禦': 90, '恢復': 70 }
        },
        'earth-4': {
            name: '不動明王',
            nameEn: 'Immovable Wisdom King',
            desc: '土道最高境界。修煉者如不動明王般屹立不倒，萬法不侵。已達土之大道的至高境界。',
            stats: { '防禦': 100, '境界': 100, '威能': 100 }
        },
        'fire-1': {
            name: '炎心訣',
            nameEn: 'Flame Heart',
            desc: '火道基礎心法。點燃內心之火，培養剛猛之氣。修煉者氣血旺盛，攻擊帶有灼熱之感。',
            stats: { '攻擊': 60, '氣血': 70, '熱力': 75 }
        },
        'fire-2a': {
            name: '爆炎拳',
            nameEn: 'Burst Flame Fist',
            desc: '剛猛拳法，拳出如爆炎。每一拳都蘊含灼熱內力，中者如被烈火焚燒。',
            stats: { '剛猛': 90, '速度': 70, '熱力': 85 }
        },
        'fire-2b': {
            name: '疾火步',
            nameEn: 'Rapid Fire Step',
            desc: '迅捷如火的步法。移動時如火焰跳躍，忽左忽右，難以捉摸。',
            stats: { '速度': 90, '身法': 85, '爆發': 75 }
        },
        'fire-3a': {
            name: '烈焰斬',
            nameEn: 'Inferno Slash',
            desc: '以氣化刃，斬出烈焰。攻擊範圍廣，威力強大，可將敵人焚為灰燼。',
            stats: { '攻擊': 95, '範圍': 80, '熱力': 90 }
        },
        'fire-3b': {
            name: '太陽勁',
            nameEn: 'Solar Force',
            desc: '至陽內勁，如烈日當空。修煉者內力熾熱無比，可灼傷近身敵人。',
            stats: { '內力': 90, '熱力': 95, '威壓': 85 }
        },
        'fire-3c': {
            name: '焚天掌',
            nameEn: 'Heaven Scorch Palm',
            desc: '掌力可焚天滅地。一掌擊出，熱浪滾滾，方圓數丈內草木皆枯。',
            stats: { '剛猛': 95, '熱力': 100, '內力': 85 }
        },
        'fire-4': {
            name: '鳳凰涅槃',
            nameEn: 'Phoenix Nirvana',
            desc: '火道最高境界。修煉者如鳳凰浴火重生，攻擊時浴火焚身，威力無窮。已達火之大道。',
            stats: { '攻擊': 100, '境界': 100, '重生': 100 }
        },
        'wind-1': {
            name: '御風術',
            nameEn: 'Wind Riding',
            desc: '風道基礎心法。感受風之流動，培養輕盈之氣。修煉者身輕如燕，步履如風。',
            stats: { '身法': 70, '速度': 65, '輕功': 75 }
        },
        'wind-2a': {
            name: '幻影步',
            nameEn: 'Phantom Step',
            desc: '飄忽不定的步法。移動時如幻影般難以捉摸，敵人尚未反應，身形已換。',
            stats: { '速度': 90, '身法': 95, '閃避': 85 }
        },
        'wind-2b': {
            name: '風刃掌',
            nameEn: 'Wind Blade Palm',
            desc: '以掌帶風，化風為刃。掌風如刀，可隔空傷人，無形無相。',
            stats: { '攻擊': 75, '速度': 85, '範圍': 70 }
        },
        'wind-3a': {
            name: '雷鳴斬',
            nameEn: 'Thunder Slash',
            desc: '快如閃電的斬擊。攻擊時帶有雷鳴之聲，速度之快，敵人難以抵擋。',
            stats: { '速度': 100, '攻擊': 85, '爆發': 90 }
        },
        'wind-3b': {
            name: '無形劍',
            nameEn: 'Formless Sword',
            desc: '以氣化劍，無形無相。劍氣如風，無處不在。敵人尚未見劍，已被劍氣所傷。',
            stats: { '劍法': 90, '速度': 95, '變化': 85 }
        },
        'wind-3c': {
            name: '旋風腿',
            nameEn: 'Cyclone Kick',
            desc: '腿法如旋風，連環不斷。踢出時帶起旋風，可同時攻擊多名敵人。',
            stats: { '腿法': 90, '速度': 85, '範圍': 80 }
        },
        'wind-4': {
            name: '天外飛仙',
            nameEn: 'Celestial Immortal',
            desc: '風道最高境界。修煉者如天外飛仙，來去無蹤，神龍見首不見尾。已達風之大道。',
            stats: { '速度': 100, '境界': 100, '飄渺': 100 }
        },
        'void-1': {
            name: '空明訣',
            nameEn: 'Empty Clarity',
            desc: '虛道基礎心法。修煉空靈之心，體悟虛無之理。心無掛礙，方能觸摸大道。',
            stats: { '心性': 80, '悟性': 75, '空靈': 70 }
        },
        'void-2a': {
            name: '虛無掌',
            nameEn: 'Void Palm',
            desc: '看似無招，實則有招。掌法空靈飄忽，不著痕跡。敵人難以預判攻擊方向。',
            stats: { '變化': 90, '迷惑': 85, '攻擊': 70 }
        },
        'void-2b': {
            name: '鏡花步',
            nameEn: 'Mirror Flower Step',
            desc: '如鏡中花、水中月，虛實難辨。步法迷惑敵人，令其攻擊屢屢落空。',
            stats: { '身法': 85, '迷惑': 90, '閃避': 80 }
        },
        'void-3a': {
            name: '意念劍',
            nameEn: 'Mind Sword',
            desc: '以意御劍，心念所至，劍氣即達。不需實體之劍，僅憑意念即可傷敵。',
            stats: { '意念': 95, '攻擊': 80, '速度': 90 }
        },
        'void-3b': {
            name: '化境功',
            nameEn: 'Transcendence Art',
            desc: '超脫物外的心法。修煉者可短暫進入化境，實力倍增，無視一切外在限制。',
            stats: { '境界': 90, '全能': 85, '時間': 60 }
        },
        'void-3c': {
            name: '夢蝶掌',
            nameEn: 'Dream Butterfly Palm',
            desc: '如莊周夢蝶，虛實難分。掌法如夢似幻，中者如墜夢境，難以自拔。',
            stats: { '迷惑': 95, '控制': 90, '攻擊': 75 }
        },
        'void-4': {
            name: '大道無形',
            nameEn: 'The Formless Dao',
            desc: '虛道最高境界。大道無形，生育天地。修煉者已超脫有形之限，與道合一。萬法歸宗。',
            stats: { '境界': 100, '大道': 100, '無極': 100 }
        }
    };

    // === DOM Elements ===
    const elements = {};

    function cacheElements() {
        elements.inkSplash = document.getElementById('inkSplash');
        elements.inkParticles = document.getElementById('inkParticles');
        elements.sealNav = document.getElementById('sealNav');
        elements.scrollContainer = document.getElementById('scrollContainer');
        elements.scrollProgress = document.getElementById('scrollProgress');
        elements.scrollProgressFill = document.getElementById('scrollProgressFill');
        elements.skillTreeCanvas = document.getElementById('skillTreeCanvas');
        elements.skillDetailPanel = document.getElementById('skillDetailPanel');
        elements.skillDetailName = document.getElementById('skillDetailName');
        elements.skillDetailNameEn = document.getElementById('skillDetailNameEn');
        elements.skillDetailDesc = document.getElementById('skillDetailDesc');
        elements.skillDetailStats = document.getElementById('skillDetailStats');
        elements.meridianCanvas = document.getElementById('meridianCanvas');
        elements.qiParticles = document.getElementById('qiParticles');
    }

    // === Initialization ===
    function init() {
        cacheElements();
        playInkSplash();
        createInkParticles();
        setupScrollListeners();
        setupNavigation();
        setupPathSelector();
        setupSkillNodes();
        setupSkillDetailClose();
        drawSkillTreeLines();
        drawMeridianFigure();
        startQiAnimation();
        revealOnScroll();
    }

    // === Ink Splash Transition ===
    function playInkSplash() {
        setTimeout(() => {
            elements.inkSplash.classList.add('active');
        }, 100);

        setTimeout(() => {
            elements.inkSplash.classList.add('fade-out');
        }, 800);

        setTimeout(() => {
            elements.inkSplash.style.display = 'none';
            state.isLoaded = true;
        }, 2200);
    }

    // === Floating Ink Particles ===
    function createInkParticles() {
        const container = elements.inkParticles;
        const count = 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'ink-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }

    // === Scroll Listeners ===
    function setupScrollListeners() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            state.scrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateScrollProgress();
                    updateActiveSection();
                    revealOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    function updateScrollProgress() {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (state.scrollY / docHeight) * 100;
        elements.scrollProgressFill.style.width = progress + '%';
    }

    function updateActiveSection() {
        const sections = document.querySelectorAll('.scroll-section');
        let currentSection = sections[0].id;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.4) {
                currentSection = section.id;
            }
        });

        if (currentSection !== state.currentSection) {
            state.currentSection = currentSection;
            updateNavigation();
        }
    }

    function updateNavigation() {
        const stamps = elements.sealNav.querySelectorAll('.seal-stamp');
        stamps.forEach(stamp => {
            stamp.classList.remove('active');
            if (stamp.dataset.section === state.currentSection) {
                stamp.classList.add('active');
            }
        });
    }

    // === Reveal on Scroll ===
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal-text, .reveal-card');

        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            const threshold = window.innerHeight * 0.85;

            if (rect.top < threshold) {
                el.classList.add('visible');
            }
        });
    }

    // === Navigation ===
    function setupNavigation() {
        const stamps = elements.sealNav.querySelectorAll('.seal-stamp');

        stamps.forEach(stamp => {
            stamp.addEventListener('click', () => {
                const targetId = stamp.dataset.section;
                const target = document.getElementById(targetId);

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // === Path Selector ===
    function setupPathSelector() {
        const buttons = document.querySelectorAll('.path-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tree = btn.dataset.tree;
                switchSkillTree(tree);

                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    function switchSkillTree(treeName) {
        const trees = document.querySelectorAll('.skill-tree');

        trees.forEach(tree => {
            tree.classList.remove('active');
            if (tree.dataset.tree === treeName) {
                tree.classList.add('active');
            }
        });

        state.currentTree = treeName;
        drawSkillTreeLines();
    }

    // === Skill Tree Lines (Canvas) ===
    function drawSkillTreeLines() {
        const canvas = elements.skillTreeCanvas;
        if (!canvas) return;

        const wrapper = canvas.parentElement;
        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const activeTree = document.querySelector('.skill-tree.active');
        if (!activeTree) return;

        const nodes = activeTree.querySelectorAll('.skill-node');
        const nodePositions = [];

        nodes.forEach(node => {
            const circle = node.querySelector('.node-circle');
            const rect = circle.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();

            nodePositions.push({
                x: rect.left - wrapperRect.left + rect.width / 2,
                y: rect.top - wrapperRect.top + rect.height / 2,
                tier: parseInt(node.dataset.tier),
                pos: node.dataset.pos
            });
        });

        // Draw connections
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // Connect tiers
        const tiers = [[], [], [], []];
        nodePositions.forEach(pos => {
            tiers[pos.tier - 1].push(pos);
        });

        for (let i = 0; i < tiers.length - 1; i++) {
            const currentTier = tiers[i];
            const nextTier = tiers[i + 1];

            currentTier.forEach(from => {
                nextTier.forEach(to => {
                    ctx.beginPath();
                    ctx.moveTo(from.x, from.y);

                    // Curved line
                    const midY = (from.y + to.y) / 2;
                    ctx.bezierCurveTo(from.x, midY, to.x, midY, to.x, to.y);
                    ctx.stroke();
                });
            });
        }
    }

    // === Skill Nodes ===
    function setupSkillNodes() {
        document.addEventListener('click', (e) => {
            const node = e.target.closest('.skill-node');
            if (node) {
                const skillId = node.dataset.skill;
                showSkillDetail(skillId);
            }
        });
    }

    function showSkillDetail(skillId) {
        const data = skillData[skillId];
        if (!data) return;

        elements.skillDetailName.textContent = data.name;
        elements.skillDetailNameEn.textContent = data.nameEn;
        elements.skillDetailDesc.textContent = data.desc;

        // Build stats
        let statsHTML = '';
        for (const [label, value] of Object.entries(data.stats)) {
            statsHTML += `
                <div class="stat">
                    <span class="stat-label">${label}</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="--fill: ${value}%"></div>
                    </div>
                </div>
            `;
        }
        elements.skillDetailStats.innerHTML = statsHTML;

        elements.skillDetailPanel.classList.add('active');
    }

    function setupSkillDetailClose() {
        const closeBtn = document.querySelector('.skill-detail-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                elements.skillDetailPanel.classList.remove('active');
            });
        }

        elements.skillDetailPanel.addEventListener('click', (e) => {
            if (e.target === elements.skillDetailPanel) {
                elements.skillDetailPanel.classList.remove('active');
            }
        });
    }

    // === Meridian Figure (Canvas) ===
    function drawMeridianFigure() {
        const canvas = elements.meridianCanvas;
        if (!canvas) return;

        const wrapper = canvas.parentElement;
        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;

        ctx.clearRect(0, 0, w, h);

        // Draw body silhouette
        ctx.strokeStyle = 'rgba(42, 37, 32, 0.2)';
        ctx.lineWidth = 2;

        // Head
        ctx.beginPath();
        ctx.ellipse(cx, h * 0.08, w * 0.08, h * 0.06, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.12, h * 0.15);
        ctx.lineTo(cx - w * 0.15, h * 0.35);
        ctx.lineTo(cx - w * 0.2, h * 0.6);
        ctx.lineTo(cx - w * 0.15, h * 0.95);
        ctx.moveTo(cx + w * 0.12, h * 0.15);
        ctx.lineTo(cx + w * 0.15, h * 0.35);
        ctx.lineTo(cx + w * 0.2, h * 0.6);
        ctx.lineTo(cx + w * 0.15, h * 0.95);
        ctx.stroke();

        // Draw meridian lines
        const goldColor = 'rgba(201, 168, 76, 0.5)';
        const brownColor = 'rgba(139, 115, 85, 0.4)';

        // Central channel (Du Mai)
        ctx.strokeStyle = goldColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, h * 0.03);
        ctx.lineTo(cx, h * 0.12);
        ctx.lineTo(cx, h * 0.25);
        ctx.lineTo(cx, h * 0.45);
        ctx.lineTo(cx, h * 0.65);
        ctx.lineTo(cx, h * 0.85);
        ctx.lineTo(cx, h * 0.95);
        ctx.stroke();

        // Secondary channel (Ren Mai)
        ctx.strokeStyle = brownColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.04, h * 0.12);
        ctx.lineTo(cx - w * 0.05, h * 0.25);
        ctx.lineTo(cx - w * 0.06, h * 0.4);
        ctx.lineTo(cx - w * 0.05, h * 0.55);
        ctx.lineTo(cx - w * 0.04, h * 0.7);
        ctx.lineTo(cx - w * 0.03, h * 0.85);
        ctx.stroke();

        // Arm channels
        ctx.strokeStyle = goldColor;
        ctx.lineWidth = 2;

        // Left arm
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.08, h * 0.18);
        ctx.lineTo(cx - w * 0.25, h * 0.35);
        ctx.lineTo(cx - w * 0.35, h * 0.55);
        ctx.lineTo(cx - w * 0.38, h * 0.7);
        ctx.stroke();

        // Right arm
        ctx.beginPath();
        ctx.moveTo(cx + w * 0.08, h * 0.18);
        ctx.lineTo(cx + w * 0.25, h * 0.35);
        ctx.lineTo(cx + w * 0.35, h * 0.55);
        ctx.lineTo(cx + w * 0.38, h * 0.7);
        ctx.stroke();

        // Draw dantian point
        const dantianY = h * 0.45;

        // Glow effect
        const gradient = ctx.createRadialGradient(cx, dantianY, 0, cx, dantianY, 30);
        gradient.addColorStop(0, 'rgba(201, 168, 76, 0.6)');
        gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, dantianY, 30, 0, Math.PI * 2);
        ctx.fill();

        // Core point
        ctx.fillStyle = goldColor;
        ctx.beginPath();
        ctx.arc(cx, dantianY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw qi points
        const qiPoints = [
            { x: cx, y: h * 0.08 },
            { x: cx, y: h * 0.2 },
            { x: cx, y: h * 0.35 },
            { x: cx, y: h * 0.55 },
            { x: cx, y: h * 0.65 },
            { x: cx, y: h * 0.75 },
            { x: cx, y: h * 0.88 }
        ];

        ctx.fillStyle = 'rgba(201, 168, 76, 0.4)';
        qiPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // === Qi Animation ===
    function startQiAnimation() {
        const container = elements.qiParticles;
        if (!container) return;

        setInterval(() => {
            createQiParticle(container);
        }, 500);
    }

    function createQiParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'qi-particle';

        const centerX = 50;
        const offsetX = (Math.random() - 0.5) * 10;
        particle.style.left = (centerX + offsetX) + '%';
        particle.style.bottom = (10 + Math.random() * 80) + '%';
        particle.style.animationDuration = (2 + Math.random() * 2) + 's';
        particle.style.animationDelay = Math.random() * 0.5 + 's';

        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 4000);
    }

    // === Window Resize ===
    window.addEventListener('resize', () => {
        drawSkillTreeLines();
        drawMeridianFigure();
    });

    // === DOM Ready ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();