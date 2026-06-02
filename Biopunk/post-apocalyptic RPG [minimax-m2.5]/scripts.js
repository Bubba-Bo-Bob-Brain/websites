(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', init);
    
    function init() {
        initParticles();
        initCounters();
        initScrollEffects();
        initNav();
        initCards();
        initTrees();
        initMap();
        initScrollLinks();
        initTooltips();
        initAmbient();
        initCTA();
        initAccessibility();
        initReducedMotion();
        initLoadSequence();
    }
    
    function initParticles() {
        var field = document.querySelector('.hero-particle-field');
        if (!field) return;
        var colors = ['#00f5d4', '#f72585', '#7ae582'];
        for (var i = 0; i < 30; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 15 + 's';
            p.style.animationDuration = (15 + Math.random() * 10) + 's';
            var size = Math.random() * 4 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            field.appendChild(p);
        }
    }
    
    function initCounters() {
        var stats = document.querySelectorAll('.stat-value[data-count]');
        if (!stats.length) return;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var target = entry.target;
                    var count = parseInt(target.getAttribute('data-count'));
                    animateCounter(target, count);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        stats.forEach(function(stat) { observer.observe(stat); });
    }
    
    function animateCounter(el, target) {
        var current = 0;
        var duration = 2000;
        var increment = target / (duration / 16);
        var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    function initScrollEffects() {
        var elements = document.querySelectorAll('.mutation-card, .tech-tree, .survival-card, .section-header');
        if (!elements.length) return;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        elements.forEach(function(el) {
            el.classList.add('fade-in');
            observer.observe(el);
        });
        var bars = document.querySelectorAll('.stat-fill');
        var barObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var fill = entry.target.style.getPropertyValue('--fill');
                    entry.target.style.width = fill;
                    barObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        bars.forEach(function(bar) { barObs.observe(bar); });
    }
    
    function initNav() {
        var nav = document.querySelector('.bio-nav');
        if (!nav) return;
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });
        var links = document.querySelectorAll('.nav-link');
        links.forEach(function(link) {
            link.addEventListener('mouseenter', function() { link.style.textShadow = '0 0 10px #00f5d4'; });
            link.addEventListener('mouseleave', function() { link.style.textShadow = 'none'; });
        });
    }
    
    function initCards() {
        var cards = document.querySelectorAll('.mutation-card');
        var colors = { 'tier-1': '#9a9890', 'tier-2': '#00f5d4', 'tier-3': '#f72585', 'tier-4': '#ffd166' };
        cards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                var tier = card.querySelector('.mutation-tier');
                if (tier && tier.classList[1]) {
                    card.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 30px ' + colors[tier.classList[1]] + '33';
                }
            });
            card.addEventListener('mouseleave', function() { card.style.boxShadow = ''; });
        });
    }
    
    function initTrees() {
        var trees = document.querySelectorAll('.tech-tree');
        var data = {
            'combat-root': { name: 'Enhanced Reflexes' },
            'combat-1a': { name: 'Muscle Fibers' },
            'combat-1b': { name: 'Bone Spikes' },
            'combat-2a': { name: 'Adrenaline Surge' },
            'combat-2b': { name: 'Venom Glands' },
            'combat-ult': { name: 'APEX PREDATOR' },
            'survival-root': { name: 'Toxin Filter' },
            'survival-1a': { name: 'Radiation Shield' },
            'survival-1b': { name: 'Night Vision' },
            'survival-2a': { name: 'Filter Membranes' },
            'survival-2b': { name: 'Thermal Sensing' },
            'survival-ult': { name: 'BIOCONTAINMENT' },
            'mutation-root': { name: 'Plasmids Active' },
            'mutation-1a': { name: 'DNA Flexible' },
            'mutation-1b': { name: 'Cell Division' },
            'mutation-2a': { name: 'Gene Splicing' },
            'mutation-2b': { name: 'Organic Growth' },
            'mutation-ult': { name: 'TRANSCENDENCE' }
        };
        trees.forEach(function(tree) {
            var nodes = tree.querySelectorAll('.tree-node');
            nodes.forEach(function(node) {
                node.addEventListener('mouseenter', function() {
                    var id = node.getAttribute('data-node');
                    if (data[id]) node.style.setProperty('--node-hovered', 'true');
                });
                node.addEventListener('mouseleave', function() {
                    node.style.setProperty('--node-hovered', 'false');
                });
            });
        });
        setTimeout(function() {
            var conns = document.querySelectorAll('.connection');
            conns.forEach(function(c, i) { c.style.animationDelay = (i * 0.1) + 's'; });
        }, 500);
    }
    
    function initMap() {
        var markers = document.querySelectorAll('.zone-marker');
        var zoneData = {
            'neural': { threat: 'EXTREME', contamination: 'Neural Parasites', species: 'Husk Swarm', resources: 'Cyber Components', gear: 'Neural Dampeners' },
            'chemical': { threat: 'HIGH', contamination: 'Acidic Compound', species: 'Chemical Beasts', resources: 'Acid Proof Mats', gear: 'Hazmat Suit +' },
            'bio': { threat: 'HIGH', contamination: 'Organic Spores', species: 'Hive Mind Collective', resources: 'Bio-Matter', gear: 'Spore Mask' },
            'radiation': { threat: 'EXTREME', contamination: 'Gamma Radiation', species: 'Radiated Giants', resources: 'Nuclear Materials', gear: 'Lead Lining' }
        };
        var threatColors = { 'LOW': '#7ae582', 'MEDIUM': '#ffd166', 'HIGH': '#f72585', 'EXTREME': '#ff6b6b' };
        markers.forEach(function(m) {
            m.addEventListener('mouseenter', function() {
                var zone = m.getAttribute('data-zone');
                var d = zoneData[zone];
                if (d) {
                    document.getElementById('threat-level').textContent = d.threat;
                    document.getElementById('threat-level').style.color = threatColors[d.threat];
                    document.getElementById('contamination-type').textContent = d.contamination;
                    document.getElementById('dominant-species').textContent = d.species;
                    document.getElementById('resources').textContent = d.resources;
                    document.getElementById('gear').textContent = d.gear;
                    var c = m.querySelector('.zone-circle');
                    if (c) c.style.strokeWidth = '4';
                }
            });
            m.addEventListener('mouseleave', function() {
                var c = m.querySelector('.zone-circle');
                if (c) c.style.strokeWidth = '2';
            });
        });
        var spawn = document.querySelector('.spawn-marker');
        if (spawn) {
            setInterval(function() { spawn.style.opacity = spawn.style.opacity === '0.5' ? '1' : '0.5'; }, 1000);
        }
    }
    
    function initScrollLinks() {
        var anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                var t = document.querySelector(this.getAttribute('href'));
                if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }
    
    function initTooltips() {
        var style = document.createElement('style');
        style.textContent = '.tree-tooltip{position:absolute;background:#1e1e24;border:1px solid #00f5d4;border-radius:8px;padding:16px;max-width:250px;z-index:100;pointer-events:none;opacity:0;transition:opacity .3s}.tree-tooltip.visible{opacity:1}.tooltip-title{font-family:"Chakra Petch",sans-serif;font-size:14px;font-weight:600;color:#e8e6e3;margin-bottom:8px}.tooltip-desc{font-size:12px;color:#9a9890;line-height:1.5}';
        document.head.appendChild(style);
        var tip = document.createElement('div');
        tip.className = 'tree-tooltip';
        tip.innerHTML = '<div class="tooltip-title"></div><div class="tooltip-desc"></div>';
        document.body.appendChild(tip);
        var nodes = document.querySelectorAll('.tree-node');
        var desc = { 'root': 'Starting ability', 'tier-1': 'First tier upgrade', 'tier-2': 'Advanced upgrade', 'ultimate': 'Final mastery' };
        nodes.forEach(function(n) {
            n.addEventListener('mouseenter', function(e) {
                var name = n.querySelector('.node-name').textContent;
                tip.querySelector('.tooltip-title').textContent = name;
                var tier = n.classList.contains('root') ? 'root' : n.classList.contains('tier-2') ? 'tier-2' : n.classList.contains('tier-3') ? 'ultimate' : 'tier-1';
                tip.querySelector('.tooltip-desc').textContent = desc[tier];
                tip.style.left = (e.pageX + 20) + 'px';
                tip.style.top = (e.pageY - 20) + 'px';
                tip.classList.add('visible');
            });
            n.addEventListener('mousemove', function(e) {
                tip.style.left = (e.pageX + 20) + 'px';
                tip.style.top = (e.pageY - 20) + 'px';
            });
            n.addEventListener('mouseleave', function() { tip.classList.remove('visible'); });
        });
    }
    
    function initAmbient() {
        var glows = document.querySelectorAll('.mutation-glow, .bio-glow-organ');
        glows.forEach(function(g) {
            setInterval(function() { g.style.opacity = 0.3 + Math.random() * 0.7; }, 100 + Math.random() * 200);
        });
        var veins = document.querySelectorAll('.vein');
        veins.forEach(function(v, i) {
            v.style.animationDelay = (i * 2) + 's';
            v.style.animationDuration = (8 + Math.random() * 4) + 's';
        });
    }
    
    function initCTA() {
        var btn = document.querySelector('.cta-button');
        if (!btn) return;
        btn.addEventListener('click', function() {
            var p = document.createElement('div');
            p.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;background:#00f5d4;border-radius:50%;pointer-events:none;animation:ctaExplode 1s ease-out forwards';
            btn.appendChild(p);
            setTimeout(function() { p.remove(); }, 1000);
            var s = document.createElement('style');
            s.textContent = '@keyframes ctaExplode{0%{width:10px;height:10px;opacity:1}100%{width:500px;height:500px;opacity:0}}';
            document.head.appendChild(s);
            setTimeout(function() {
                var m = document.getElementById('mutations');
                if (m) m.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
    }
    
    function initAccessibility() {
        document.addEventListener('keydown', function(e) { if (e.key === 'Tab') document.body.classList.add('keyboard-navigation'); });
        document.addEventListener('mousedown', function() { document.body.classList.remove('keyboard-navigation'); });
    }
    
    function initReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            var s = document.createElement('style');
            s.textContent = '*{animation:none!important;transition:none!important}';
            document.head.appendChild(s);
        }
    }
    
    function initLoadSequence() {
        window.addEventListener('load', function() {
            document.body.classList.add('loaded');
            var sections = document.querySelectorAll('.section');
            sections.forEach(function(sec, i) {
                sec.style.opacity = '0';
                sec.style.transform = 'translateY(20px)';
                setTimeout(function() {
                    sec.style.transition = 'all 0.8s ease';
                    sec.style.opacity = '1';
                    sec.style.transform = 'translateY(0)';
                }, i * 200);
            });
        });
    }
})();