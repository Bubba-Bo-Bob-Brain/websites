// scripts.js
class AnimeTracker {
    constructor() {
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.currentStatus = 'all';
        this.watchedCount = 0;
        
        this.animeData = [
            {
                id: 1,
                title: "星の契約者",
                status: "watching",
                rating: 8.5,
                ratingHistory: [7.2, 7.5, 7.8, 8.0, 8.3, 8.5],
                episodes: 12,
                currentEpisode: 8,
                studio: "スタジオ・フロンティア",
                genre: "Action",
                color: "#e74c3c",
                description: "宇宙を舞台にした壮大な冒険物語。主人公は未知の文明と出会い、運命の契約を結う。",
                airDay: 1,
                airMonth: this.currentMonth + 1
            },
            {
                id: 2,
                title: "魔法少女リリカルなのは",
                status: "completed",
                rating: 9.2,
                ratingHistory: [8.5, 8.7, 8.9, 9.0, 9.1, 9.2],
                episodes: 13,
                currentEpisode: 13,
                studio: "サテライト",
                genre: "Fantasy",
                color: "#9b59b6",
                description: "魔法少女たちの戦いと成長を描く感動の物語。最終回は感動のクライマックス。",
                airDay: 8,
                airMonth: this.currentMonth + 1
            },
            {
                id: 3,
                title: "東京レイヴンズ",
                status: "planning",
                rating: 7.8,
                ratingHistory: [6.5, 7.0, 7.3, 7.5, 7.6, 7.8],
                episodes: 12,
                currentEpisode: 0,
                studio: "brains・base",
                genre: "Mystery",
                color: "#3498db",
                description: "謎の存在との戦いと都市の秘密を探る。独特な世界観が人気を集める。",
                airDay: 15,
                airMonth: this.currentMonth + 2
            },
            {
                id: 4,
                title: "青春猪頭少年",
                status: "watching",
                rating: 8.8,
                ratingHistory: [7.0, 7.5, 7.9, 8.2, 8.5, 8.8],
                episodes: 12,
                currentEpisode: 10,
                studio: "CloverWorks",
                genre: "Romance",
                color: "#e91e63",
                description: "思春期の悩みと成長をリアルに描いた作品。ファンタジーな設定が人気。",
                airDay: 22,
                airMonth: this.currentMonth + 1
            },
            {
                id: 5,
                title: "鬼滅の刃",
                status: "completed",
                rating: 9.5,
                ratingHistory: [9.0, 9.1, 9.2, 9.3, 9.4, 9.5],
                episodes: 26,
                currentEpisode: 26,
                studio: "ufotable",
                genre: "Action",
                color: "#f39c12",
                description: "最高の作画と感動のストーリーでアニメ界を席巻。完璧なアニメーション。",
                airDay: 5,
                airMonth: this.currentMonth
            },
            {
                id: 6,
                title: "スパイラル",
                status: "on-hold",
                rating: 6.5,
                ratingHistory: [6.0, 6.2, 5.8, 6.1, 6.3, 6.5],
                episodes: 11,
                currentEpisode: 6,
                studio: "J.C.Staff",
                genre: "Thriller",
                color: "#2c3e50",
                description: "心理戦が得意な作品。独特な展開とキャラクター設定が特徴。",
                airDay: 10,
                airMonth: this.currentMonth + 1
            }
        ];
        
        this.init();
    }
    
