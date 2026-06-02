class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.inner = document.createElement('div');
        this.inner.className = 'custom-cursor-inner';
        document.body.appendChild(this.inner);
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            this.cursor.style.left = `${e.clientX}px`;
            this.cursor.style.top = `${e.clientY}px`;
            this.inner.style.left = `${e.clientX}px`;
            this.inner.style.top = `${e.clientY}px`;
        });

        document.querySelectorAll('a, button, select, .artifact-opt').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.width = '40px';
                this.cursor.style.height = '40px';
                this.cursor.style.borderColor = 'var(--color-teal)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.borderColor = 'var(--color-gold)';
            });
        });
    }
}

class SystemAudio {
    constructor() {
        this.ctx = null;
        this.ambientOsc = null;
        this.ambientGain = null;
        this.muted = true;
        this.btn = document.getElementById('ambient-audio-btn');
        this.setupEventListeners();
    }

    initContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.buildSynth();
        }
    }

    buildSynth() {
        this.ambientOsc = this.ctx.createOscillator();
        this.ambientGain = this.ctx.createGain();
        
        this.ambientOsc.type = 'sawtooth';
        this.ambientOsc.frequency.value = 55;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120;
        filter.Q.value = 5;

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 20;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        this.ambientOsc.connect(filter);
        filter.connect(this.ambientGain);
        this.ambientGain.connect(this.ctx.destination);
        
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientOsc.start();
    }

    toggle() {
        this.initContext();
        if (this.muted) {
            this.ctx.resume();
            this.ambientGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.5);
            this.btn.classList.remove('audio-muted');
            this.btn.querySelector('.control-label').textContent = 'MUTE FREQUENCIES';
            this.muted = false;
        } else {
            this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
            this.btn.classList.add('audio-muted');
            this.btn.querySelector('.control-label').textContent = 'UNMUTE AUDIO';
            this.muted = true;
        }
    }

    triggerBeep(freq, dur) {
        if (this.muted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
    }

    setupEventListeners() {
        this.btn.addEventListener('click', () => this.toggle());
        this.btn.classList.add('audio-muted');
    }
}

class ReliquaryViewer {
    constructor(audioSys) {
        this.audioSys = audioSys;
        this.container = document.getElementById('artifact-model-container');
        this.title = document.getElementById('artifact-title');
        this.origin = document.getElementById('artifact-origin');
        this.period = document.getElementById('artifact-period');
        this.classif = document.getElementById('artifact-class');
        this.desc = document.getElementById('artifact-desc');
        
        this.rotateLeftBtn = document.getElementById('rotate-left');
        this.rotateRightBtn = document.getElementById('rotate-right');
        this.toggleWireframeBtn = document.getElementById('toggle-wireframe');
        this.triggerScanBtn = document.getElementById('trigger-scan');
        this.viewer = document.querySelector('.reliquary-viewer');

        this.rotationY = 45;
        this.rotationX = -15;
        this.wireframeMode = false;
        this.currentArtifact = 'queen-idia';

        this.data = {
            'queen-idia': {
                title: 'Queen Idia Mask',
                origin: 'Kingdom of Benin (Nigeria)',
                period: '16th Century CE',
                classif: 'Quantum Memory Vessel',
                desc: 'A symbol of matriarchal power and tactical brilliance. Worn on the hip of the Oba (King) Esigie, this mask of his mother, Idia, represents cosmic protection, physical warfare intelligence, and spiritual guidance during critical military campaigns.',
                faces: 8
            },
            'golden-stool': {
                title: 'Sika Dwa Kofi (The Golden Stool)',
                origin: 'Asante Empire (Ghana)',
                period: '17th Century CE',
                classif: 'Divine Sovereign Soul-Anchor',
                desc: 'The ultimate repository of Asante statehood and spiritual essence. Conjured directly from the sky by High Priest Anokye, it houses Sunsum (the collective soul of the nation). In this digital realm, it radiates sovereign energy waves across virtual coordinates.',
                faces: 12
            },
            'lydenburg-head': {
                title: 'Lydenburg Head V',
                origin: 'Lydenburg (South Africa)',
                period: '500 CE',
                classif: 'Bio-Acoustic Resonance Core',
                desc: 'One of the earliest known clay artifacts of complex Iron Age sculptural artistry in Southern Africa. Serves as a cosmic resonator, transmitting acoustic frequencies of ancestor spirits through ritual and cybernetic systems.',
                faces: 6
            }
        };

        this.init();
    }

