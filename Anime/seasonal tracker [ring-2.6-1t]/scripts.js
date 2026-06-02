/* ═══════════════════════════════════════════════════════════════════
   AnimePulse — Seasonal Tracking Calendar
   scripts.js
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ── DATA ──────────────────────────────────────────────────────
    const animeData = [
        {
            id: 0,
            title: 'Demon Slayer: Hashira Training Arc',
            coverEmoji: '🗡️',
            gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
            genres: ['action','supernatural','historical'],
            status: 'watching',
            rating: 88,
            epWatched: 15,
            epTotal: 22,
            nextAir: '2025-06-14T22:00:00Z',
            studio: 'ufotable',
            spark: [4,7,6,8,9,12,15,18,20,22,25,27,30,28,26,24,22,20,18,16,14,12],
            description: 'Tanjiro and his companions undergo intense training under the Hashira, pushing their limits to master new breathing techniques and combat the ever-growing demon threat.'
        },
        {
            id: 1,
            title: 'Spy x Family Part 3',
            coverEmoji: '👨‍👩‍👧‍👦',
            gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
            genres: ['action','comedy','slice-of-life'],
            status: 'watching',
            rating: 85,
            epWatched: 8,
            epTotal: 12,
            nextAir: '2025-06-07T19:00:00Z',
            studio: 'WIT Studio & CloverWorks',
            spark: [5,6,8,9,10,12,14,15,16,18,20,22],
            description: 'The Forger family faces new missions and school challenges while keeping their secret identities intact. Loid, Yor, and Anya must balance espionage, assassination, and elementary school life.'
        },
        {
            id: 2,
            title: 'Jujutsu Kaisen Season 3',
            coverEmoji: '⚡',
            gradient: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
            genres: ['action','supernatural','dark-fantasy'],
            status: 'watching',
            rating: 91,
            epWatched: 18,
            epTotal: 24,
            nextAir: '2025-06-21T21:00:00Z',
            studio: 'MAPPA',
            spark: [3,5,8,12,15,18,20,22,25,27,30,33,35,38,40,42,44,46,48,50,52,55,58,60],
            description: 'The Culling Game reaches its climax as Gojo\'s students fight against ancient sorcerers and cursed spirits. Yuji Itadori confronts his destiny while the boundaries between life and death blur.'
        },
        {
            id: 3,
            title: 'My Hero Academia Final Season',
            coverEmoji: '💥',
            gradient: 'linear-gradient(135deg,#ff6B35,#f7931e,#ffdc00)',
            genres: ['action','superhero','school'],
            status: 'watching',
            rating: 87,
            epWatched: 12,
            epTotal: 24,
            nextAir: '2025-06-15T16:30:00Z',
            studio: 'Bones',
            spark: [2,4,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,70],
            description: 'Izuku Midoriya and his classmates face the ultimate villain, All For One, in an epic showdown that will decide the future of hero society.'
        },
        {
            id: 4,
            title: 'Frieren: Beyond Journey\'s End',
            coverEmoji: '🧙',
            gradient: 'linear-gradient(135deg,#a78bfa,#7c3aed,#4c1d95)',
            genres: ['fantasy','slice-of-life','adventure'],
            status: 'completed',
            rating: 94,
            epWatched: 28,
            epTotal: 28,
            nextAir: '',
            studio: 'Madhouse',
            spark: [6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,80,82,85],
            description: 'After the hero Himmel passes away, the elven mage Frieren embarks on a journey to understand human emotions, reflecting on memories and forging new bonds.'
        },
        {
            id: 5,
            title: 'Solo Leveling',
            coverEmoji: '⚔️',
            gradient: 'linear-gradient(135deg,#0f172a,#1e3a5f,#0ea5e9)',
            genres: ['action','fantasy','supernatural'],
            status: 'watching',
            rating: 90,
            epWatched: 10,
            epTotal: 12,
            nextAir: '2025-06-08T18:00:00Z',
            studio: 'A-1 Pictures',
            spark: [1,3,5,8,12,16,20,25,30,35,40,45],
            description: 'In a world where hunters battle monsters from dimensional gates, Sung Jin-woo—once the weakest—gains a mysterious system that lets him level up and become the strongest.'
        },
        {
            id: 6,
            title: 'Mashle: Magic and Muscles S2',
            coverEmoji: '💪',
            gradient: 'linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)',
            genres: ['action','comedy','fantasy'],
            status: 'on-hold',
            rating: 83,
            epWatched: 12,
            epTotal: 12,
            nextAir: '',
            studio: 'A-1 Pictures',
            spark: [2,4,6,8,10,12,14,16,18,20,22,24],
            description: 'Mash Burnedead, a muscle-bound wizard with zero magical talent, continues his hilarious and action-packed quest to prove that brawn can beat magic.'
        },
        {
            id: 7,
            title: 'Blue Lock Season 2',
            coverEmoji: '⚽',
            gradient: 'linear-gradient(135deg,#1e3a5f,#0f3460,#560bad)',
            genres: ['sports','action','drama'],
            status: 'watching',
            rating: 86,
            epWatched: 6,
            epTotal: 14,
            nextAir: '2025-06-12T17:00:00Z',
            studio: 'Eight Bit',
            spark: [1,2,4,6,9,12,15,18,21,24,27,30,33,36],
            description: 'The ultimate soccer survival game continues as Isagi and his rivals clash in a high-stakes tournament that will determine Japan\'s future striker.'
        },
        {
            id: 8,
            title: 'Oshi no Ko Season 2',
            coverEmoji: '🌟',
            gradient: 'linear-gradient(135deg,#ec4899,#db2777,#831843)',
            genres: ['drama','romance','idol'],
            status: 'watching',
            rating: 89,
            epWatched: 9,
            epTotal: 13,
            nextAir: '2025-06-10T20:00:00Z',
            studio: 'Doga Kobo',
            spark: [3,5,8,11,14,17,20,23,26,29,32,35,38],
            description: 'Ai and her fellow idols navigate the cutthroat entertainment industry while uncovering the dark secrets behind their fame.'
        },
        {
            id: 9,
            title: 'Hell\'s Paradise',
            coverEmoji: '🌿',
            gradient: 'linear-gradient(135deg,#064e3b,#065f46,#047857)',
            genres: ['action','supernatural','historical'],
            status: 'on-hold',
            rating: 84,
            epWatched: 13,
            epTotal: 13,
            nextAir: '',
            studio: 'MAPPA',
            spark: [2,4,6,8,10,12,14,16,18,20,22,24,26],
            description: 'Sentenced to death, Gabimaru the Hollow embarks on a deadly mission to retrieve the Elixir of Life from a mysterious island.'
        },
        {
            id: 10,
            title: 'Undead Unluck',
            coverEmoji: '💀',
            gradient: 'linear-gradient(135deg,#4a0404,#7f1d1d,#991b1b)',
            genres: ['action','supernatural','romance'],
            status: 'dropped',
            rating: 78,
            epWatched: 4,
            epTotal: 24,
            nextAir: '',
            studio: 'David Production',
            spark: [1,2,3,4,5,6,7,8,9,10,11,12],
            description: 'Fuuko Izumo, a girl whose bad luck kills anyone she touches, teams up with an immortal man to seek a way to end her curse.'
        },
        {
            id: 11,
            title: 'Kaiju No. 8',
            coverEmoji: '👾',
            gradient: 'linear-gradient(135deg,#065f46,#047857,#059669)',
            genres: ['action','supernatural','military'],
            status: 'watching',
            rating: 82,
            epWatched: 7,
            epTotal: 13,
            nextAir: '2025-06-14T21:00:00Z',
            studio: 'Production I.G',
            spark: [2,4,6,9,12,15,18,21,24,27,30,33,36],
            description: 'Kafka Hibino, a monster-cleaning worker, accidentally transforms into a kaiju and must hide his identity while fighting for humanity.'
        },
        {
            id: 12,
            title: 'The Apothecary Diaries S2',
            coverEmoji: '💊',
            gradient: 'linear-gradient(135deg,#9f1239,#be185d,#831843)',
            genres: ['drama','mystery','historical'],
            status: 'plan-to-watch',
            rating: 86,
            epWatched: 0,
            epTotal: 0,
            nextAir: '2025-07-01T23:00:00Z',
            studio: 'Toho Animation',
            spark: [0,0,0,0,0,0,0,0,0,0,0,0],
            description: 'Maomao, a brilliant pharmacist, is thrust into the imperial palace where her medical expertise becomes a political weapon.'
        }
    ];

    // ── DOM REFS ──────────────────────────────────────────────────
    const grid          = document.getElementById('animeGrid');
    const genreFilters  = document.getElementById('genreFilters');
    const statusFilters = document.getElementById('statusFilters');
    const sortSelect    = document.getElementById('sortSelect');
    const searchInput   = document.getElementById('searchInput');
    const modalOverlay  = document.getElementById('modalOverlay');
    const modalContent  = document.getElementById('modalContent');
    const modalClose    = document.getElementById('modalClose');
    const toastBox      = document.getElementById('toastContainer');
    const dialogOverlay = document.getElementById('dialogOverlay');
    const dialogTitle   = document.getElementById('dialogTitle');
    const dialogText    = document.getElementById('dialogText');
    const dialogCancel  = document.getElementById('dialogCancel');
    const dialogConfirm = document.getElementById('dialogConfirm');
    const mascot        = document.getElementById('mascot');
    const mascotSpeech  = document.getElementById('mascotText');
    const mascotToggle  = document.getElementById('mascotToggle');
    const mascotSidebar = document.getElementById('mascotSidebar');

    let currentGenre  = 'all';
    let currentStatus = 'all';
    let searchTerm    = '';
    let pendingAction = null;

    // ── HELPERS ───────────────────────────────────────────────────
    function formatDate(iso) {
        if (!iso) return '';
        var d = new Date(iso);
        return d.toLocaleDateString('en-US', {month:'short', day:'numeric'});
    }

    function timeUntil(iso) {
        if (!iso) return {days:'—', text:'—', numericDays: null};
        var now = Date.now();
        var diff = new Date(iso) - now;
        if (diff <= 0) return {days:'NOW', text:'Now', numericDays: 0};
        var days = Math.ceil(diff / 86400000);
        if (days === 0) return {days:'<1d', text:'Less than a day', numericDays: 0};
        return {days: days + 'd', text: days + ' day' + (days > 1 ? 's' : '') + ' left', numericDays: days};
    }

    function clamp01(val) {
        return Math.max(0, Math.min(1, val));
    }

    // ── SPARKLINE SVG STRING ─────────────────────────────────────
    function buildSparkline(data, color) {
        if (!data || data.length < 2) return '';
        var w = 80, h = 30, pad = 4;
        var max = Math.max.apply(null, data);
        var min = Math.min.apply(null, data);
        var range = max - min || 1;
        var stepX = (w - 2 * pad) / (data.length - 1);
        var points = [];
        for (var i = 0; i < data.length; i++) {
            var x = pad + i * stepX;
            var y = h - pad - ((data[i] - min) / range) * (h - 2 * pad);
            points.push(x.toFixed(1) + ',' + y.toFixed(1));
        }
        var ptsStr = points.join(' ');
        var fillPts = ptsStr + ' ' + (w - pad).toFixed(1) + ',' + h + ' ' + pad + ',' + h;
        var gradId = 'sg' + Date.now() + Math.random().toString(36).slice(2,6);
        var svg = '<svg class="sparkline-svg" viewBox="0 0 ' + w + ' ' + h + '">' +
            '<defs>' +
            '<linearGradient id="' + gradId + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.4"/>' +
            '<stop offset="100%" stop-color="' + color + '" stop-opacity="0.02"/>' +
            '</linearGradient>' +
            '</defs>' +
            '<path class="sparkline-fill" d="M' + fillPts + '" fill="url(#' + gradId + ')"/>' +
            '<polyline class="sparkline-line" points="' + ptsStr + '" fill="none" stroke="' + color + '" stroke-width="2"/>' +
            '<circle class="sparkline-dot" cx="' + (pad + (data.length - 1) * stepX).toFixed(1) + '" cy="' + (h - pad - ((data[data.length-1] - min) / range) * (h - 2 * pad)).toFixed(1) + '" r="3" fill="' + color + '"/>' +
            '</svg>';
        return svg;
    }

    // ── GENRE COLOR MAP ───────────────────────────────────────────
    var genreColorMap = {
        action:        '#FF2D55',
        supernatural:  '#8B5CF6',
        historical:    '#F59E0B',
        comedy:        '#F59E0B',
        fantasy:       '#A855F7',
        romance:       '#EC4899',
        thriller:      '#06B6D4',
        'dark-fantasy':'#6366F1',
        'slice-of-life':'#10B981',
        superhero:     '#10B981',
        school:        '#3B82F6',
        sports:        '#3B82F6',
        'sci-fi':      '#06D6A0',
        military:      '#6366F1',
        idol:          '#DB2777',
        drama:         '#EF4444'
    };

    // ── STATUS LABEL MAP ──────────────────────────────────────────
    var statusLabelMap = {
        'watching':      'Watching',
        'completed':     'Completed',
        'on-hold':       'On Hold',
        'dropped':       'Dropped',
        'plan-to-watch': 'Plan to Watch'
    };

    // ── STATUS BADGE COLOR MAP ────────────────────────────────────
    var statusRingColor = {
        'watching':      '#FF2D95',
        'completed':     '#10B981',
        'on-hold':       '#F59E0B',
        'dropped':       '#6b7280',
        'plan-to-watch': '#F59E0B'
    };

    // ── RENDER CARDS ─────────────────────────────────────────────
    function renderCards() {
        grid.innerHTML = '';

        var filtered = animeData.filter(function(a) {
            var genreOk  = currentGenre  === 'all' || a.genres.indexOf(currentGenre)  !== -1;
            var statusOk = currentStatus === 'all' || a.status === currentStatus;
            var searchOk = !searchTerm   || a.title.toLowerCase().indexOf(searchTerm) !== -1;
            return genreOk && statusOk && searchOk;
        });

        var sortVal = sortSelect.value;
        filtered.sort(function(a, b) {
            switch (sortVal) {
                case 'next-air':
                    return (a.nextAir || '9999') > (b.nextAir || '9999') ? 1 : -1;
                case 'rating-high': return b.rating - a.rating;
                case 'rating-low':  return a.rating - b.rating;
                case 'title-az':    return a.title.localeCompare(b.title);
                case 'title-za':    return b.title.localeCompare(a.title);
                case 'episodes-desc': return b.epTotal - a.epTotal;
                case 'studio':      return a.studio.localeCompare(b.studio);
                default: return 0;
            }
        });

        filtered.forEach(function(anime) {
            var card = document.createElement('article');
            card.className = 'anime-card';
            card.dataset.id = anime.id;

            var timeInfo  = timeUntil(anime.nextAir);
            var days      = timeInfo.days;
            var ringColor = statusRingColor[anime.status] || '#FF2D95';
            var statusLabel = statusLabelMap[anime.status] || 'Unknown';
            var progressPct = anime.epTotal ? (anime.epWatched / anime.epTotal * 100) : 0;

            var numericDays = timeInfo.numericDays;
            var ringOffsetVal;
            if (anime.nextAir && numericDays !== null) {
                ringOffsetVal = Math.max(0, 163.36 - (163.36 * clamp01(numericDays / 30)));
            } else {
                ringOffsetVal = 163.36;
            }

            var badgeHTML = '';
            if (anime.status === 'completed') {
                badgeHTML = '<div class="card-new-badge badge-completed">COMPLETE</div>';
            } else if (anime.status === 'plan-to-watch') {
                badgeHTML = '<div class="card-new-badge badge-upcoming">UPCOMING</div>';
            } else if (anime.nextAir) {
                badgeHTML = '<div class="card-new-badge">' + days + '</div>';
            }

            var genreTagsHTML = anime.genres.map(function(g) {
                var c = genreColorMap[g] || '#6b7280';
                return '<span class="genre-tag" style="--tag-color:' + c + ';--tag-bg:' + c + '22;">' + g + '</span>';
            }).join('');

            var epBtnLabel;
            if (anime.status === 'completed') {
                epBtnLabel = 'All Watched';
            } else if (anime.status === 'plan-to-watch') {
                epBtnLabel = 'Notify Me';
            } else {
                epBtnLabel = 'Ep ' + (anime.epWatched + 1) + ' \u2192';
            }

            var epTotalDisplay = anime.epTotal || 'TBA';

            card.innerHTML =
                '<div class="card-glow"></div>' +
                '<div class="card-image-container">' +
                    '<div class="card-cover" style="background:' + anime.gradient + ';">' +
                        '<div class="cover-placeholder-icon">' + anime.coverEmoji + '</div>' +
                        '<div class="cover-overlay"></div>' +
                    '</div>' +
                    '<div class="card-status-badge" data-status-badge="' + anime.status + '">' +
                        '<span class="badge-dot"></span>' + statusLabel +
                    '</div>' +
                    badgeHTML +
                '</div>' +
                '<div class="card-body">' +
                    '<h3 class="card-title">' + anime.title + '</h3>' +
                    '<div class="card-genres">' + genreTagsHTML + '</div>' +
                    '<div class="card-studio">' +
                        '<span class="studio-dot" style="background:' + (anime.gradient.split(',')[2] || '#667eea') + ';"></span>' +
                        'Studio: <strong>' + anime.studio + '</strong>' +
                    '</div>' +
                    '<div class="card-episode-info">' +
                        '<div class="episode-count">' +
                            '<span class="ep-watched">' + anime.epWatched + '</span>' +
                            '<span class="ep-separator">/</span>' +
                            '<span class="ep-total">' + epTotalDisplay + '</span>' +
                            '<span class="ep-label">episodes</span>' +
                        '</div>' +
                        '<div class="progress-bar-container">' +
                            '<div class="progress-bar">' +
                                '<div class="progress-fill" style="width:' + progressPct.toFixed(1) + '%"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-footer">' +
                        '<div class="countdown-ring-container">' +
                            '<svg class="countdown-ring" viewBox="0 0 60 60">' +
                                '<circle class="ring-bg" cx="30" cy="30" r="26"/>' +
                                '<circle class="ring-progress" cx="30" cy="30" r="26"' +
                                    ' stroke-dasharray="163.36"' +
                                    ' stroke-dashoffset="' + ringOffsetVal.toFixed(2) + '"' +
                                    ' style="stroke:' + ringColor + '"/>' +
                                '<text class="ring-text" x="30" y="33" text-anchor="middle"' +
                                    ' style="fill:' + ringColor + '">' + days + '</text>' +
                            '</svg>' +
                        '</div>' +
                        '<div class="card-sparkline-container">' +
                            buildSparkline(anime.spark, ringColor) +
                            '<span class="sparkline-value">' + (anime.rating / 10).toFixed(1) + ' \u2605</span>' +
                        '</div>' +
                        '<div class="card-rating-score">' +
                            '<div class="score-display" data-score="' + anime.rating + '">' +
                                '<span class="score-number">' + anime.rating + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-actions">' +
                        '<select class="status-selector" data-id="' + anime.id + '">' +
                            '<option value="watching"'      + (anime.status==='watching'      ? ' selected' : '') +  '>\u25AB\uFE0F Watching</option>' +
                            '<option value="completed"'     + (anime.status==='completed'     ? ' selected' : '') +  '>\u2705 Completed</option>' +
                            '<option value="on-hold"'       + (anime.status==='on-hold'       ? ' selected' : '') +  '>\u25AB\uFE0F On Hold</option>' +
                            '<option value="dropped"'       + (anime.status==='dropped'       ? ' selected' : '') +  '>\u26D4 Dropped</option>' +
                            '<option value="plan-to-watch"' + (anime.status==='plan-to-watch' ? ' selected' : '') +  '>\u2B50 Plan to Watch</option>' +
                        '</select>' +
                        '<button class="episode-btn" data-id="' + anime.id + '">' +
                            '<span class="ep-btn-icon">\u25B6</span>' +
                            '<span class="ep-btn-text">' + epBtnLabel + '</span>' +
                        '</button>' +
                    '</div>' +
                '</div>';

            grid.appendChild(card);
        });

        updateMascotStats();
    }

    // ── UPDATE STATS & MASCOT ─────────────────────────────────────
    function updateMascotStats() {
        var watching = 0, completed = 0, totalWatched = 0, totalEps = 0, ratingSum = 0;
        for (var i = 0; i < animeData.length; i++) {
            var a = animeData[i];
            if (a.status === 'watching') watching++;
            if (a.status === 'completed') completed++;
            totalWatched += a.epWatched;
            totalEps += (a.epTotal || 0);
            ratingSum += a.rating;
        }
        var avg = animeData.length ? Math.round(ratingSum / animeData.length) : 0;

        var mWatch  = document.getElementById('mascotWatching');
        var mComp   = document.getElementById('mascotCompleted');
        var mAvg    = document.getElementById('mascotAvgScore');
        if (mWatch)  mWatch.textContent  = watching;
        if (mComp)   mComp.textContent   = completed;
        if (mAvg)    mAvg.textContent    = avg || '—';

        var sWatch  = document.getElementById('statWatching');
        var sComp   = document.getElementById('statCompleted');
        var sAvg    = document.getElementById('statAvgRating');
        var sEps    = document.getElementById('statTotalEps');
        if (sWatch)  sWatch.textContent  = watching;
        if (sComp)   sComp.textContent   = completed;
        if (sAvg)    sAvg.textContent    = avg || '—';
        if (sEps)    sEps.textContent    = totalWatched;

        // Mascot reaction based on progress
        var pct = totalEps ? Math.round(totalWatched / totalEps * 100) : 0;
        var msg;
        if (pct < 25)       msg = "Let's keep going, Sensei! \uD83D\uDCAA";
        else if (pct < 50)  msg = "Nice progress! \uD83C\uDF1F";
        else if (pct < 75)  msg = "Almost there, you're on fire! \uD83D\uDD25";
        else                 msg = "Amazing work, Sensei! \uD83C\uDF89";
        if (mascotSpeech) mascotSpeech.textContent = msg;
    }

    // ── TOAST NOTIFICATIONS ───────────────────────────────────────
    function showToast(message, type) {
        type = type || 'success';
        var toast = document.createElement('div');
        var icons = {success:'\u2705', error:'\u274C', info:'\u2139\uFE0F', warning:'\u26A0\uFE0F'};
        toast.className = 'toast toast-' + type;
        toast.innerHTML =
            '<span class="toast-icon">' + (icons[type] || icons.success) + '</span>' +
            '<span class="toast-message">' + message + '</span>';
        toastBox.appendChild(toast);
        setTimeout(function() {
            toast.classList.add('removing');
            toast.addEventListener('animationend', function() { toast.remove(); });
        }, 3500);
    }

    // ── MODAL ─────────────────────────────────────────────────────
    function openModal(anime) {
        var timeInfo = timeUntil(anime.nextAir);
        var nextEpHTML = anime.nextAir
            ? formatDate(anime.nextAir) + ' (' + timeInfo.text + ')'
            : 'TBA';
        var genreTags = anime.genres.map(function(g) {
            return '<span class="genre-tag" style="--tag-color:var(--pink-primary);--tag-bg:rgba(255,45,149,0.12);margin-right:4px;">' + g + '</span>';
        }).join('');

        modalContent.innerHTML =
            '<div class="modal-cover" style="background:' + anime.gradient + ';">' +
                '<div class="cover-placeholder-icon" style="font-size:5rem;filter:drop-shadow(0 6px 20px rgba(0,0,0,0.4));">' + anime.coverEmoji + '</div>' +
            '</div>' +
            '<h2 class="modal-title">' + anime.title + '</h2>' +
            '<div class="modal-meta">' +
                '<div class="modal-meta-item"><span class="modal-meta-label">Studio</span><span class="modal-meta-value">' + anime.studio + '</span></div>' +
                '<div class="modal-meta-item"><span class="modal-meta-label">Rating</span><span class="modal-meta-value">' + (anime.rating / 10).toFixed(1) + ' \u2605</span></div>' +
                '<div class="modal-meta-item"><span class="modal-meta-label">Episodes</span><span class="modal-meta-value">' + anime.epWatched + '/' + (anime.epTotal || 'TBA') + '</span></div>' +
                '<div class="modal-meta-item"><span class="modal-meta-label">Next Episode</span><span class="modal-meta-value">' + nextEpHTML + '</span></div>' +
            '</div>' +
            '<p class="modal-description">' + anime.description + '</p>' +
            '<div style="margin-bottom:1rem;"><strong style="color:var(--text-primary);">Genres:</strong> ' + genreTags + '</div>' +
            '<div class="modal-actions">' +
                '<button class="modal-btn modal-btn-primary" id="modalWatchBtn">\u25B6 Continue Watching</button>' +
                '<button class="modal-btn modal-btn-secondary" id="modalCloseBtn">Close</button>' +
            '</div>';

        modalOverlay.classList.add('active');

        document.getElementById('modalWatchBtn').onclick = function() {
            modalOverlay.classList.remove('active');
            showToast('Opening ' + anime.title + '... \uD83C\uDFAC', 'info');
        };
        document.getElementById('modalCloseBtn').onclick = function() {
            modalOverlay.classList.remove('active');
        };
    }

    if (modalClose) {
        modalClose.onclick = function() { modalOverlay.classList.remove('active'); };
    }
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // ── CONFIRMATION DIALOG ────────────────────────────────────────
    function confirmDialog(title, text, onConfirm) {
        dialogTitle.textContent = title;
        dialogText.textContent = text;
        dialogOverlay.classList.add('active');
        pendingAction = onConfirm;
    }

    if (dialogCancel) {
        dialogCancel.onclick = function() {
            dialogOverlay.classList.remove('active');
            pendingAction = null;
        };
    }
    dialogOverlay.addEventListener('click', function(e) {
        if (e.target === dialogOverlay && dialogCancel) dialogCancel.click();
    });
    if (dialogConfirm) {
        dialogConfirm.onclick = function() {
            dialogOverlay.classList.remove('active');
            if (pendingAction) pendingAction();
            pendingAction = null;
        };
    }

    // ── EVENT DELEGATION ──────────────────────────────────────────
    grid.addEventListener('change', function(e) {
        if (e.target.classList.contains('status-selector')) {
            var id = parseInt(e.target.dataset.id, 10);
            var anime = null;
            for (var i = 0; i < animeData.length; i++) {
                if (animeData[i].id === id) { anime = animeData[i]; break; }
            }
            if (anime) {
                anime.status = e.target.value;
                if (anime.status === 'completed') anime.epWatched = anime.epTotal;
                renderCards();
                showToast(anime.title + ' \u2192 ' + e.target.value, anime.status === 'completed' ? 'success' : 'info');
            }
        }
    });

    grid.addEventListener('click', function(e) {
        var btn = e.target.closest('.episode-btn');
        if (btn) {
            var id = parseInt(btn.dataset.id, 10);
            var anime = null;
            for (var i = 0; i < animeData.length; i++) {
                if (animeData[i].id === id) { anime = animeData[i]; break; }
            }
            if (anime) {
                if (anime.status === 'plan-to-watch') {
                    anime.status = 'watching';
                    anime.epWatched = 1;
                    showToast('Started watching ' + anime.title + '! \uD83D\uDE80', 'success');
                    renderCards();
                } else if (anime.status !== 'completed' && anime.status !== 'plan-to-watch') {
                    if (anime.epWatched < anime.epTotal) {
                        anime.epWatched++;
                        showToast('Episode ' + anime.epWatched + ' of ' + anime.title + ' watched! \uD83C\uDF89', 'success');
                        renderCards();
                    } else {
                        showToast('All episodes already watched!', 'info');
                    }
                }
            }
            return;
        }

        var card = e.target.closest('.anime-card');
        if (card && !e.target.closest('.episode-btn') && !e.target.closest('.status-selector')) {
            var cardId = parseInt(card.dataset.id, 10);
            var anime = null;
            for (var i = 0; i < animeData.length; i++) {
                if (animeData[i].id === cardId) { anime = animeData[i]; break; }
            }
            if (anime) openModal(anime);
        }
    });

    // ── FILTER CHIPS ──────────────────────────────────────────────
    genreFilters.addEventListener('click', function(e) {
        var chip = e.target.closest('.genre-chip');
        if (!chip) return;
        var chips = genreFilters.querySelectorAll('.genre-chip');
        for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
        chip.classList.add('active');
        currentGenre = chip.dataset.genre;
        renderCards();
    });

    statusFilters.addEventListener('click', function(e) {
        var chip = e.target.closest('.status-chip');
        if (!chip) return;
        var chips = statusFilters.querySelectorAll('.status-chip');
        for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
        chip.classList.add('active');
        currentStatus = chip.dataset.status;
        renderCards();
    });

    sortSelect.addEventListener('change', renderCards);
    searchInput.addEventListener('input', function(e) {
        searchTerm = e.target.value.toLowerCase();
        renderCards();
    });

    // ── MASCOT TOGGLE ─────────────────────────────────────────────
    if (mascotToggle) {
        mascotToggle.addEventListener('click', function() {
            mascotSidebar.classList.toggle('active');
        });
    }

    // Auto-hide mascot sidebar on desktop click outside
    document.addEventListener('click', function(e) {
        if (mascotSidebar && mascotSidebar.classList.contains('active') &&
            !mascotSidebar.contains(e.target) && !mascotToggle.contains(e.target)) {
            mascotSidebar.classList.remove('active');
        }
    });

    // ── COUNTDOWN TIMER (updates every 30 seconds) ────────────────
    function updateCountdowns() {
        var cards = grid.querySelectorAll('.anime-card');
        for (var c = 0; c < cards.length; c++) {
            var card = cards[c];
            var id = parseInt(card.dataset.id, 10);
            var anime = null;
            for (var i = 0; i < animeData.length; i++) {
                if (animeData[i].id === id) { anime = animeData[i]; break; }
            }
            if (!anime || !anime.nextAir) continue;
            var timeInfo = timeUntil(anime.nextAir);
            var days = timeInfo.numericDays;
            var ring = card.querySelector('.ring-progress');
            var txt  = card.querySelector('.ring-text');
            if (ring && txt && days !== null) {
                var offset = Math.max(0, 163.36 - (163.36 * clamp01(days / 30)));
                ring.setAttribute('stroke-dashoffset', offset.toFixed(2));
                txt.textContent = timeInfo.days;
            }
        }
    }
    setInterval(updateCountdowns, 30000);

    // ── SIMULATED LIVE COUNTDOWN (every second for "today" feel) ──
    setInterval(function() {
        var cards = grid.querySelectorAll('.anime-card');
        var now = new Date();
        for (var c = 0; c < cards.length; c++) {
            var card = cards[c];
            var id = parseInt(card.dataset.id, 10);
            var anime = null;
            for (var i = 0; i < animeData.length; i++) {
                if (animeData[i].id === id) { anime = animeData[i]; break; }
            }
            if (!anime || !anime.nextAir) continue;
            var airDate = new Date(anime.nextAir);
            var diff = airDate - now;
            if (diff > 0 && diff < 86400000) {
                var hours = Math.floor(diff / 3600000);
                var mins  = Math.floor((diff % 3600000) / 60000);
                var secs  = Math.floor((diff % 60000) / 1000);
                var txtEl = card.querySelector('.ring-text');
                if (txtEl) {
                    var timeStr = hours + 'h ' + mins + 'm';
                    txtEl.textContent = timeStr;
                }
            }
        }
    }, 1000);

    // ── INITIAL RENDER ────────────────────────────────────────────
    renderCards();

    // ── DYNAMIC SPARKLINE UPDATE (simulate live rating evolution) ──
    setInterval(function() {
        for (var i = 0; i < animeData.length; i++) {
            var a = animeData[i];
            var last = a.spark[a.spark.length - 1];
            var variation = Math.round((Math.random() - 0.45) * 2);
            a.spark.push(Math.max(1, last + variation));
            if (a.spark.length > 30) a.spark.shift();
        }
        renderCards();
    }, 20000);

    // ── INITIAL TOAST ─────────────────────────────────────────────
    setTimeout(function() {
        showToast('Welcome to AnimePulse! Season data loaded.', 'info');
    }, 1000);

});