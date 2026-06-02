// BIO-SYNC HUD Controller
// Real-time biopunk medical monitoring system

class BioSyncHUD {
    constructor() {
        this.initClock();
        this.initHeartbeat();
        this.initNanomachines();
        this.initNeuralGraph();
        this.initGeneMatrix();
        this.initOrganStatus();
        this.initSystemLogs();
        this.initAnatomicalScanner();
        this.initDataUpdates();
        this.startSimulation();
    }

    // System Clock & Date
    initClock() {
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            document.getElementById('system-time').textContent = timeStr;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // ECG / Heartbeat Visualization
    initHeartbeat() {
        const canvas = document.getElementById('heartbeat-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        let x = 0;
        let points = [];
        
        const generateWaveform = (x) => {
            const normalizedX = x % 300;
            if (normalizedX < 50) return 0;
            if (normalizedX < 60) return -8;
            if (normalizedX < 80) return 0;
            if (normalizedX < 90) return -40;
            if (normalizedX < 110) return 100;
            if (normalizedX < 130) return -30;
            if (normalizedX < 180) return 0;
            if (normalizedX < 220) return 12;
            return 0;
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 12, 14, 0.1)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < width; i += 40) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
            }
            for (let i = 0; i < height; i += 40) {
                ctx.moveTo(0, i);
                ctx.lineTo(width, i);
            }
            ctx.stroke();
            
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f0ff';
            ctx.beginPath();
            
            if (points.length > 1) {
                ctx.moveTo(points[0].x, height/2 + points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, height/2 + points[i].y);
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            const y = generateWaveform(x);
            points.push({ x, y });
            points = points.filter(p => p.x > x - width);
            
            if (Math.random() > 0.98) {
                const bpm = 68 + Math.floor(Math.random() * 8);
                document.getElementById('bpm').textContent = bpm;
            }
            
            x += 2;
            if (x > width * 2) x = width;
            
            requestAnimationFrame(draw);
        };
        draw();
    }

    // Nanomachine Swarm Simulation
    initNanomachines() {
        const canvas = document.getElementById('nanomachine-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        class NanoParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 3 + 1;
            }
            
            update() {
                this.vx += (Math.random() - 0.5) * 0.5;
                this.vy += (Math.random() - 0.5) * 0.5;
                this.vx *= 0.98;
                this.vy *= 0.98;
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            
            draw() {
                ctx.fillStyle = 'rgba(158, 255, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new NanoParticle());
        }
        
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 10, 15, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Neural Activity Graph
    initNeuralGraph() {
        const container = document.getElementById('neural-graph');
        if (!container) return;
        
        const bars = [];
        for (let i = 0; i < 40; i++) {
            const bar = document.createElement('div');
            bar.className = 'neural-bar';
            bar.style.height = '20%';
            container.appendChild(bar);
            bars.push(bar);
        }
        
        setInterval(() => {
            bars.forEach((bar, index) => {
                const height = 10 + Math.random() * 90;
                bar.style.height = `${height}%`;
                if (height > 80) {
                    bar.style.background = 'linear-gradient(to top, #ff003c, #ff6b6b)';
                } else {
                    bar.style.background = 'linear-gradient(to top, #004d52, #00f0ff)';
                }
            });
        }, 100);
    }

    // Gene-Splice Compatibility Matrix
    initGeneMatrix() {
        const container = document.getElementById('gene-matrix');
        if (!container) return;
        
        const cells = [];
        for (let i = 0; i < 20; i++) {
            const cell = document.createElement('div');
            cell.className = 'gene-cell';
            container.appendChild(cell);
            cells.push(cell);
        }
        
        setInterval(() => {
            cells.forEach(cell => {
                if (Math.random() > 0.7) {
                    cell.classList.toggle('active');
                }
            });
        }, 800);
    }

    // Organ Status Updates
    initOrganStatus() {
        const organs = document.querySelectorAll('.organ-item');
        setInterval(() => {
            organs.forEach(organ => {
                const bar = organ.querySelector('.organ-fill');
                const value = organ.querySelector('.organ-value');
                if (!bar || !value) return;
                
                let currentWidth = parseInt(bar.style.width) || 50;
                const change = (Math.random() - 0.5) * 4;
                let newWidth = Math.max(10, Math.min(100, currentWidth + change));
                
                bar.style.width = `${newWidth}%`;
                value.textContent = `${Math.floor(newWidth)}%`;
                
                bar.classList.remove('critical', 'warning');
                if (newWidth < 40) {
                    bar.classList.add('critical');
                } else if (newWidth < 70) {
                    bar.classList.add('warning');
                }
            });
        }, 3000);
    }

    // System Logs
    initSystemLogs() {
        const container = document.getElementById('system-logs');
        const messages = [
            'Nanomachine swarm deployed to hepatic region',
            'Neural link handshake confirmed',
            'Synaptic regeneration cycle complete',
            'Toxin filtration efficiency nominal',
            'Warning: Elevated mutagen levels detected',
            'Warning: Cellular drift exceeding parameters',
            'CRITICAL: Neural packet loss spike detected',
            'CRITICAL: Organ integrity compromised'
        ];
        
        setInterval(() => {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const entry = document.createElement('div');
            const time = new Date().toLocaleTimeString('en-US', { hour12: false });
            const type = msg.includes('CRITICAL') ? 'critical' : msg.includes('Warning') ? 'warning' : 'normal';
            
            entry.className = `log-entry ${type}`;
            entry.innerHTML = `<span class="timestamp">[${time}]</span> ${msg}`;
            container.appendChild(entry);
            
            while (container.children.length > 20) {
                container.removeChild(container.firstChild);
            }
            container.scrollTop = container.scrollHeight;
            
            if (type === 'critical') {
                const blood = document.getElementById('blood-alert');
                blood.classList.add('active');
                setTimeout(() => blood.classList.remove('active'), 2000);
            }
        }, 4000);
    }

    // Anatomical Scanner Interactions
    initAnatomicalScanner() {
        const nodes = document.querySelectorAll('.organ-nodes .node');
        const tooltip = document.getElementById('scan-tooltip');
        const scanLabel = tooltip.querySelector('.scan-label');
        
        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const organ = node.classList[1];
                const status = node.getAttribute('data-status');
                scanLabel.textContent = `${organ.toUpperCase()} :: ${status.toUpperCase()}`;
            });
            
            node.addEventListener('mouseleave', () => {
                scanLabel.textContent = 'SCANNING...';
            });
        });
    }

    // General Data Updates
    initDataUpdates() {
        setInterval(() => {
            const threat = 15 + Math.floor(Math.random() * 30);
            document.getElementById('threat-meter').style.width = `${threat}%`;
            document.getElementById('threat-value').textContent = `${threat}%`;
        }, 5000);
    }

    startSimulation() {
        console.log('BIO-SYNC v4.2.9 initialized');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BioSyncHUD();
});

document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.biosync-container')) {
        e.preventDefault();
    }
});