    init() {
        this.buildModel();
        this.setupEvents();
        this.startIdleRotation();
    }

    buildModel() {
        this.container.innerHTML = '';
        const numFaces = this.data[this.currentArtifact].faces;
        const radius = 90;

        for (let i = 0; i < numFaces; i++) {
            const face = document.createElement('div');
            face.className = 'model-face';
            
            const angle = (360 / numFaces) * i;
            const tilt = i % 2 === 0 ? 20 : -20;
            
            face.style.width = '60px';
            face.style.height = '140px';
            face.style.transform = `rotateY(${angle}deg) rotateX(${tilt}deg) translateZ(${radius}px)`;
            
            const innerEmblem = document.createElement('div');
            innerEmblem.style.border = '1px solid rgba(251, 192, 45, 0.4)';
            innerEmblem.style.width = '80%';
            innerEmblem.style.height = '80%';
            innerEmblem.style.display = 'flex';
            innerEmblem.style.alignItems = 'center';
            innerEmblem.style.justifyContent = 'center';
            innerEmblem.style.fontSize = '0.5rem';
            innerEmblem.textContent = `P-${i}`;
            
            face.appendChild(innerEmblem);
            this.container.appendChild(face);
        }
        
        this.updateModelTransforms();
    }

    updateModelTransforms() {
        this.container.style.transform = `rotateX(${this.rotationX}deg) rotateY(${this.rotationY}deg)`;
    }

    startIdleRotation() {
        setInterval(() => {
            if (!this.viewer.classList.contains('user-interacting')) {
                this.rotationY += 0.5;
                this.updateModelTransforms();
            }
        }, 30);
    }

    setupEvents() {
        document.querySelectorAll('.artifact-opt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.artifact-opt').forEach(o => o.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                this.currentArtifact = target.getAttribute('data-artifact');
                this.updateData();
                this.audioSys.triggerBeep(440, 0.2);
            });
        });

        this.rotateLeftBtn.addEventListener('click', () => {
            this.rotationY -= 30;
            this.updateModelTransforms();
            this.audioSys.triggerBeep(300, 0.1);
        });

        this.rotateRightBtn.addEventListener('click', () => {
            this.rotationY += 30;
            this.updateModelTransforms();
            this.audioSys.triggerBeep(300, 0.1);
        });

        this.toggleWireframeBtn.addEventListener('click', () => {
            this.wireframeMode = !this.wireframeMode;
            this.container.classList.toggle('model-wireframe-active', this.wireframeMode);
            this.audioSys.triggerBeep(600, 0.15);
        });

        this.triggerScanBtn.addEventListener('click', () => {
            this.viewer.classList.add('scan-active');
            this.audioSys.triggerBeep(880, 0.8);
            setTimeout(() => {
                this.viewer.classList.remove('scan-active');
            }, 2000);
        });
    }

    updateData() {
        const item = this.data[this.currentArtifact];
        this.title.textContent = item.title;
        this.origin.textContent = item.origin;
        this.period.textContent = item.period;
        this.classif.textContent = item.classif;
        this.desc.textContent = item.desc;
        this.buildModel();
    }
}

