/**
 * ==========================================================================
 * BRUTALIST WEATHER DASHBOARD - SYSTEM SCRIPT
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STATE MANAGEMENT ---
    const STATE = {
        station: 'BERLIN',
        coords: { lat: 52.5200, lon: 13.4050 },
        isMuted: true,
        isDegraded: false,
        telemetry: {
            temp: 8.2,
            humidity: 94.2,
            baro: 984.1,
            dew: 4.1,
            windSpeed: 48.2,
            windDir: 312,
            windGust: 67.0,
            so2: 412,
            uv: '0.0 (SHIELDED)',
            condition: 'CORROSIVE DRIZZLE'
        }
    };

    // --- PRESET STATIONS DATA GENERATOR ---
    const STATIONS = {
        BERLIN: {
            coords: { lat: 52.5200, lon: 13.4050 },
            baseTemp: 8.2,
            condition: 'CORROSIVE DRIZZLE',
            so2: 412,
            baro: 984.1,
            windSpeed: 48.2,
            windDir: 312,
            windGust: 67.0
        },
        REYKJAVIK: {
            coords: { lat: 64.1466, lon: -21.9426 },
            baseTemp: -3.5,
            condition: 'FREEZING ASH FOAM',
            so2: 789,
            baro: 954.8,
            windSpeed: 68.4,
            windDir: 45,
            windGust: 92.1
        },
        DEATH_VALLEY: {
            coords: { lat: 36.5323, lon: -116.9325 },
            baseTemp: 49.8,
            condition: 'IONIZED THERMAL WAVE',
            so2: 120,
            baro: 1011.3,
            windSpeed: 14.1,
            windDir: 180,
            windGust: 22.4
        },
        NORILSK: {
            coords: { lat: 69.3558, lon: 88.1893 },
            baseTemp: -28.4,
            condition: 'METALLIC FALLOUT BLIZZARD',
            so2: 1850,
            baro: 971.2,
            windSpeed: 52.0,
            windDir: 15,
            windGust: 78.3
        },
        VALPARAISO: {
            coords: { lat: -33.0472, lon: -71.6127 },
            baseTemp: 19.1,
            condition: 'SALINE COASTAL STRATUS',
            so2: 45,
            baro: 1018.5,
            windSpeed: 24.5,
            windDir: 210,
            windGust: 35.0
        }
    };

    // --- AUDIO SYSTEM (SYNTHESIZED BRUTALIST SOUNDS) ---
    // Minimalist Web Audio API integration for authentic industrial feedback
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playBeep(freq, type, duration, vol) {
        if (STATE.isMuted) return;
        try {
            initAudio();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq || 440, audioCtx.currentTime);
            
            gain.gain.setValueAtTime(vol || 0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio synthesis failed or blocked by policy', e);
        }
    }

    // Industrial click feedback
    function clickSound() {
        playBeep(120, 'square', 0.05, 0.15);
        setTimeout(() => playBeep(80, 'triangle', 0.08, 0.1), 30);
    }

    // Warning tone
    function alertSound() {
        playBeep(220, 'sawtooth', 0.3, 0.08);
        setTimeout(() => playBeep(180, 'sawtooth', 0.4, 0.08), 150);
    }

    // Data stream sound
    function dataTickSound() {
        playBeep(1800, 'sine', 0.02, 0.03);
    }

    // --- RADAR SYSTEM (HTML5 CANVAS) ---
    const radarCanvas = document.getElementById('radar-canvas');
    const radarCtx = radarCanvas.getContext('2d');
    let radarAngle = 0;
    const radarBlips = [];

    function resizeRadar() {
        const rect = radarCanvas.parentElement.getBoundingClientRect();
        radarCanvas.width = rect.width;
        radarCanvas.height = rect.height;
    }

    function drawRadar() {
        if (!radarCanvas.width || !radarCanvas.height) return;
        
        const cx = radarCanvas.width / 2;
        const cy = radarCanvas.height / 2;
        const maxRadius = Math.min(cx, cy) * 0.9;

        // Clear with fade trail
        radarCtx.fillStyle = 'rgba(10, 10, 12, 0.08)';
        radarCtx.fillRect(0, 0, radarCanvas.width, radarCanvas.height);

        // Radar grid rings
        radarCtx.strokeStyle = STATE.isDegraded ? 'rgba(255, 0, 85, 0.2)' : 'rgba(0, 255, 102, 0.2)';
        radarCtx.lineWidth = 1;
        for (let r = 0.25; r <= 1; r += 0.25) {
            radarCtx.beginPath();
            radarCtx.arc(cx, cy, maxRadius * r, 0, Math.PI * 2);
            radarCtx.stroke();
        }

        // Radar sweep line
        const sweepX = cx + Math.cos(radarAngle) * maxRadius;
        const sweepY = cy + Math.sin(radarAngle) * maxRadius;

        radarCtx.strokeStyle = STATE.isDegraded ? 'rgba(255, 0, 85, 0.8)' : 'rgba(0, 255, 102, 0.8)';
        radarCtx.lineWidth = 3;
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy);
        radarCtx.lineTo(sweepX, sweepY);
        radarCtx.stroke();

        // Dynamically spawn and render targets / blips
        if (Math.random() < 0.03 && radarBlips.length < 8) {
            const angle = Math.random() * Math.PI * 2;
            const distance = (0.2 + Math.random() * 0.7) * maxRadius;
            radarBlips.push({
                x: cx + Math.cos(angle) * distance,
                y: cy + Math.sin(angle) * distance,
                intensity: 1.0,
                id: Math.floor(Math.random() * 999)
            });
            if (!STATE.isMuted && Math.random() < 0.3) {
                playBeep(900, 'sine', 0.1, 0.02);
            }
        }

        radarBlips.forEach((blip, index) => {
            radarCtx.fillStyle = STATE.isDegraded ? `rgba(255, 234, 0, ${blip.intensity})` : `rgba(0, 225, 217, ${blip.intensity})`;
            radarCtx.beginPath();
            radarCtx.arc(blip.x, blip.y, 4, 0, Math.PI * 2);
            radarCtx.fill();
            
            // Raw telemetry label overlay for each radar artifact
            radarCtx.font = '8px "Share Tech Mono"';
            radarCtx.fillText(`TRG-${blip.id}`, blip.x + 8, blip.y + 3);

            // Fade out
            blip.intensity -= 0.005;
            if (blip.intensity <= 0) {
                radarBlips.splice(index, 1);
            }
        });

        // Increment angle
        radarAngle += 0.015;
        requestAnimationFrame(drawRadar);
    }

    // --- DATA TRANSFORMATION & PRESENTATION ---
    function updateDashboardUI() {
        // Temperature representation
        const tempVal = Math.abs(STATE.telemetry.temp).toFixed(1);
        const sign = STATE.telemetry.temp < 0 ? '-' : '+';
        document.getElementById('main-temp-val').innerText = tempVal;
        document.getElementById('main-temp-sign').innerText = sign;
        
        // General text parameters
        document.getElementById('main-condition').innerText = STATE.telemetry.condition;
        document.getElementById('val-humidity').innerText = `${STATE.telemetry.humidity.toFixed(1)}%`;
        document.getElementById('val-baro').innerText = `${STATE.telemetry.baro.toFixed(1)} hPa`;
        document.getElementById('val-dew').innerText = `${STATE.telemetry.dew.toFixed(1)}°C`;
        document.getElementById('val-so2').innerText = `${STATE.telemetry.so2} ppm`;
        document.getElementById('val-uv').innerText = STATE.telemetry.uv;
        
        // Wind vectors
        document.getElementById('val-wind-speed').innerText = STATE.telemetry.windSpeed.toFixed(1);
        document.getElementById('val-wind-dir').innerText = `${STATE.telemetry.windDir}°`;
        document.getElementById('val-wind-gust').innerText = STATE.telemetry.windGust.toFixed(1);

        // Wind directional arrow update
        const arrow = document.getElementById('wind-arrow');
        arrow.style.transform = `rotate(${STATE.telemetry.windDir}deg)`;

        // Radar coordinate stamp
        const latSign = STATE.coords.lat >= 0 ? 'N' : 'S';
        const lonSign = STATE.coords.lon >= 0 ? 'E' : 'W';
        document.getElementById('scan-coordinates').innerText = 
            `${Math.abs(STATE.coords.lat).toFixed(4)}° ${latSign}, ${Math.abs(STATE.coords.lon).toFixed(4)}° ${lonSign}`;

        // Regenerate Raw JSON Display
        generateJSONOutput();
        
        // Regenerate the forecast matrix based on current telemetry
        generateForecastMatrix();
    }

    function generateJSONOutput() {
        const rawJsonElement = document.getElementById('raw-json-output');
        const simulatedStream = {
            station_id: `STN-${STATE.station.substring(0,3).toUpperCase()}`,
            coordinates: `${STATE.coords.lat.toFixed(4)}, ${STATE.coords.lon.toFixed(4)}`,
            system_epoch: Math.floor(Date.now() / 1000),
            sensor_telemetry: {
                temperature_celsius: STATE.telemetry.temp,
                barometer_hpa: STATE.telemetry.baro,
                humidity_pct: STATE.telemetry.humidity,
                dew_point_c: STATE.telemetry.dew,
                toxic_compounds: {
                    so2_ppm: STATE.telemetry.so2,
                    radiation_uv: STATE.telemetry.uv
                },
                vector_wind: {
                    velocity_knots: STATE.telemetry.windSpeed,
                    bearing_degrees: STATE.telemetry.windDir,
                    gust_peak: STATE.telemetry.windGust
                }
            },
            atmosphere_integrity_code: STATE.telemetry.so2 > 500 ? "CRITICAL_HAZARD" : "STABLE"
        };
        rawJsonElement.textContent = JSON.stringify(simulatedStream, null, 2);
    }

    function generateForecastMatrix() {
        const tbody = document.getElementById('forecast-table-body');
        tbody.innerHTML = ''; // Purge

        const weatherStates = [
            'STABLE ARCTIC', 'CRITICAL ICE EVENT', 'UNSTABLE SEVERE ELECTROMAGNETIC', 
            'CORROSIVE PRECIP', 'TOXIC VAPOR STRATUM', 'DUST SHEAR', 'METALLIC FRONT'
        ];

        for (let i = 1; i <= 6; i++) {
            const offsetHours = i * 12;
            const tempVar = (STATE.telemetry.temp + (Math.sin(i) * 8) + (Math.random() * 2 - 1)).toFixed(1);
            const stabilityIndex = weatherStates[Math.floor(Math.random() * weatherStates.length)];
            const precipProb = Math.floor(Math.random() * 100);
            const localWind = (STATE.telemetry.windSpeed * (0.5 + Math.random())).toFixed(1);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>+${offsetHours} Hours</td>
                <td>${tempVar > 0 ? '+' : ''}${tempVar}°C</td>
                <td>${stabilityIndex}</td>
                <td>${precipProb}%</td>
                <td>${localWind} KN</td>
            `;
            tbody.appendChild(tr);
        }
    }

    // --- EVENT CONTROLLERS ---

    // Station Selector Trigger
    document.getElementById('station-selector').addEventListener('change', (e) => {
        clickSound();
        const stationKey = e.target.value;
        const source = STATIONS[stationKey];
        if (source) {
            STATE.station = stationKey;
            STATE.coords = { ...source.coords };
            STATE.telemetry.temp = source.baseTemp;
            STATE.telemetry.condition = source.condition;
            STATE.telemetry.so2 = source.so2;
            STATE.telemetry.baro = source.baro;
            STATE.telemetry.windSpeed = source.windSpeed;
            STATE.telemetry.windDir = source.windDir;
            STATE.telemetry.windGust = source.windGust;
            
            updateDashboardUI();
        }
    });

    // Raw Coordinates Injection Input
    document.getElementById('btn-inject').addEventListener('click', () => {
        clickSound();
        const inputVal = document.getElementById('coord-input').value;
        const parts = inputVal.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0].trim());
            const lon = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lon)) {
                STATE.coords = { lat, lon };
                // Generate chaotic synthetic weather stats for injected coords
                STATE.telemetry.temp = (Math.random() * 70) - 25;
                STATE.telemetry.condition = 'INJECTED ANOMALOUS VECTOR';
                STATE.telemetry.so2 = Math.floor(Math.random() * 2000);
                STATE.telemetry.baro = 930 + (Math.random() * 90);
                STATE.telemetry.windSpeed = Math.random() * 100;
                STATE.telemetry.windDir = Math.floor(Math.random() * 360);
                STATE.telemetry.windGust = STATE.telemetry.windSpeed * (1.2 + Math.random());
                
                updateDashboardUI();
            } else {
                alertSound();
            }
        } else {
            alertSound();
        }
    });

    // UI Degradation Toggle (Theme Swapper)
    document.getElementById('btn-destruct').addEventListener('click', () => {
        STATE.isDegraded = !STATE.isDegraded;
        if (STATE.isDegraded) {
            document.body.classList.add('degraded');
            document.getElementById('btn-destruct').innerText = 'RESTORE UI';
            alertSound();
        } else {
            document.body.classList.remove('degraded');
            document.getElementById('btn-destruct').innerText = 'DEGRADE UI';
            clickSound();
        }
    });

    // Mute / Unmute
    document.getElementById('btn-sound').addEventListener('click', (e) => {
        STATE.isMuted = !STATE.isMuted;
        if (!STATE.isMuted) {
            initAudio();
            e.target.innerText = 'MUTE AUDIO';
            e.target.style.background = 'var(--fg-primary)';
            e.target.style.color = '#000';
            clickSound();
        } else {
            e.target.innerText = 'UNMUTE AUDIO';
            e.target.style.background = 'var(--bg-primary)';
            e.target.style.color = 'var(--fg-primary)';
        }
    });

    // Re-Query Stream Button
    document.getElementById('btn-refresh-raw').addEventListener('click', () => {
        if (!STATE.isMuted) {
            dataTickSound();
            setTimeout(dataTickSound, 100);
            setTimeout(dataTickSound, 200);
        }
        generateJSONOutput();
    });

    // --- CONTINUOUS DATA DRIFT (Simulation Engine) ---
    setInterval(() => {
        // Subtle real-time drift to make telemetry feel alive
        STATE.telemetry.temp += (Math.random() - 0.5) * 0.2;
        STATE.telemetry.baro += (Math.random() - 0.5) * 0.1;
        STATE.telemetry.windSpeed = Math.max(0, STATE.telemetry.windSpeed + (Math.random() - 0.5) * 1.5);
        STATE.telemetry.windDir = (STATE.telemetry.windDir + Math.floor(Math.random() * 7) - 3 + 360) % 360;
        
        // Random spikes in toxic gases
        if (Math.random() < 0.05) {
            STATE.telemetry.so2 = Math.max(10, STATE.telemetry.so2 + Math.floor((Math.random() - 0.4) * 40));
            if (STATE.telemetry.so2 > 600) {
                alertSound();
            }
        }

        updateDashboardUI();
    }, 4000);

    // Initial setups
    window.addEventListener('resize', resizeRadar);
    resizeRadar();
    updateDashboardUI();
    drawRadar();
});