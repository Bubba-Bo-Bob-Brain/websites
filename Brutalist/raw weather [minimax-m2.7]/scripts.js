/* ============================================
   WEATHER DATA TERMINAL v2.4.1
   JAVASCRIPT ENGINE
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       CONFIGURATION
       ============================================ */
    const CONFIG = {
        updateInterval: 15000,
        animationDuration: 3000,
        clockFormat: '24h',
        enableDebug: false
    };

    /* ============================================
       STATE MANAGEMENT
       ============================================ */
    const state = {
        data: {
            current: {
                temperature: -4,
                temperatureRaw: -4.2,
                feelsLike: -9,
                humidity: 67,
                pressure: 1013,
                pressureTrend: 'falling',
                windSpeed: 38,
                windDirection: 247,
                windGusts: 54,
                cloudCover: 42,
                visibility: 16.1,
                dewPoint: -8,
                condition: 'partly_cloudy',
                uvIndex: 1.2,
                aqi: 23,
                sunrise: '07:42',
                sunset: '16:28',
                solarNoon: '12:05'
            },
            alerts: [
                {
                    type: 'severe',
                    message: 'HEAVY WINDS EXPECTED 14:00-22:00 UTC',
                    active: true,
                    severity: 'warning'
                }
            ],
            system: {
                lastUpdate: null,
                connectionStatus: 'online',
                cacheStatus: 'hit'
            }
        },
        refs: {},
        isInitialized: false
    };

    /* ============================================
       INITIALIZATION
       ============================================ */
    document.addEventListener('DOMContentLoaded', function() {
        initializeTerminal();
    });

    function initializeTerminal() {
        logMessage('WEATHER TERMINAL v2.4.1 INITIALIZING...');
        cacheDOMElements();
        initClock();
        initWeatherData();
        initAnimations();
        initInteractions();
        initDataStream();
        initAlertSystem();
        state.isInitialized = true;
        logMessage('TERMINAL READY. ALL SYSTEMS NOMINAL.');
        triggerBootSequence();
    }

    /* ============================================
       DOM CACHE
       ============================================ */
    function cacheDOMElements() {
        state.refs = {
            timestamp: document.getElementById('timestamp'),
            clock: document.getElementById('clock'),
            mainTemp: document.getElementById('mainTemp'),
            tempSign: document.querySelector('.temp-sign'),
            tempFahrenheit: document.querySelector('.temp-fahrenheit'),
            tempFeelsLike: document.querySelector('.temp-feels-like'),
            dataTags: document.querySelectorAll('.data-tag'),
            weatherIcon: document.getElementById('weatherIcon'),
            conditionText: document.querySelector('.condition-text'),
            conditionDetails: document.querySelector('.condition-details'),
            windArrow: document.getElementById('windArrow'),
            windSpeed: document.querySelector('.wind-speed'),
            windDirection: document.querySelector('.wind-direction-text'),
            windGusts: document.querySelector('.gust-value'),
            humidityBar: document.getElementById('humidityBar'),
            humidityValue: document.querySelector('.humidity-value'),
            precipRows: document.querySelectorAll('.precip-row'),
            moonPhase: document.getElementById('moonPhase'),
            moonLabel: document.querySelector('.moon-label'),
            hourlyTable: document.getElementById('hourlyTable'),
            hourlyRows: document.querySelectorAll('.forecast-table tbody tr'),
            dayCards: document.querySelectorAll('.day-card'),
            aqiNumber: document.querySelector('.aqi-number'),
            aqiStatus: document.querySelector('.aqi-status'),
            aqiRows: document.querySelectorAll('.aqi-row'),
            uvValue: document.querySelector('.uv-value'),
            uvLabel: document.querySelector('.uv-label'),
            uvMarker: document.querySelector('.uv-marker'),
            alertBanner: document.getElementById('alertBanner'),
            allPanels: document.querySelectorAll('[class*="-panel"], [class*="-hero"], [class*="-section"]'),
            floatingStatus: document.querySelector('.floating-status')
        };
    }

    /* ============================================
       CLOCK MODULE
       ============================================ */
    function initClock() {
        updateClock();
        updateTimestamp();
        setInterval(updateClock, 1000);
        setInterval(updateTimestamp, 60000);
    }

    function updateClock() {
        const now = new Date();
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        const timeString = hours + ':' + minutes + ':' + seconds;
        
        if (state.refs.clock) {
            const timeDisplay = state.refs.clock.querySelector('.time-display');
            if (timeDisplay) {
                timeDisplay.textContent = timeString;
            }
        }
    }

    function updateTimestamp() {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        const timestamp = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' UTC';
        
        if (state.refs.timestamp) {
            state.refs.timestamp.textContent = timestamp;
            state.data.system.lastUpdate = timestamp;
        }
    }

    /* ============================================
       WEATHER DATA MODULE
       ============================================ */
    function initWeatherData() {
        updateTemperatureDisplay();
        updateWindDisplay();
        updateHumidityDisplay();
        updateConditionDisplay();
        updateAstronomyDisplay();
        updateAQIDisplay();
        updateUVDisplay();
        updateTableHighlight();
    }

    function updateTemperatureDisplay() {
        const current = state.data.current;
        const refs = state.refs;
        
        if (refs.mainTemp) {
            animateValue(refs.mainTemp, parseInt(refs.mainTemp.textContent, 10), current.temperature, 1500);
        }
        
        if (refs.tempSign) {
            if (current.temperature >= 0) {
                refs.tempSign.textContent = '+';
                refs.tempSign.style.color = '#ff6600';
            } else {
                refs.tempSign.textContent = '\u2212';
                refs.tempSign.style.color = '#0099ff';
            }
        }
        
        if (refs.tempFahrenheit) {
            const fahrenheit = Math.round(current.temperature * 9 / 5 + 32);
            const currentVal = parseInt(refs.tempFahrenheit.textContent, 10) || fahrenheit;
            animateValue(refs.tempFahrenheit, currentVal, fahrenheit, 1500, '\u00B0F');
        }
        
        if (refs.tempFeelsLike) {
            const feelsFahrenheit = Math.round(current.feelsLike * 9 / 5 + 32);
            refs.tempFeelsLike.textContent = 'FEELS LIKE: ' + current.feelsLike + '\u00B0C / ' + feelsFahrenheit + '\u00B0F';
        }
        
        applyTemperatureTheme(current.temperature);
    }

    function updateWindDisplay() {
        const current = state.data.current;
        const refs = state.refs;
        
        if (refs.windArrow) {
            refs.windArrow.style.transform = 'rotate(' + current.windDirection + 'deg)';
        }
        
        if (refs.windSpeed) {
            const currentVal = parseInt(refs.windSpeed.textContent, 10) || current.windSpeed;
            animateValue(refs.windSpeed, currentVal, current.windSpeed, 1000, ' KM/H');
        }
        
        if (refs.windDirection) {
            const directionText = getCardinalDirection(current.windDirection);
            refs.windDirection.textContent = directionText + ' (' + current.windDirection + '\u00B0)';
        }
        
        if (refs.windGusts) {
            const gustMatch = refs.windGusts.textContent.match(/\d+/);
            const currentGust = gustMatch ? parseInt(gustMatch[0], 10) : current.windGusts;
            animateValue(refs.windGusts, currentGust, current.windGusts, 1000, ' KM/H');
        }
        
        applyWindIntensity(current.windSpeed);
    }

    function updateHumidityDisplay() {
        const current = state.data.current;
        const refs = state.refs;
        
        if (refs.humidityBar) {
            setTimeout(function() {
                refs.humidityBar.style.width = current.humidity + '%';
            }, 500);
        }
        
        if (refs.humidityValue) {
            const currentVal = parseInt(refs.humidityValue.textContent, 10) || current.humidity;
            animateValue(refs.humidityValue, currentVal, current.humidity, 1000, '%');
        }
        
        updatePrecipitationData();
    }

    function updatePrecipitationData() {
        const precipData = [
            { key: 'PRECIPITATION:', val: '0.0', unit: ' MM' },
            { key: 'SNOW_DEPTH:', val: Math.floor(5 + Math.random() * 10), unit: ' CM' },
            { key: 'CHANCE_RAIN:', val: Math.floor(Math.random() * 20), unit: '%' },
            { key: 'CHANCE_SNOW:', val: Math.floor(70 + Math.random() * 25), unit: '%' }
        ];
        
        const refs = state.refs;
        if (refs.precipRows && refs.precipRows.length >= 4) {
            refs.precipRows.forEach(function(row, index) {
                var valEl = row.querySelector('.precip-val');
                if (valEl && precipData[index]) {
                    valEl.textContent = precipData[index].val + precipData[index].unit;
                    flashElement(valEl);
                }
            });
        }
    }

    function updateConditionDisplay() {
        const current = state.data.current;
        const refs = state.refs;
        const conditions = {
            'partly_cloudy': 'PARTLY_CLOUDY',
            'cloudy': 'CLOUDY',
            'sunny': 'CLEAR_SKY',
            'snow': 'SNOW_LIKELY',
            'rain': 'RAIN_EXPECTED',
            'storm': 'STORM_ALERT'
        };
        
        if (refs.conditionText) {
            refs.conditionText.textContent = conditions[current.condition] || current.condition.toUpperCase();
        }
        
        updateWeatherIcon(current.condition);
        updateConditionDetails();
    }

    function updateConditionDetails() {
        const current = state.data.current;
        const refs = state.refs;
        
        if (refs.conditionDetails) {
            const details = [
                { key: 'CLOUD_COVER:', val: current.cloudCover + '%' },
                { key: 'VISIBILITY:', val: current.visibility.toFixed(1) + ' KM' },
                { key: 'PRESSURE:', val: current.pressure + ' hPa ' + (current.pressureTrend === 'rising' ? '\u2191' : '\u2193') },
                { key: 'DEW_POINT:', val: current.dewPoint + '\u00B0C' }
            ];
            
            const detailRows = refs.conditionDetails.querySelectorAll('.detail-row');
            detailRows.forEach(function(row, index) {
                var valEl = row.querySelector('.detail-val');
                if (valEl && details[index]) {
                    valEl.textContent = details[index].val;
                }
            });
        }
    }

    function updateAstronomyDisplay() {
        const refs = state.refs;
        const moonPhaseData = calculateMoonPhase(new Date());
        
        if (refs.moonLabel) {
            refs.moonLabel.textContent = moonPhaseData.name;
        }
        
        if (refs.moonPhase) {
            updateMoonSVG(moonPhaseData.phase);
        }
    }

    function updateMoonSVG(phase) {
        const svg = document.querySelector('#moonPhase svg');
        if (svg) {
            const circle = svg.querySelector('circle:last-child');
            if (circle) {
                const cx = 35 + (phase * 30);
                circle.setAttribute('cx', cx);
            }
        }
    }

    function updateAQIDisplay() {
        const current = state.data.current;
        const refs = state.refs;
        
        if (refs.aqiNumber) {
            const currentVal = parseInt(refs.aqiNumber.textContent, 10) || current.aqi;
            animateValue(refs.aqiNumber, currentVal, current.aqi, 1000);
        }
        
        if (refs.aqiStatus) {
            const status = getAQIStatus(current.aqi);
            refs.aqiStatus.textContent = status.label.toUpperCase();
            refs.aqiStatus.className = 'aqi-status ' + status.class;
        }
        
        if (refs.aqiRows && refs.aqiRows.length >= 4) {
            const pollutants = [
                { name: 'PM2.5:', val: (Math.random() * 15).toFixed(1) + ' \u00B5g/m\u00B3' },
                { name: 'PM10:', val: (Math.random() * 25).toFixed(1) + ' \u00B5g/m\u00B3' },
                { name: 'O3:', val: (Math.random() * 30).toFixed(1) + ' ppb' },
                { name: 'NO2:', val: (Math.random() * 20).toFixed(1) + ' ppb' }
            ];
            
            refs.aqiRows.forEach(function(row, index) {
                var valEl = row.querySelector('.pollutant-val');
                if (valEl && pollutants[index]) {
                    valEl.textContent = pollutants[index].val;
                }
            });
        }
    }

    function updateUVDisplay() {
        const current = state.data.current;
        const refs = state.refs;
        
        if (refs.uvValue) {
            const currentVal = parseFloat(refs.uvValue.textContent) || current.uvIndex;
            animateValue(refs.uvValue, currentVal, current.uvIndex, 1000);
        }
        
        if (refs.uvLabel) {
            refs.uvLabel.textContent = getUVStatus(current.uvIndex).toUpperCase();
        }
        
        if (refs.uvMarker) {
            const position = Math.min((current.uvIndex / 11) * 100, 95);
            refs.uvMarker.style.left = position + '%';
        }
    }

    function updateTableHighlight() {
        const refs = state.refs;
        if (refs.hourlyRows) {
            const now = new Date();
            const currentHour = now.getUTCHours();
            
            refs.hourlyRows.forEach(function(row, index) {
                var hour = 14 + index;
                if (hour === currentHour || (currentHour >= 14 && index === 0)) {
                    row.classList.add('current-hour');
                } else {
                    row.classList.remove('current-hour');
                }
            });
        }
    }

    /* ============================================
       ANIMATION MODULE
       ============================================ */
    function initAnimations() {
        setTimeout(function() {
            triggerEntranceAnimations();
        }, 100);
        
        startGlitchEffect();
    }

    function triggerEntranceAnimations() {
        const panels = state.refs.allPanels;
        if (panels) {
            panels.forEach(function(panel, index) {
                setTimeout(function() {
                    panel.style.opacity = '1';
                }, index * 50);
            });
        }
    }

    function triggerBootSequence() {
        const bootMessages = [
            '> INITIALIZING DATA STREAM...',
            '> CONNECTING TO NOAA API...',
            '> PARSING METEOROLOGICAL DATA...',
            '> CALIBRATING SENSORS...',
            '> SYSTEM READY.'
        ];
        
        bootMessages.forEach(function(msg, index) {
            setTimeout(function() {
                logMessage(msg);
            }, index * 400);
        });
    }

    function startGlitchEffect() {
        setInterval(function() {
            if (Math.random() > 0.95) {
                triggerGlitch();
            }
        }, 2000);
    }

    function triggerGlitch() {
        const title = document.querySelector('.site-title');
        if (title) {
            const original = title.textContent;
            title.style.color = Math.random() > 0.5 ? '#ff00ff' : '#00ffff';
            title.style.transform = 'translateX(' + (Math.random() * 4 - 2) + 'px)';
            
            setTimeout(function() {
                title.textContent = original;
                title.style.color = '';
                title.style.transform = '';
            }, 100);
        }
    }

    /* ============================================
       INTERACTION MODULE
       ============================================ */
    function initInteractions() {
        initHoverEffects();
        initClickEffects();
        initKeyboardNavigation();
        initTableInteractions();
    }

    function initHoverEffects() {
        const panels = state.refs.allPanels;
        const dayCards = state.refs.dayCards;
        
        if (panels) {
            panels.forEach(function(panel) {
                panel.addEventListener('mouseenter', function() {
                    if (state.isInitialized) {
                        panel.style.zIndex = '30';
                    }
                });
                
                panel.addEventListener('mouseleave', function() {
                    panel.style.zIndex = '';
                });
            });
        }
        
        if (dayCards) {
            dayCards.forEach(function(card) {
                card.addEventListener('mouseenter', function() {
                    card.style.transform = 'scale(1.05) translateY(-5px)';
                    card.style.boxShadow = '0 10px 30px rgba(255, 102, 0, 0.3)';
                });
                
                card.addEventListener('mouseleave', function() {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                });
            });
        }
    }

    function initClickEffects() {
        const tempWrapper = document.querySelector('.temp-giant-wrapper');
        const alertBanner = state.refs.alertBanner;
        
        if (tempWrapper) {
            tempWrapper.addEventListener('click', function() {
                toggleTemperatureUnit();
            });
        }
        
        if (alertBanner) {
            alertBanner.addEventListener('click', function(e) {
                if (e.target !== document.querySelector('.alert-text')) {
                    toggleAlertBanner();
                }
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                refreshWeatherData();
            }
            if (e.code === 'KeyA') {
                toggleAlertBanner();
            }
        });
    }

    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            var focusable = document.querySelectorAll('.day-card, .panel-header');
            var currentIndex = 0;
            
            focusable.forEach(function(el, i) {
                if (el === document.activeElement) {
                    currentIndex = i;
                }
            });
            
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (focusable[currentIndex + 1]) {
                    focusable[currentIndex + 1].focus();
                }
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (focusable[currentIndex - 1]) {
                    focusable[currentIndex - 1].focus();
                }
            }
        });
    }

    function initTableInteractions() {
        const table = state.refs.hourlyTable;
        
        if (table) {
            const headers = table.querySelectorAll('th');
            headers.forEach(function(header, index) {
                header.style.cursor = 'pointer';
                
                header.addEventListener('click', function() {
                    sortTable(index);
                });
                
                header.addEventListener('mouseenter', function() {
                    header.style.background = '#00ffff';
                    header.style.color = '#000';
                });
                
                header.addEventListener('mouseleave', function() {
                    header.style.background = '';
                    header.style.color = '';
                });
            });
        }
    }

    /* ============================================
       DATA STREAM MODULE
       ============================================ */
    function initDataStream() {
        setInterval(refreshWeatherData, CONFIG.updateInterval);
        startDataFluctuations();
    }

    function refreshWeatherData() {
        logMessage('> REFRESHING DATA...');
        
        const current = state.data.current;
        current.temperatureRaw += (Math.random() - 0.5) * 0.4;
        current.humidity = Math.max(0, Math.min(100, current.humidity + Math.floor(Math.random() * 3) - 1));
        current.windSpeed = Math.max(0, current.windSpeed + Math.floor(Math.random() * 6) - 3);
        current.windGusts = Math.max(0, current.windGusts + Math.floor(Math.random() * 8) - 4);
        current.pressure = Math.max(980, Math.min(1040, current.pressure + Math.floor(Math.random() * 2) - 1));
        current.cloudCover = Math.max(0, Math.min(100, current.cloudCover + Math.floor(Math.random() * 5) - 2));
        current.uvIndex = Math.max(0, Math.min(11, current.uvIndex + Math.random() * 0.2));
        
        updateTemperatureDisplay();
        updateWindDisplay();
        updateHumidityDisplay();
        updateConditionDisplay();
        updateAstronomyDisplay();
        updateAQIDisplay();
        updateUVDisplay();
        updateTableHighlight();
        
        flashUpdateIndicator();
    }

    function startDataFluctuations() {
        setInterval(function() {
            const current = state.data.current;
            current.temperatureRaw += (Math.random() - 0.5) * 0.1;
            current.windDirection = (current.windDirection + (Math.random() - 0.5) * 2 + 360) % 360;
            
            const windArrow = state.refs.windArrow;
            if (windArrow) {
                windArrow.style.transform = 'rotate(' + current.windDirection + 'deg)';
            }
            
            updateTimestamp();
        }, 3000);
    }

    /* ============================================
       ALERT SYSTEM
       ============================================ */
    function initAlertSystem() {
        const alertBanner = state.refs.alertBanner;
        if (alertBanner) {
            setTimeout(function() {
                // Keep alert visible for demo
            }, 30000);
        }
        
        setInterval(checkForAlerts, 60000);
    }

    function checkForAlerts() {
        if (Math.random() > 0.9) {
            const alertTypes = [
                { type: 'warning', message: 'FROST ADVISORY: TEMPERATURES DROPPING BELOW FREEZING' },
                { type: 'info', message: 'AIR QUALITY NOTICE: MODERATE POLLEN LEVELS DETECTED' },
                { type: 'severe', message: 'HIGH WIND WARNING: GUSTS UP TO 70 KM/H POSSIBLE' }
            ];
            
            const newAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            state.data.alerts.push(Object.assign({ active: true }, newAlert));
            showNewAlert(newAlert);
        }
    }

    function showNewAlert(alert) {
        logMessage('> ALERT: ' + alert.message);
    }

    function toggleAlertBanner() {
        const banner = state.refs.alertBanner;
        if (banner) {
            banner.classList.toggle('hidden');
            logMessage('> ALERT DISMISSED');
        }
    }

    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */
    function animateValue(element, start, end, duration, suffix) {
        if (!element) return;
        
        const startTime = performance.now();
        const diff = end - start;
        suffix = suffix || '';
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (diff * easeOutQuart);
            
            if (suffix === '\u00B0F' || suffix === '%') {
                element.textContent = Math.round(current) + suffix;
            } else {
                element.textContent = current.toFixed(suffix === '\u00B0C' ? 1 : 0) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function getCardinalDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    function getAQIStatus(aqi) {
        if (aqi <= 50) return { label: 'GOOD', class: 'good', color: '#00ff41' };
        if (aqi <= 100) return { label: 'MODERATE', class: 'moderate', color: '#ffff00' };
        return { label: 'UNHEALTHY', class: 'unhealthy', color: '#ff3333' };
    }

    function getUVStatus(uv) {
        if (uv < 3) return 'LOW';
        if (uv < 6) return 'MODERATE';
        if (uv < 8) return 'HIGH';
        if (uv < 11) return 'VERY HIGH';
        return 'EXTREME';
    }

    function calculateMoonPhase(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const c = Math.floor(365.25 * year);
        const e = Math.floor(30.6 * month);
        const jd = (c + e + day - 694039.09) / 29.5305882;
        const phase = jd - Math.floor(jd);
        
        const phases = [
            { name: 'NEW_MOON', phase: 0 },
            { name: 'WAXING_CRESCENT', phase: 0.125 },
            { name: 'FIRST_QUARTER', phase: 0.25 },
            { name: 'WAXING_GIBBOUS', phase: 0.375 },
            { name: 'FULL_MOON', phase: 0.5 },
            { name: 'WANING_GIBBOUS', phase: 0.625 },
            { name: 'LAST_QUARTER', phase: 0.75 },
            { name: 'WANING_CRESCENT', phase: 0.875 }
        ];
        
        const closest = phases.reduce(function(prev, curr) {
            return Math.abs(curr.phase - phase) < Math.abs(prev.phase - phase) ? curr : prev;
        });
        
        return closest;
    }

    function applyTemperatureTheme(temp) {
        const root = document.documentElement;
        let color;
        
        if (temp <= -10) {
            color = '#0099ff';
        } else if (temp <= 0) {
            color = '#00bfff';
        } else if (temp <= 15) {
            color = '#00ff41';
        } else if (temp <= 25) {
            color = '#ffff00';
        } else {
            color = '#ff6600';
        }
        
        root.style.setProperty('--temp-accent', color);
    }

    function applyWindIntensity(speed) {
        const intensity = Math.min(speed / 60, 1);
        document.body.style.setProperty('--wind-intensity', intensity);
        
        if (speed > 50) {
            document.body.classList.add('high-wind');
        } else {
            document.body.classList.remove('high-wind');
        }
    }

    function toggleTemperatureUnit() {
        const refs = state.refs;
        const current = state.data.current;
        
        if (refs.tempFahrenheit) {
            const isFahrenheit = refs.tempFahrenheit.textContent.indexOf('\u00B0F') > -1;
            if (isFahrenheit) {
                const celsius = current.temperature;
                const currentVal = parseInt(refs.tempFahrenheit.textContent, 10);
                animateValue(refs.tempFahrenheit, currentVal, celsius, 500, '\u00B0C');
                logMessage('> DISPLAY: CELSIUS');
            } else {
                const fahrenheit = Math.round(current.temperature * 9 / 5 + 32);
                const currentVal = parseInt(refs.tempFahrenheit.textContent, 10);
                animateValue(refs.tempFahrenheit, currentVal, fahrenheit, 500, '\u00B0F');
                logMessage('> DISPLAY: FAHRENHEIT');
            }
        }
    }

    function flashUpdateIndicator() {
        const timestamp = state.refs.timestamp;
        if (timestamp) {
            timestamp.style.color = '#00ffff';
            timestamp.style.textShadow = '0 0 20px #00ffff';
            setTimeout(function() {
                timestamp.style.color = '';
                timestamp.style.textShadow = '';
            }, 500);
        }
    }

    function flashElement(element) {
        element.style.transition = 'none';
        element.style.color = '#00ffff';
        setTimeout(function() {
            element.style.transition = 'color 0.3s ease';
            element.style.color = '';
        }, 150);
    }

    function sortTable(columnIndex) {
        logMessage('> SORTING BY COLUMN ' + columnIndex);
        
        const table = state.refs.hourlyTable;
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const ths = table.querySelectorAll('th');
        
        ths.forEach(function(th) {
            th.style.background = '';
        });
        ths[columnIndex].style.background = '#00ffff';
        ths[columnIndex].style.color = '#000';
        
        rows.sort(function(a, b) {
            const aVal = a.cells[columnIndex].textContent;
            const bVal = b.cells[columnIndex].textContent;
            const aNum = parseFloat(aVal.replace(/[^\d.-]/g, ''));
            const bNum = parseFloat(bVal.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return aNum - bNum;
            }
            return aVal.localeCompare(bVal);
        });
        
        rows.forEach(function(row) {
            tbody.appendChild(row);
        });
    }

    /* ============================================
       WEATHER ICON SYSTEM
       ============================================ */
    function updateWeatherIcon(condition) {
        const refs = state.refs;
        if (!refs.weatherIcon) return;
        
        const icons = {
            'partly_cloudy': '<svg viewBox="0 0 100 100" class="icon-svg"><circle cx="35" cy="35" r="20" fill="currentColor" opacity="0.8"/><circle cx="50" cy="30" r="15" fill="currentColor" opacity="0.6"/><rect x="10" y="55" width="80" height="35" rx="5" fill="currentColor" opacity="0.3"/><rect x="20" y="45" width="60" height="20" rx="3" fill="currentColor" opacity="0.5"/></svg>',
            'cloudy': '<svg viewBox="0 0 100 100" class="icon-svg"><rect x="10" y="30" width="80" height="50" rx="10" fill="currentColor" opacity="0.4"/><rect x="20" y="20" width="60" height="40" rx="8" fill="currentColor" opacity="0.6"/><rect x="30" y="40" width="40" height="30" rx="5" fill="currentColor" opacity="0.8"/></svg>',
            'sunny': '<svg viewBox="0 0 100 100" class="icon-svg"><circle cx="50" cy="50" r="25" fill="currentColor"/><g stroke="currentColor" stroke-width="3"><line x1="50" y1="10" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="90"/><line x1="10" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="90" y2="50"/><line x1="22" y1="22" x2="29" y2="29"/><line x1="71" y1="71" x2="78" y2="78"/><line x1="22" y1="78" x2="29" y2="71"/><line x1="71" y1="29" x2="78" y2="22"/></g></svg>',
            'snow': '<svg viewBox="0 0 100 100" class="icon-svg"><rect x="15" y="25" width="70" height="40" rx="8" fill="currentColor" opacity="0.4"/><circle cx="25" cy="75" r="4" fill="currentColor"/><circle cx="50" cy="80" r="5" fill="currentColor"/><circle cx="75" cy="72" r="4" fill="currentColor"/><circle cx="35" cy="85" r="3" fill="currentColor"/><circle cx="60" cy="88" r="4" fill="currentColor"/></svg>',
            'rain': '<svg viewBox="0 0 100 100" class="icon-svg"><rect x="15" y="20" width="70" height="35" rx="8" fill="currentColor" opacity="0.4"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="30" y1="60" x2="25" y2="75"/><line x1="50" y1="65" x2="45" y2="80"/><line x1="70" y1="60" x2="65" y2="75"/><line x1="40" y1="70" x2="35" y2="85"/><line x1="60" y1="75" x2="55" y2="90"/></g></svg>'
        };
        
        refs.weatherIcon.innerHTML = icons[condition] || icons['partly_cloudy'];
        refs.weatherIcon.style.transform = 'scale(1.1)';
        
        setTimeout(function() {
            refs.weatherIcon.style.transform = 'scale(1)';
        }, 200);
    }

    /* ============================================
       DEBUG & LOGGING
       ============================================ */
    function logMessage(message) {
        if (CONFIG.enableDebug) {
            console.log('[' + new Date().toISOString() + '] ' + message);
        }
    }

    /* ============================================
       DYNAMIC STYLES INJECTION
       ============================================ */
    function injectDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = [
            '.click-ripple {',
            '    position: absolute;',
            '    background: rgba(0, 255, 255, 0.3);',
            '    border-radius: 50%;',
            '    transform: translate(-50%, -50%) scale(0);',
            '    animation: ripple-effect 0.6s ease-out forwards;',
            '    pointer-events: none;',
            '}',
            '@keyframes ripple-effect {',
            '    to {',
            '        transform: translate(-50%, -50%) scale(4);',
            '        opacity: 0;',
            '    }',
            '}',
            'body.high-wind .wind-panel {',
            '    animation: wind-shake 0.5s ease-in-out infinite;',
            '}',
            '@keyframes wind-shake {',
            '    0%, 100% { transform: rotate(-1deg); }',
            '    50% { transform: rotate(1deg); }',
            '}'
        ].join('');
        
        document.head.appendChild(style);
    }

    /* ============================================
       INITIALIZE DYNAMIC STYLES
       ============================================ */
    injectDynamicStyles();

})();