class GriotChamber {
    constructor(audioSys) {
        this.audioSys = audioSys;
        this.canvas = document.getElementById('griot-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.playBtn = document.getElementById('play-griot-btn');
        this.select = document.getElementById('history-select');
        this.textBox = document.getElementById('narrative-text');
        
        this.isPlaying = false;
        this.animationId = null;
        this.wavePhase = 0;

        this.narratives = {
            'dogon': "In the cosmic dark, Nommo spirits split the Sirius star network. Descending in ships built of solar wind, they calculated the weight of the invisible white dwarf, transferring its mathematical blueprint to the initiates of Earth's high plateaus.",
            'sundiata': "Mali arose as a gold-veined cybernetic node. Soundiata, structured with an immovable core, raised a magnetic shield over the Niger basin, routing generational memories through acoustic songsmithing.",
            'orisha': "Obatala poured golden dirt from a stellar shell. Climbing down chains of light into the dark ocean, he mapped cosmic geometries onto landmasses, creating a biological incubator for human experience."
        };

        this.init();
    }

    init() {
        this.drawVisualizer();
        this.playBtn.addEventListener('click', () => this.toggleTransmission());
    }

    drawVisualizer() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        this.ctx.strokeStyle = this.isPlaying ? 'rgba(0, 245, 255, 0.4)' : 'rgba(251, 192, 45, 0.2)';
        this.ctx.lineWidth = 1.5;

        for (let j = 0; j < 3; j++) {
            this.ctx.beginPath();
            const step = 0.05;
            const amp = this.isPlaying ? 25 + j * 10 : 8;
            const speed = this.isPlaying ? 0.08 : 0.02;

            for (let i = 0; i < Math.PI * 2; i += step) {
                const r = 100 + Math.sin(i * 6 + this.wavePhase + j) * amp;
                const x = w / 2 + Math.cos(i) * r;
                const y = h / 2 + Math.sin(i) * r;
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }

        this.wavePhase += this.isPlaying ? 0.05 : 0.01;
        this.animationId = requestAnimationFrame(() => this.drawVisualizer());
    }

    toggleTransmission() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.playBtn.querySelector('.btn-text').textContent = 'ACTIVATE TRANSMISSION';
            this.playBtn.classList.remove('btn-accent');
            this.audioSys.triggerBeep(300, 0.3);
        } else {
            this.isPlaying = true;
            this.playBtn.querySelector('.btn-text').textContent = 'HALT TRANSMISSION';
            this.playBtn.classList.add('btn-accent');
            this.audioSys.triggerBeep(700, 0.5);
            this.runNarrativeReveal();
        }
    }

    runNarrativeReveal() {
        const fullText = this.narratives[this.select.value];
        const words = fullText.split(' ');
        this.textBox.innerHTML = '';

        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'narrative-word';
            span.textContent = word + ' ';
            this.textBox.appendChild(span);
        });

        const spans = this.textBox.querySelectorAll('.narrative-word');
        let index = 0;

        const revealNextWord = () => {
            if (!this.isPlaying) return;
            if (index < spans.length) {
                spans[index].classList.add('revealed', 'glowing');
                this.audioSys.triggerBeep(600 + (index % 5) * 50, 0.08);
                
                setTimeout(() => {
                    if (spans[index]) spans[index].classList.remove('glowing');
                    index++;
                    revealNextWord();
                }, 180);
            } else {
                this.toggleTransmission();
            }
        };

        revealNextWord();
    }
}

