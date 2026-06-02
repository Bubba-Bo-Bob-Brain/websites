/* NEXUS ETERNAL - Dashboard Scripts v7.42 */
(function() {
document.addEventListener('DOMContentLoaded', function() {
initGalaxy();
initMiniMap();
initClock();
initTimers();
initBars();
initTicker();
initChat();
initToasts();
initInteractions();
initUpdates();
initKeyboard();
});

function initGalaxy() {
var c = document.getElementById('galaxyCanvas');
if (!c) return;
var ctx = c.getContext('2d');
c.width = c.offsetWidth || 400;
c.height = c.offsetHeight || 200;
var stars = [];
for (var i = 0; i < 120; i++) {
stars.push({x: Math.random(), y: Math.random(), s: Math.random() * 1.5 + 0.5, b: Math.random(), sp: Math.random() * 0.02, o: Math.random() * Math.PI * 2});
}
var t = 0, px = 0, py = 0, drag = false, lx = 0, ly = 0;
c.style.cursor = 'crosshair';
c.addEventListener('mousedown', function(e) { drag = true; lx = e.clientX; ly = e.clientY; });
c.addEventListener('mousemove', function(e) { if (drag) { px += (e.clientX - lx) / c.width; py += (e.clientY - ly) / c.height; lx = e.clientX; ly = e.clientY; }});
c.addEventListener('mouseup', function() { drag = false; });
function render() {
t += 0.016;
ctx.fillStyle = '#050810';
ctx.fillRect(0, 0, c.width, c.height);
ctx.strokeStyle = 'rgba(0,212,255,0.05)';
ctx.lineWidth = 0.5;
for (var g = 0; g <= 6; g++) {
var px2 = ((g/6 + px * 0.2) % 1) * c.width;
ctx.beginPath(); ctx.moveTo(px2, 0); ctx.lineTo(px2, c.height); ctx.stroke();
var py2 = ((g/6 + py * 0.2) % 1) * c.height;
ctx.beginPath(); ctx.moveTo(0, py2); ctx.lineTo(c.width, py2); ctx.stroke();
}
stars.forEach(function(s) {
var sx = ((s.x + px * 0.3) % 1) * c.width;
var sy = ((s.y + py * 0.3) % 1) * c.height;
var tw = Math.sin(t * s.sp * 60 + s.o) * 0.3 + 0.7;
ctx.fillStyle = 'rgba(255,255,255,' + (s.b * tw) + ')';
ctx.beginPath(); ctx.arc(sx, sy, s.s, 0, Math.PI * 2); ctx.fill();
});
var g2 = ctx.createRadialGradient(c.width/2, c.height/2, 0, c.width/2, c.height/2, c.width/2);
g2.addColorStop(0, 'rgba(139,92,246,0.1)');
g2.addColorStop(1, 'transparent');
ctx.fillStyle = g2;
ctx.fillRect(0, 0, c.width, c.height);
requestAnimationFrame(render);
}
render();
}

function initMiniMap() {
var c = document.getElementById('miniMapCanvas');
if (!c) return;
var ctx = c.getContext('2d');
c.width = 140; c.height = 80;
var angle = 0;
function render() {
ctx.fillStyle = '#0a0a12';
ctx.fillRect(0, 0, 140, 80);
ctx.strokeStyle = 'rgba(0,212,255,0.1)';
for (var i = 0; i <= 4; i++) {
var p = (i/4) * 80;
ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(140, p); ctx.stroke();
ctx.beginPath(); ctx.moveTo(p * 1.75, 0); ctx.lineTo(p * 1.75, 80); ctx.stroke();
}
for (var j = 0; j < 5; j++) {
ctx.fillStyle = ['#22c55e','#ef4444','#6b7280'][j % 3];
ctx.beginPath(); ctx.arc(Math.random() * 140, Math.random() * 80, 2, 0, Math.PI * 2); ctx.fill();
}
ctx.fillStyle = '#00d4ff';
ctx.shadowColor = '#00d4ff';
ctx.shadowBlur = 8;
ctx.beginPath(); ctx.arc(70, 40, 4, 0, Math.PI * 2); ctx.fill();
ctx.shadowBlur = 0;
angle += 0.03;
ctx.strokeStyle = 'rgba(0,212,255,0.5)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(70, 40); ctx.lineTo(70 + Math.cos(angle) * 80, 40 + Math.sin(angle) * 80); ctx.stroke();
requestAnimationFrame(render);
}
render();
}

function initClock() {
var el = document.querySelector('.time-value');
if (!el) return;
function update() {
var d = new Date();
el.textContent = '2847.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate()) + ':' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}
update();
setInterval(update, 1000);
}
function pad(n) { return String(n).padStart(2, '0'); }

function initTimers() {
document.querySelectorAll('.timer-value').forEach(function(el) {
var parts = el.textContent.split(':');
var secs = 0;
if (parts.length === 2) secs = parseInt(parts[0]) * 60 + parseInt(parts[1]);
else if (parts.length === 3) secs = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
setInterval(function() {
if (secs > 0) {
secs--;
var h = Math.floor(secs / 3600);
var m = Math.floor((secs % 3600) / 60);
var s = secs % 60;
el.textContent = h > 0 ? pad(h) + ':' + pad(m) + ':' + pad(s) : pad(m) + ':' + pad(s);
}
}, 1000);
});
}

function initBars() {
document.querySelectorAll('.progress-fill, .resource-bar .fill, .meter-fill, .attr-fill, .xp-fill, .node-bar .fill').forEach(function(b) {
var w = b.style.width;
b.style.width = '0%';
setTimeout(function() { b.style.width = w; }, 100 + Math.random() * 300);
});
setInterval(function() {
document.querySelectorAll('.res-rate').forEach(function(r) {
var v = parseInt(r.textContent.replace(/\D/g, '')) || 1000;
v += Math.floor(Math.random() * 200) - 80;
r.textContent = '+' + v.toLocaleString() + '/hr';
});
}, 5000);
}

function initTicker() {
var track = document.querySelector('.ticker-track');
var btn = document.querySelector('.ticker-btn');
if (!track || !btn) return;
track.innerHTML = track.innerHTML + track.innerHTML;
btn.addEventListener('click', function() {
var paused = track.style.animationPlayState === 'paused';
track.style.animationPlayState = paused ? 'running' : 'paused';
btn.textContent = paused ? '⏸' : '▶';
});
}

function initChat() {
var input = document.querySelector('.chat-input');
var btn = document.querySelector('.send-btn');
var msgs = document.querySelector('.chat-messages');
if (!input || !btn || !msgs) return;
function send() {
var text = input.value.trim();
if (!text) return;
var d = new Date();
var t = pad(d.getHours()) + ':' + pad(d.getMinutes());
var m = document.createElement('div');
m.className = 'chat-msg';
m.innerHTML = '<span class="msg-time">' + t + '</span><span class="msg-user" style="color:#00d4ff">StarCommander_X7</span><span class="msg-text">' + text + '</span>';
msgs.appendChild(m);
msgs.scrollTop = msgs.scrollHeight;
input.value = '';
setTimeout(function() {
var r = document.createElement('div');
r.className = 'chat-msg';
var res = ['Acknowledged!', 'Copy that!', 'On my way!', 'Orders received.'];
r.innerHTML = '<span class="msg-time">' + t + '</span><span class="msg-user" style="color:#4ecdc4">ARIA-7</span><span class="msg-text">' + res[Math.floor(Math.random() * res.length)] + '</span>';
msgs.appendChild(r);
msgs.scrollTop = msgs.scrollHeight;
}, 800);
}
btn.addEventListener('click', send);
input.addEventListener('keypress', function(e) { if (e.key === 'Enter') send(); });
}

function initToasts() {
window.showToast = function(type, msg) {
var stack = document.getElementById('notificationStack');
if (!stack) return;
var toast = document.createElement('div');
toast.className = 'toast ' + type;
toast.innerHTML = '<span class="toast-icon">' + {success:'\u2713', warning:'\u26A0', info:'\u2139'}[type] + '</span><span class="toast-msg">' + msg + '</span>';
stack.appendChild(toast);
setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 5000);
};
window.addToast = function(type, msg) { if (window.showToast) window.showToast(type, msg); };
setTimeout(function() { showToast('success', 'Mission Complete: Sample Collection +25K XP'); }, 15000);
}

function initInteractions() {
document.querySelectorAll('.panel').forEach(function(p) {
p.addEventListener('dblclick', function(e) {
if (e.target.closest('.panel-header')) {
var c = p.querySelector('.panel-content');
p.classList.toggle('collapsed');
c.style.display = p.classList.contains('collapsed') ? 'none' : 'flex';
}
});
});
document.querySelectorAll('.ship-row, .resource-card, .mission-item, .inv-item').forEach(function(el) {
el.addEventListener('click', function() {
var name = el.querySelector('.ship-name, .res-name, .mission-name, .item-name');
if (name) window.addToast('info', 'Selected: ' + name.textContent);
});
});
document.querySelectorAll('.qb, .qb-main, .qa-btn, .crew-btn').forEach(function(b) {
b.addEventListener('click', function() {
window.addToast('info', 'Action: ' + b.textContent.trim());
b.style.transform = 'scale(0.95)';
setTimeout(function() { b.style.transform = ''; }, 100);
});
});
document.querySelectorAll('.mtab-btn, .tab-btn, .filter-btn').forEach(function(b) {
b.addEventListener('click', function() {
b.parentElement.querySelectorAll('.mtab-btn, .tab-btn, .filter-btn').forEach(function(x) { x.classList.remove('active'); });
b.classList.add('active');
});
});
}

function initUpdates() {
var wallet = document.querySelector('.wallet-val');
if (wallet) {
setInterval(function() {
var v = parseInt(wallet.textContent.replace(/\D/g, '')) || 0;
v += Math.floor(Math.random() * 8000) - 3000;
wallet.textContent = Math.max(0, v).toLocaleString();
}, 8000);
}
setInterval(function() {
document.querySelectorAll('.meter-val').forEach(function(v, i) {
var cur = parseFloat(v.textContent) || 50;
var n = Math.max(0, Math.min(100, cur + (Math.random() - 0.5) * 3));
v.textContent = i === 2 ? n.toFixed(0) + '\u00B0C' : n.toFixed(0) + '%';
var row = v.closest('.meter-row');
if (row) {
var bar = row.querySelector('.meter-fill');
if (bar) bar.style.width = n + '%';
}
});
}, 3500);
setInterval(function() {
document.querySelectorAll('.m-item-trend').forEach(function(t) {
var v = parseFloat(t.textContent) || 0;
v += (Math.random() - 0.5) * 2;
t.textContent = (v >= 0 ? '+' : '') + v.toFixed(0) + '%';
t.className = 'm-item-trend ' + (v >= 0 ? 'up' : 'down');
});
}, 15000);
setInterval(function() {
document.querySelectorAll('.zone-progress .progress-fill.ally').forEach(function(b) {
var w = parseInt(b.style.width) || 50;
w += (Math.random() - 0.5) * 2;
w = Math.max(0, Math.min(100, w));
b.style.width = w + '%';
var parent = b.closest('.zone-progress');
if (parent) {
var e = parent.querySelector('.progress-fill.enemy');
if (e) e.style.width = (100 - w) + '%';
}
});
}, 10000);
var coords = document.querySelectorAll('.mini-map-coords span');
if (coords.length >= 3) {
setInterval(function() {
coords[0].textContent = 'X: ' + (Math.random() * 1000).toFixed(2);
coords[1].textContent = 'Y: ' + (Math.random() * 1000).toFixed(2);
coords[2].textContent = 'Z: ' + (Math.random() * 100).toFixed(2);
}, 2000);
}
var ping = document.querySelector('.server-ping');
if (ping) {
setInterval(function() {
var ms = Math.floor(Math.random() * 15) + 8;
ping.textContent = '\u23F1 ' + ms + 'ms';
}, 5000);
}
var fps = document.querySelector('.footer-stat .val-good');
if (fps) {
setInterval(function() { fps.textContent = Math.floor(Math.random() * 20) + 135; }, 2000);
}
}

function initKeyboard() {
document.addEventListener('keydown', function(e) {
if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
e.preventDefault();
var btns = document.querySelectorAll('.qb, .qb-main');
if (btns[parseInt(e.key) - 1]) btns[parseInt(e.key) - 1].click();
}
if (e.key === 'Escape') {
document.querySelectorAll('.toast').forEach(function(t) { t.remove(); });
}
});
}

console.log('%c NEXUS ETERNAL ', 'background:#0a0a12;color:#00d4ff;font-size:14px;padding:6px;border:1px solid #00d4ff');
console.log('%c Dashboard v7.42 Ready ', 'color:#9ca3af;font-size:10px');
})();