(function() {
    'use strict';
    var state = {
        heartRate: 72,
        bpSys: 120,
        bpDia: 80,
        oxygen: 98,
        temp: 37.2,
        respRate: 16,
        nanoProgress: 67,
        nanoEfficiency: 94.7,
        mutationIndex: 73,
        neuralSync: 97.3,
        neuralLatency: 12,
        dataStream: 2.4,
        processorLoad: 47,
        battery: 87
    };
    var ecgCtx = null;
    var ecgData = [];
    var nanoCanvas = null;
    var nanoCtx = null;
    var nanoParticles = [];
    function init() {
        initClock();
        initECG();
        initNanoVisualizer();
        initGeneMatrix();
        initDataUpdates();
        initFooterStats();
        initParallax();
        initOrganHover();
    }
    function initClock() {
        updateClock();
        setInterval(updateClock, 1000);
    }
    function updateClock() {
        var now = new Date();
        var time = now.toTimeString().split(' ')[0];
        var date = now.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
        var timeEl = document.getElementById('system-clock');
        var dateEl = document.getElementById('system-date');
        if (timeEl) timeEl.textContent = time;
        if (dateEl) dateEl.textContent = date;
    }
    function initECG() {
        var canvas = document.getElementById('ecg-canvas');
        if (!canvas) return;
        ecgCtx = canvas.getContext('2d');
        var container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        for (var i = 0; i < 200; i++) {
            ecgData.push(generateECGPoint(i));
        }
        animateECG();
    }
    function generateECGPoint(index) {
        var cycle = index % 40;
        if (cycle >= 5 && cycle <= 8) return Math.sin((cycle - 5) * Math.PI / 3) * 30 * 0.2;
        if (cycle >= 9 && cycle <= 10) return -Math.sin((cycle - 9) * Math.PI) * 30 * 0.1;
        if (cycle >= 10 && cycle <= 12) return (1 - Math.pow(2 * ((cycle - 10) / 2) - 1, 2)) * 30;
        if (cycle >= 12 && cycle <= 14) return -Math.sin((cycle - 12) * Math.PI / 2) * 30 * 0.3;
        if (cycle >= 18 && cycle <= 25) return Math.sin((cycle - 18) * Math.PI / 7) * 30 * 0.3;
        return 0;
    }
    function animateECG() {
        if (!ecgCtx) return;
        var canvas = ecgCtx.canvas;
        var w = canvas.width;
        var h = canvas.height;
        var centerY = h / 2;
        ecgCtx.fillStyle = 'rgba(10, 12, 16, 0.3)';
        ecgCtx.fillRect(0, 0, w, h);
        ecgData.shift();
        ecgData.push(generateECGPoint(Math.floor(Math.random() * 40)) + (Math.random() - 0.5) * 2);
        ecgCtx.beginPath();
        ecgCtx.strokeStyle = '#00ffaa';
        ecgCtx.lineWidth = 2;
        ecgCtx.shadowColor = '#00ffaa';
        ecgCtx.shadowBlur = 10;
        var stepX = w / 200;
        for (var i = 0; i < ecgData.length; i++) {
            var x = i * stepX;
            var y = centerY - ecgData[i];
            if (i === 0) ecgCtx.moveTo(x, y);
            else ecgCtx.lineTo(x, y);
        }
        ecgCtx.stroke();
        ecgCtx.strokeStyle = 'rgba(0, 255, 170, 0.3)';
        ecgCtx.lineWidth = 6;
        ecgCtx.shadowBlur = 20;
        ecgCtx.stroke();
        requestAnimationFrame(animateECG);
    }
    function initNanoVisualizer() {
        nanoCanvas = document.getElementById('nano-canvas');
        if (!nanoCanvas) return;
        nanoCtx = nanoCanvas.getContext('2d');
        var container = nanoCanvas.parentElement;
        nanoCanvas.width = container.offsetWidth;
        nanoCanvas.height = container.offsetHeight;
        for (var i = 0; i < 150; i++) {
            var angle = Math.random() * Math.PI * 2;
            var dist = Math.random() * 80 + 20;
            nanoParticles.push({
                x: nanoCanvas.width / 2 + Math.cos(angle) * dist,
                y: nanoCanvas.height / 2 + Math.sin(angle) * dist,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                color: Math.random() > 0.7 ? '#ff2266' : '#00e5ff',
                trail: []
            });
        }
        animateNanoSwarm();
    }
    function animateNanoSwarm() {
        if (!nanoCtx) return;
        var w = nanoCanvas.width;
        var h = nanoCanvas.height;
        var cx = w / 2;
        var cy = h / 2;
        nanoCtx.fillStyle = 'rgba(10, 12, 16, 0.1)';
        nanoCtx.fillRect(0, 0, w, h);
        for (var i = 0; i < nanoParticles.length; i++) {
            var p = nanoParticles[i];
            p.trail.push({x: p.x, y: p.y});
            if (p.trail.length > 8) p.trail.shift();
            var dx = cx - p.x;
            var dy = cy - p.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 100) {
                p.vx += (dx / dist) * 0.02;
                p.vy += (dy / dist) * 0.02;
            } else if (dist < 30) {
                p.vx -= (dx / dist) * 0.03;
                p.vy -= (dy / dist) * 0.03;
            }
            p.vx += (Math.random() - 0.5) * 0.1;
            p.vy += (Math.random() - 0.5) * 0.1;
            var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 2) {
                p.vx = (p.vx / speed) * 2;
                p.vy = (p.vy / speed) * 2;
            }
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;
            for (var j = 0; j < p.trail.length; j++) {
                var tp = p.trail[j];
                var alpha = (j / p.trail.length) * 0.3;
                nanoCtx.beginPath();
                nanoCtx.arc(tp.x, tp.y, p.size * 0.5, 0, Math.PI * 2);
                nanoCtx.fillStyle = 'rgba(0, 229, 255, ' + alpha + ')';
                nanoCtx.fill();
            }
            nanoCtx.beginPath();
            nanoCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            nanoCtx.fillStyle = p.color;
            nanoCtx.shadowColor = p.color;
            nanoCtx.shadowBlur = 8;
            nanoCtx.fill();
            nanoCtx.shadowBlur = 0;
        }
        var grad = nanoCtx.createRadialGradient(cx, cy, 0, cx, cy, 60);
        grad.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
        grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
        nanoCtx.fillStyle = grad;
        nanoCtx.beginPath();
        nanoCtx.arc(cx, cy, 60, 0, Math.PI * 2);
        nanoCtx.fill();
        requestAnimationFrame(animateNanoSwarm);
    }
    function initGeneMatrix() {
        var matrix = document.getElementById('gene-matrix');
        if (!matrix) return;
        matrix.innerHTML = '';
        for (var i = 0; i < 48; i++) {
            var cell = document.createElement('div');
            cell.className = 'matrix-cell';
            var r = Math.random();
            if (r > 0.7) cell.classList.add('compatible');
            else if (r > 0.4) cell.classList.add('partial');
            else cell.classList.add('incompatible');
            matrix.appendChild(cell);
        }
    }
    function initDataUpdates() {
        setInterval(function() {
            state.heartRate = Math.max(58, Math.min(95, state.heartRate + (Math.random() - 0.5) * 4));
            var hrEl = document.getElementById('heart-rate');
            if (hrEl) hrEl.textContent = Math.round(state.heartRate);
            state.bpSys = Math.max(100, Math.min(145, state.bpSys + (Math.random() - 0.5) * 6));
            state.bpDia = Math.max(60, Math.min(95, state.bpDia + (Math.random() - 0.5) * 4));
            var sysEl = document.getElementById('bp-systolic');
            var diaEl = document.getElementById('bp-diastolic');
            if (sysEl) sysEl.textContent = Math.round(state.bpSys);
            if (diaEl) diaEl.textContent = Math.round(state.bpDia);
            state.oxygen = Math.max(93, Math.min(100, state.oxygen + (Math.random() - 0.5) * 2));
            var o2El = document.getElementById('oxygen-sat');
            if (o2El) o2El.textContent = Math.round(state.oxygen);
            state.temp = Math.max(36, Math.min(38.5, state.temp + (Math.random() - 0.5) * 0.4));
            var tempEl = document.getElementById('body-temp');
            if (tempEl) tempEl.textContent = state.temp.toFixed(1);
        }, 2000);
        setInterval(function() {
            if (state.nanoProgress < 100) state.nanoProgress += Math.random() * 0.5;
            state.nanoEfficiency = Math.max(85, Math.min(99, state.nanoEfficiency + (Math.random() - 0.5) * 2));
            var progEl = document.getElementById('nano-progress-value');
            var progFill = document.getElementById('nano-progress-fill');
            var effEl = document.getElementById('nano-efficiency');
            if (progEl) progEl.textContent = Math.round(state.nanoProgress) + '%';
            if (progFill) progFill.style.width = state.nanoProgress + '%';
            if (effEl) effEl.textContent = state.nanoEfficiency.toFixed(1) + '%';
        }, 1500);
        setInterval(function() {
            if (state.mutationIndex < 100) state.mutationIndex += Math.random() * 0.3;
            var mutEl = document.getElementById('mutation-index');
            var mutFill = document.querySelector('.mutation-bar-fill');
            if (mutEl) mutEl.textContent = state.mutationIndex.toFixed(0) + '%';
            if (mutFill) mutFill.style.width = state.mutationIndex + '%';
        }, 5000);
        setInterval(function() {
            state.neuralSync = Math.max(85, Math.min(99.9, state.neuralSync + (Math.random() - 0.5) * 1));
            var syncEl = document.getElementById('neural-sync');
            var qualFill = document.querySelector('.quality-fill');
            if (syncEl) syncEl.textContent = state.neuralSync.toFixed(1) + '%';
            if (qualFill) qualFill.style.width = state.neuralSync + '%';
        }, 2500);
    }
    function initFooterStats() {
        setInterval(function() {
            state.dataStream = Math.max(1.5, Math.min(3.5, state.dataStream + (Math.random() - 0.5) * 0.3));
            state.processorLoad = Math.max(20, Math.min(85, state.processorLoad + (Math.random() - 0.5) * 5));
            var streamEl = document.querySelector('.stream-value');
            var loadFill = document.querySelector('.load-fill');
            var loadVal = document.querySelector('.load-value');
            if (streamEl) streamEl.textContent = state.dataStream.toFixed(1) + ' TB/s';
            if (loadFill) loadFill.style.width = state.processorLoad + '%';
            if (loadVal) loadVal.textContent = Math.round(state.processorLoad) + '%';
        }, 1000);
    }
    function initParallax() {
        document.addEventListener('mousemove', function(e) {
            var x = (e.clientX / window.innerWidth - 0.5) * 5;
            var y = (e.clientY / window.innerHeight - 0.5) * 5;
            var panels = document.querySelectorAll('.panel');
            for (var i = 0; i < panels.length; i++) {
                panels[i].style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            }
        });
        document.addEventListener('mouseleave', function() {
            var panels = document.querySelectorAll('.panel');
            for (var i = 0; i < panels.length; i++) {
                panels[i].style.transform = 'translate(0, 0)';
            }
        });
    }
    function initOrganHover() {
        var organs = document.querySelectorAll('.organ');
        for (var i = 0; i < organs.length; i++) {
            var org = organs[i];
            org.addEventListener('mouseenter', function() {
                this.style.filter = 'drop-shadow(0 0 20px currentColor) brightness(1.3)';
            });
            org.addEventListener('mouseleave', function() {
                this.style.filter = '';
            });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();