class CosmicMap {
    constructor(audioSys) {
        this.audioSys = audioSys;
        this.canvas = document.getElementById('star-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.svg = document.getElementById('constellation-svg');
        this.starName = document.getElementById('star-name');
        this.starCoords = document.getElementById('star-coords');
        this.starLore = document.getElementById('star-lore');
        this.starEstablished = document.getElementById('star-established');
        this.starPop = document.getElementById('star-pop');

        this.stars = [
            { id: 1, name: 'Nommo Prime (Sirius B)', coords: 'RA 06h 45m / Dec -16°', x: 250, y: 150, r: 8, color: '#00f5ff', established: '3200 BCE', pop: '8.4 Billion', lore: 'Guarded by the Dogon people of Mali, who detailed the white dwarf\'s precise orbit, density, and existence centuries before modern telescope verification. Served as a central administrative node.' },
            { id: 2, name: 'Gidgiti Station (Orion Belt)', coords: 'RA 05h 36m / Dec -01°', x: 500, y: 300, r: 6, color: '#fbc02d', established: '2450 CE', pop: '2.1 Billion', lore: 'A modular trading nexus anchored to interstellar asteroids, decorated with neon patterns. It acts as the gateway to the deep interior regions of the galaxy.' },
            { id: 3, name: 'Kush-9 Core (Sagittarius A*)', coords: 'RA 17h 45m / Dec -29°', x: 750, y: 120, r: 12, color: '#ff5722', established: '6800 CE', pop: '14.5 Billion', lore: 'Located near the supermassive black hole. Relies on cosmic gravity-well energy harvesting. It serves as the deep database archive where galactic knowledge is safely recorded.' }
        ];

        this.init();
    }

    init() {
        this.resize();
        this.drawBackgroundStars();
        this.buildInteractiveNodes();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.drawBackgroundStars();
    }

    drawBackgroundStars() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 1.5;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    buildInteractiveNodes() {
        this.svg.innerHTML = '';
        
        let pathD = `M ${this.stars[0].x} ${this.stars[0].y} L ${this.stars[1].x} ${this.stars[1].y} L ${this.stars[2].x} ${this.stars[2].y}`;
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        polyline.setAttribute('d', pathD);
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', 'rgba(251, 192, 45, 0.2)');
        polyline.setAttribute('stroke-width', '1.5');
        polyline.setAttribute('stroke-dasharray', '5,5');
        this.svg.appendChild(polyline);

        this.stars.forEach(star => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.style.cursor = 'pointer';

            const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ring.setAttribute('cx', star.x);
            ring.setAttribute('cy', star.y);
            ring.setAttribute('r', star.r + 10);
            ring.setAttribute('fill', 'transparent');
            ring.setAttribute('stroke', star.color);
            ring.setAttribute('stroke-width', '1');
            ring.setAttribute('opacity', '0.4');
            ring.style.transition = 'transform 0.3s ease, opacity 0.3s';

            const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            core.setAttribute('cx', star.x);
            core.setAttribute('cy', star.y);
            core.setAttribute('r', star.r);
            core.setAttribute('fill', star.color);

            g.appendChild(ring);
            g.appendChild(core);

            g.addEventListener('mouseenter', () => {
                ring.setAttribute('transform', `matrix(1.5 0 0 1.5 ${-star.x * 0.5} ${-star.y * 0.5})`);
                ring.setAttribute('opacity', '1');
            });

            g.addEventListener('mouseleave', () => {
                ring.setAttribute('transform', 'none');
                ring.setAttribute('opacity', '0.4');
            });

            g.addEventListener('click', () => {
                this.selectStar(star);
            });

            this.svg.appendChild(g);
        });
    }

    selectStar(star) {
        this.starName.textContent = star.name;
        this.starCoords.textContent = star.coords;
        this.starLore.textContent = star.lore;
        this.starEstablished.textContent = star.established;
        this.starPop.textContent = star.pop;
        this.audioSys.triggerBeep(520, 0.25);
    }
}

class TimelineSystem {
    constructor() {
        this.nodes = document.querySelectorAll('.timeline-node');
        this.progressBar = document.querySelector('.timeline-progress');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.trackProgress());
        this.trackProgress();
    }

    trackProgress() {
        const container = document.querySelector('.timeline-container');
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        let percentage = 0;
        if (rect.top < windowHeight) {
            const totalHeight = rect.height;
            const scrolled = windowHeight - rect.top;
            percentage = Math.min(Math.max((scrolled / totalHeight) * 100, 0), 100);
        }
        this.progressBar.style.height = `${percentage}%`;

        this.nodes.forEach(node => {
            const nodeRect = node.getBoundingClientRect();
            if (nodeRect.top < windowHeight * 0.75) {
                node.querySelector('.node-marker').style.backgroundColor = 'var(--color-teal)';
                node.querySelector('.node-content').style.opacity = '1';
                node.querySelector('.node-content').style.transform = 'translateY(0)';
            } else {
                node.querySelector('.node-marker').style.backgroundColor = 'var(--color-void)';
            }
        });
    }
}

class PanelNavigation {
    constructor() {
        this.panels = document.querySelectorAll('.panel');
        this.navItems = document.querySelectorAll('.nav-item');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.highlightNav());
    }

    highlightNav() {
        let currentPanelId = '';
        this.panels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
                currentPanelId = panel.getAttribute('id');
            }
        });

        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentPanelId}`) {
                item.classList.add('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cursor = new CustomCursor();
    const audio = new SystemAudio();
    const reliquary = new ReliquaryViewer(audio);
    const griot = new GriotChamber(audio);
    const map = new CosmicMap(audio);
    const timeline = new TimelineSystem();
    const nav = new PanelNavigation();
});