    init() {
        this.renderAnimeGrid();
        this.updateProgress();
        this.bindEvents();
        this.updateMascotExpression();
    }
    
    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentStatus = e.target.dataset.status;
                this.renderAnimeGrid();
                this.updateProgress();
                this.updateMascotExpression();
            });
        });
        
        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.renderCalendarHeader();
            this.renderAnimeGrid();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.renderCalendarHeader();
            this.renderAnimeGrid();
        });
    }
    
    renderCalendarHeader() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('current-month-year').textContent = 
            `${monthNames[this.currentMonth]} ${this.currentYear}`;
    }
    
    renderAnimeGrid() {
        const grid = document.getElementById('anime-grid');
        grid.innerHTML = '';
        
        const filteredAnime = this.currentStatus === 'all' 
            ? this.animeData 
            : this.animeData.filter(anime => anime.status === this.currentStatus);
        
        // Count watched for progress
        this.watchedCount = this.animeData.filter(a => a.status === 'completed').length;
        
        filteredAnime.forEach(anime => {
            const card = this.createAnimeCard(anime);
            grid.appendChild(card);
        });
        
        this.updateProgress();
        this.updateMascotExpression();
    }
    
    createAnimeCard(anime) {
        const card = document.createElement('div');
        card.className = 'anime-card';
        
        // Calculate countdown
        const daysUntilAir = this.calculateDaysUntilAir(anime.airDay, anime.airMonth);
        
        card.innerHTML = `
            <div class="anime-header">
                <h3 class="anime-title">${anime.title}</h3>
                <span class="status-badge status-${anime.status}">${anime.status}</span>
            </div>
            <div class="anime-info">
                <p class="anime-desc">${anime.description}</p>
                
                <div class="rating-section">
                    <div class="rating-score">${anime.rating}</div>
                    <div class="sparkline-container">
                        <svg class="sparkline" viewBox="0 0 100 20">
                            <polyline fill="none" stroke="#f39c12" stroke-width="2" 
                                points="${this.generateSparklinePoints(anime.ratingHistory)}" />
                        </svg>
                    </div>
                </div>
                
                <div class="countdown-section">
                    <div class="countdown-ring">
                        <div class="countdown-value">
                            <div class="countdown-days">${daysUntilAir >= 0 ? daysUntilAir : 0}</div>
                            <div class="countdown-label">Days</div>
                        </div>
                    </div>
                    <div>
                        <div style="font-family: var(--font-display); font-size: 0.8rem; color: var(--text-light);">
                            Ep ${anime.currentEpisode} / ${anime.episodes}
                        </div>
                        <div style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">
                            Next: ${this.getMonthName(anime.airMonth)} ${anime.airDay}, ${this.currentYear}
                        </div>
                    </div>
                </div>
                
                <div class="studio-info">
                    <div class="studio-icon">🎬</div>
                    <span class="studio-name">${anime.studio}</span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    generateSparklinePoints(ratings) {
        const width = 100;
        const height = 20;
        const points = [];
        const step = width / (ratings.length - 1);
        
        ratings.forEach((rating, index) => {
            const x = index * step;
            const y = height - ((rating - 5) * 3); // Scale rating to fit
            points.push(`${x},${y}`);
        });
        
        return points.join(' ');
    }
    
    calculateDaysUntilAir(airDay, airMonth) {
        const today = new Date();
        const airDate = new Date(this.currentYear, airMonth - 1, airDay);
        
        // If air date has passed this month, use next month
        if (airDate < today && airMonth === this.currentMonth + 1) {
            airDate.setMonth(airDate.getMonth() + 1);
        }
        
        const diffTime = airDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    getMonthName(monthIndex) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex - 1];
    }
    
    updateProgress() {
        const total = this.animeData.length;
        const watched = this.watchedCount;
        const percentage = total > 0 ? (watched / total) * 100 : 0;
        
        document.getElementById('watched-count').textContent = watched;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
    }
    
    updateMascotExpression() {
        const mascot = document.querySelector('.chibi-mascot');
        const watched = this.watchedCount;
        const total = this.animeData.length;
        const percentage = total > 0 ? (watched / total) * 100 : 0;
        
        // Change expression based on progress
        const mouth = mascot.querySelector('.chibi-mouth');
        const eyes = mascot.querySelectorAll('.pupil');
        
        if (percentage === 0) {
            mouth.style.borderBottomColor = '#e74c3c';
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.pupil');
                pupil.style.width = '3px';
                pupil.style.height = '3px';
            });
        } else if (percentage < 50) {
            mouth.style.borderBottomColor = '#f39c12';
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.pupil');
                pupil.style.width = '5px';
                pupil.style.height = '5px';
            });
        } else if (percentage < 100) {
            mouth.style.borderBottomColor = '#2ecc71';
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.pupil');
                pupil.style.width = '6px';
                pupil.style.height = '6px';
            });
        } else {
            mouth.style.borderBottomColor = '#9b59b6';
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.pupil');
                pupil.style.width = '8px';
                pupil.style.height = '4px';
            });
        }
    }
}

// Initialize the anime tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AnimeTracker();
});

// Add some interactive background effects
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.background = `
        linear-gradient(
            ${135 + x * 45}deg, 
            #${Math.floor(x * 255).toString(16)}${Math.floor(y * 255).toString(16)}1a 0%, 
            #${Math.floor((1-x) * 255).toString(16)}${Math.floor((1-y) * 255).toString(16)}1e 50%, 
            #0f3460 100%
        )
    `;
});