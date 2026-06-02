/**
 * TERRA-OS // PLANETARY COMMAND ENGINE
 * Core logic for data simulation and visual telemetry.
 */

class TerraEngine {
    constructor() {
        this.initElements();
        this.initSeismicCanvas();
        this.initResourceGrid();
        this.startSimulation();
    }

    initElements() {
        // Time elements
        this.galacticTimeEl = document.getElementById('galactic-time');
        this.solarDayEl = document.getElementById('solar-day');
        
        // Ticker and Feeds
        this.volcanoFeedEl = document.getElementById('volcano-feed');
        this.globalTickerEl = document.getElementById('global-ticker');
        this.alertFeedEl = document.getElementById('alert-feed');

        // Data points
        this.popTicker = 8429102331;
        this.gdpIndex = 44291.22;
    }

    initSeismicCanvas() {
        this.canvas = document.getElementById('seismic-wave-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.offset = 0;
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    initResourceGrid() {
        const grid = document.getElementById('resource-grid');
        if (!grid) return;

        // Create 100 cells (10x10)
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            // Randomize "density" based on proximity to simulated nodes
            const density = Math.random();
            if (density > 0.85) {
                cell.style.opacity = '1';
                cell.style.backgroundColor = 'var(--accent-amber)';
                cell.style.boxShadow = '0 0 5px var(--accent-amber)';
            } else if (density > 0.7) {
                cell.style.opacity = '0.6';
                cell.style.backgroundColor = 'var(--accent-cyan)';
            }
            
            grid.appendChild(cell);
        }
    }

    // High-frequency loop for the seismic visualizer
    drawSeismic() {
        const { ctx, canvas, offset } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ff2e4d'; // Crimson
        
        const midY = canvas.height / 2;
        
        for (let x = 0; x < canvas.width; x++) {
            // Create a chaotic sine wave pattern
            const noise = Math.sin(x * 0.05 + offset) * 10 + 
                          Math.sin(x * 0.15 + offset * 0.5) * 5;
            const y = midY + noise;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        this.offset += 0.2; // Speed of the wave
        requestAnimationFrame(() => this.drawSeismic());
    }

    updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
        
        this.galacticTimeEl.textContent = `${h}:${m}:${s}:${ms}`;
        
        // Increment solar day randomly
        if (now.getSeconds() === 0) {
            this.solarDayEl.textContent = parseInt(this.solarDayEl.textContent) + 1;
        }
    }

    simulateData() {
        // 1. Update Population (Rapidly increasing)
        this.popTicker += Math.floor(Math.random() * 5) + 1;
        
        // 2. Update GDP
        this.gdpIndex += (Math.random() - 0.4) * 0.1;

        // 3. Update Ticker Content
        // We'll re-render the ticker content occasionally to simulate new data
        const tickerData = [
            `POPULATION_TOTAL: ${this.popTicker.toLocaleString()} 👥`,
            `GLOBAL_GDP_INDEX: ${this.gdpIndex.toFixed(2)} 📈`,
            `TRADE_FLOW_VELOCITY: ${(420 + Math.random() * 5).toFixed(1)} kT/s 🚢`,
            `ENERGY_CONSUMPTION: ${(1.8 + Math.random() * 0.1).toFixed(2)} TW ⚡`,
            `CARBON_FOOTPRINT: ${(38.2 + Math.random()).toFixed(1)} Gt/yr 🏭`
        ];
        
        // Note: In a production app, we wouldn't re-inject HTML every second, 
        // but for a high-density simulation, it provides the "living" feel.
        this.globalTickerEl.innerHTML = tickerData.map(d => `<span>${d}</span>`).join('');

        // 4. Random Volcanic Events
        if (Math.random() > 0.97) {
            this.triggerVolcanicEvent();
        }
    }

    triggerVolcanicEvent() {
        const sectors = ['Sector 4G', 'Sector 9B', 'Sector 12A', 'Sector 0X'];
        const messages = ['MAGMA_FLOW_DETECTED', 'SEISMIC_SURGE', 'VENT_PRESSURE_HIGH', 'TECTONIC_SHIFT'];
        
        const sector = sectors[Math.floor(Math.random() * sectors.length)];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });

        // Add to log
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="time">${time}</span> <span class="loc">${sector}</span> <span class="msg">${msg}</span>`;
        
        this.volcanoFeedEl.prepend(entry);

        // Keep log small
        if (this.volcanoFeedEl.children.length > 15) {
            this.volcanoFeedEl.removeChild(this.volcanoFeedEl.lastChild);
        }

        // Trigger visual alert
        this.triggerAlert(`⚠️ VOLCANIC_ACTIVITY_${sector}`);
    }

    triggerAlert(text) {
        const alert = document.createElement('div');
        alert.className = 'alert-item';
        alert.textContent = text;
        this.alertFeedEl.innerHTML = ''; // Clear old
        this.alertFeedEl.appendChild(alert);

        // Remove alert after 3 seconds
        setTimeout(() => {
            if (this.alertFeedEl.contains(alert)) {
                this.alertFeedEl.innerHTML = '';
            }
        }, 3000);
    }

    startSimulation() {
        // Start loops
        this.drawSeismic();
        
        // High frequency clock
        setInterval(() => this.updateClock(), 50);
        
        // Medium frequency data updates
        setInterval(() => this.simulateData(), 1000);

        // Randomize progress bars for biosphere
        setInterval(() => {
            const fills = document.querySelectorAll('.progress-bar .fill');
            fills.forEach(fill => {
                const currentWidth = parseFloat(fill.style.width);
                const jitter = (Math.random() - 0.5) * 2;
                const newWidth = Math.min(Math.max(currentWidth + jitter, 10), 95);
                fill.style.width = `${newWidth}%`;
            });
        }, 2000);
    }
}

// Initialize the engine when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.Engine = new TerraEngine();
});