/* ============================================================
   NEXUS WEATHER TERMINAL v4.2.1
   ENGINE — RAW_DATA_INJECTOR
   NO FRAMEWORKS // NO LIBRARIES // NO MERCY
   ============================================================ */

(function () {
    'use strict';

    /* --------------------------------------------------
       UTILITY FUNCTIONS
       -------------------------------------------------- */

    function padZero(num, size) {
        var s = String(num);
        while (s.length < size) { s = '0' + s; }
        return s;
    }

    function formatTime(date) {
        return padZero(date.getUTCHours(), 2) + ':' +
               padZero(date.getUTCMinutes(), 2) + ':' +
               padZero(date.getUTCSeconds(), 2);
    }

    function formatLocalTime(date) {
        var h = date.getHours();
        var m = date.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) { h = 12; }
        return padZero(h, 2) + ':' + padZero(m, 2) + ' ' + ampm;
    }

    function formatLocalTime24(date) {
        return padZero(date.getHours(), 2) + ':' + padZero(date.getMinutes(), 2);
    }

    function formatDate(date) {
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return padZero(date.getDate(), 2) + ' ' + months[date.getMonth()];
    }

    function getDayName(date) {
        var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        return days[date.getDay()];
    }

    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomFloat(min, max, decimals) {
        var val = Math.random() * (max - min) + min;
        return val.toFixed(decimals);
    }

    /* --------------------------------------------------
       CLOCK & UPTIME
       -------------------------------------------------- */

    var uptimeSeconds = 0;

    function updateClock() {
        var now = new Date();
        document.getElementById('sys-clock').textContent = formatTime(now) + ' UTC';
        document.getElementById('last-update').textContent = formatLocalTime24(now);
        uptimeSeconds++;
        var h = Math.floor(uptimeSeconds / 3600);
        var m = Math.floor((uptimeSeconds % 3600) / 60);
        var s = uptimeSeconds % 60;
        document.getElementById('uptime').textContent =
            padZero(h, 3) + ':' + padZero(m, 2) + ':' + padZero(s, 2);
    }

    setInterval(updateClock, 1000);
    updateClock();

    /* --------------------------------------------------
       HOURLY FORECAST DATA GENERATOR
       -------------------------------------------------- */

    var conditions = [
        { code: 'CLR', label: 'CLEAR' },
        { code: 'FEW', label: 'FEW CLD' },
        { code: 'SCT', label: 'SCT CLD' },
        { code: 'BKN', label: 'BKN CLD' },
        { code: 'OVC', label: 'OVERCAST' },
        { code: 'RA', label: 'RAIN' },
        { code: '-RA', label: 'LGT RAIN' },
        { code: '+RA', label: 'HVY RAIN' },
        { code: 'TS', label: 'TSTORM' },
        { code: '-TSRA', label: 'LGT TSTM' },
        { code: '+TSRA', label: 'HVY TSTM' },
        { code: 'BR', label: 'MIST' },
        { code: 'FG', label: 'FOG' },
        { code: 'HZ', label: 'HAZE' }
    ];

    var windDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

    function generateHourlyData() {
        var tbody = document.getElementById('hourly-body');
        var now = new Date();
        var baseTemp = 89;
        var html = '';

        for (var i = 0; i < 24; i++) {
            var hour = new Date(now.getTime() + i * 3600000);
            var hourStr = formatLocalTime(hour);
            var isSevere = i > 5 && i < 12 && Math.random() > 0.4;
            var isNight = hour.getHours() < 6 || hour.getHours() > 20;

            var tempVariation = isNight ? -8 - Math.random() * 6 : Math.sin((hour.getHours() - 6) / 14 * Math.PI) * 12;
            var temp = Math.round(baseTemp + tempVariation);
            var feelsLike = temp + randomRange(-3, 8);

            var condIndex;
            if (isSevere) {
                condIndex = Math.random() > 0.5 ? 9 : 10;
            } else if (i > 3 && i < 14 && Math.random() > 0.6) {
                condIndex = randomRange(5, 10);
            } else {
                condIndex = randomRange(0, 4);
            }
            var cond = conditions[condIndex];

            var windSpd = isSevere ? randomRange(18, 45) : randomRange(3, 22);
            var windDir = windDirections[randomRange(0, 15)];
            var gust = windSpd + randomRange(0, isSevere ? 20 : 10);
            var humidity = isSevere ? randomRange(80, 98) : randomRange(45, 85);
            var precipChance = isSevere ? randomRange(70, 98) : (cond.code.indexOf('RA') >= 0 || cond.code.indexOf('TS') >= 0 ? randomRange(50, 85) : randomRange(0, 20));
            var dewPoint = Math.round(71 - randomRange(0, 15));
            var vis = isSevere ? randomFloat(0.5, 3.0, 1) : randomFloat(3.0, 10.0, 1);

            var rowClass = isSevere ? ' class="cell-severe"' : '';

            html += '<tr' + rowClass + '>';
            html += '<td><strong>' + hourStr + '</strong></td>';

            if (temp >= 95) {
                html += '<td class="cell-hot">' + temp + '°F</td>';
            } else if (temp <= 50) {
                html += '<td class="cell-cold">' + temp + '°F</td>';
            } else {
                html += '<td>' + temp + '°F</td>';
            }

            html += '<td>' + feelsLike + '°F</td>';

            if (isSevere) {
                html += '<td class="cell-severe">' + cond.label + '</td>';
            } else if (cond.code.indexOf('RA') >= 0 || cond.code.indexOf('TS') >= 0) {
                html += '<td class="cell-rain">' + cond.label + '</td>';
            } else {
                html += '<td>' + cond.label + '</td>';
            }

            if (windSpd >= 25) {
                html += '<td class="cell-wind">' + windSpd + ' MPH</td>';
            } else {
                html += '<td>' + windSpd + ' MPH</td>';
            }

            html += '<td>' + windDir + '</td>';

            if (gust >= 30) {
                html += '<td class="cell-wind">' + gust + '</td>';
            } else {
                html += '<td>' + gust + '</td>';
            }

            html += '<td>' + humidity + '%</td>';

            if (precipChance >= 50) {
                html += '<td class="cell-rain">' + precipChance + '%</td>';
            } else {
                html += '<td>' + precipChance + '%</td>';
            }

            html += '<td>' + dewPoint + '°F</td>';

            if (vis <= 3) {
                html += '<td class="cell-warn">' + vis + ' KM</td>';
            } else {
                html += '<td>' + vis + ' KM</td>';
            }

            html += '</tr>';
        }

        tbody.innerHTML = html;
    }

    /* --------------------------------------------------
       7-DAY FORECAST DATA GENERATOR
       -------------------------------------------------- */

    function generateDailyData() {
        var tbody = document.getElementById('daily-body');
        var now = new Date();
        var html = '';
        var baseHigh = 94;
        var baseLow = 76;

        var dayConditions = [
            { code: 'TS', label: 'TSTORMS', wind: 'SW 18', rain: 45, precip: '24MM' },
            { code: 'RA', label: 'RAIN', wind: 'W 14', rain: 80, precip: '12MM' },
            { code: 'SCT', label: 'SCT CLD', wind: 'NW 10', rain: 20, precip: '0MM' },
            { code: 'CLR', label: 'SUNNY', wind: 'N 8', rain: 5, precip: '0MM' },
            { code: 'FEW', label: 'M SUNNY', wind: 'NE 6', rain: 10, precip: '0MM' },
            { code: 'BKN', label: 'BKN CLD', wind: 'E 12', rain: 35, precip: '3MM' },
            { code: '+TS', label: 'HVY TSTM', wind: 'S 25', rain: 90, precip: '38MM' }
        ];

        var confidences = ['HIGH', 'HIGH', 'MED', 'MED', 'MED', 'LOW', 'LOW'];

        for (var i = 0; i < 7; i++) {
            var day = new Date(now.getTime() + i * 86400000);
            var dayName = i === 0 ? 'TODAY' : (i === 1 ? 'TOMORROW' : getDayName(day));
            var dateStr = formatDate(day);
            var high = baseHigh - i * 2 + randomRange(-3, 3);
            var low = baseLow - i * 1 + randomRange(-2, 2);
            var cond = dayConditions[i];
            var humidity = randomRange(50, 90);
            var rainChance = cond.rain;

            var sunriseH = 5 + Math.floor(Math.random() * 2);
            var sunriseM = randomRange(30, 55);
            var sunsetH = 20 + Math.floor(Math.random() * 1);
            var sunsetM = randomRange(10, 35);

            html += '<tr>';
            html += '<td><strong>' + dayName + '</strong></td>';
            html += '<td>' + dateStr + '</td>';

            if (high >= 95) {
                html += '<td class="cell-hot">' + high + '°F</td>';
            } else {
                html += '<td>' + high + '°F</td>';
            }

            html += '<td>' + low + '°F</td>';

            if (cond.code.indexOf('TS') >= 0) {
                html += '<td class="cell-severe">' + cond.label + '</td>';
            } else if (cond.code.indexOf('RA') >= 0) {
                html += '<td class="cell-rain">' + cond.label + '</td>';
            } else {
                html += '<td>' + cond.label + '</td>';
            }

            var windParts = cond.wind.split(' ');
            var windNum = parseInt(windParts[1]);
            if (windNum >= 20) {
                html += '<td class="cell-wind">' + cond.wind + '</td>';
            } else {
                html += '<td>' + cond.wind + '</td>';
            }

            html += '<td>' + humidity + '%</td>';

            if (rainChance >= 70) {
                html += '<td class="cell-rain">' + rainChance + '%</td>';
            } else if (rainChance >= 40) {
                html += '<td class="cell-hot">' + rainChance + '%</td>';
            } else {
                html += '<td>' + rainChance + '%</td>';
            }

            html += '<td>' + cond.precip + '</td>';

            if (cond.code.indexOf('+') >= 0) {
                html += '<td class="cell-hot">' + randomFloat(0.5, 2.0, 1) + 'CM</td>';
            } else {
                html += '<td>0.0CM</td>';
            }

            html += '<td>' + padZero(sunriseH, 2) + ':' + padZero(sunriseM, 2) + ' AM</td>';
            html += '<td>' + padZero(sunsetH - 12, 2) + ':' + padZero(sunsetM, 2) + ' PM</td>';

            if (confidences[i] === 'HIGH') {
                html += '<td class="cell-confidence-high">' + confidences[i] + '</td>';
            } else if (confidences[i] === 'MED') {
                html += '<td class="cell-confidence-med">' + confidences[i] + '</td>';
            } else {
                html += '<td class="cell-confidence-low">' + confidences[i] + '</td>';
            }

            html += '</tr>';
        }

        tbody.innerHTML = html;
    }

    /* --------------------------------------------------
       WIND COMPASS ANIMATION
       -------------------------------------------------- */

    var windDirectionIndex = 11;
    var windDirectionsDeg = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5,
                             180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5];

    function updateWindCompass() {
        var arrow = document.getElementById('wind-arrow');
        var dirText = document.getElementById('wind-dir');
        var speedText = document.getElementById('wind-speed');
        var gustText = document.getElementById('wind-gust');

        if (!arrow) { return; }

        var currentDir = windDirectionsDeg[windDirectionIndex];
        var displayDir = windDirections[windDirectionIndex];

        arrow.style.transform = 'translate(-50%, -100%) rotate(' + currentDir + 'deg)';
        dirText.textContent = displayDir;

        var baseSpeed = randomRange(8, 25);
        var gust = baseSpeed + randomRange(5, 18);
        speedText.textContent = baseSpeed + ' MPH';
        gustText.textContent = gust + ' MPH';
    }

    setInterval(function () {
        windDirectionIndex = (windDirectionIndex + randomRange(-1, 1) + 16) % 16;
        updateWindCompass();
    }, 4000);

    updateWindCompass();

    /* --------------------------------------------------
       GAUGE ANIMATIONS
       -------------------------------------------------- */

    function animateGauges() {
        var humidity = randomRange(70, 92);
        var pressure = (1000 + Math.random() * 20).toFixed(1);
        var dewPoint = randomRange(60, 76);
        var uv = randomRange(4, 10);

        var humBar = document.getElementById('humidity-bar');
        var humText = document.getElementById('humidity-text');
        var presBar = document.getElementById('pressure-bar');
        var presText = document.getElementById('pressure-text');
        var dewBar = document.getElementById('dewpoint-bar');
        var dewText = document.getElementById('dewpoint-text');
        var uvBar = document.getElementById('uv-bar');
        var uvText = document.getElementById('uv-text');

        if (humBar) { humBar.style.width = humidity + '%'; }
        if (humText) { humText.textContent = humidity + '%'; }
        if (presBar) { presBar.style.width = ((pressure - 990) / 30 * 100) + '%'; }
        if (presText) { presText.textContent = pressure + ' hPa'; }
        if (dewBar) { dewBar.style.width = (dewPoint / 90 * 100) + '%'; }
        if (dewText) { dewText.textContent = dewPoint + '°F'; }
        if (uvBar) { uvBar.style.width = (uv / 11 * 100) + '%'; }
        if (uvText) { uvText.textContent = uv + (uv >= 8 ? ' VERY HIGH' : (uv >= 6 ? ' HIGH' : ' MOD')); }
    }

    setInterval(animateGauges, 6000);
    animateGauges();

    /* --------------------------------------------------
       MAIN TEMPERATURE FLUCTUATION
       -------------------------------------------------- */

    function fluctuateTemperature() {
        var tempEl = document.getElementById('main-temp');
        var feelsEl = document.getElementById('feels-like');
        if (!tempEl) { return; }

        var baseTemp = 89;
        var fluctuation = randomRange(-2, 2);
        var newTemp = baseTemp + fluctuation;
        var newFeels = newTemp + randomRange(5, 10);

        tempEl.textContent = newTemp;
        if (feelsEl) { feelsEl.textContent = newFeels + '°F'; }
    }

    setInterval(fluctuateTemperature, 8000);

    /* --------------------------------------------------
       ALERT SYSTEM — JARRING COLOR SHIFTS
       -------------------------------------------------- */

    var alertBanner = document.getElementById('alert-banner');
    var alertText = document.getElementById('alert-text');
    var alertCount = document.getElementById('alert-count');

    var alertMessages = [
        'SEVERE THUNDERSTORM WARNING IN EFFECT — SEEK SHELTER IMMEDIATELY',
        'HEAT ADVISORY EXTENDED — HEAT INDEX VALUES UP TO 105°F EXPECTED',
        'FLOOD WATCH ISSUED — HEAVY RAINFALL MAY CAUSE URBAN FLOODING',
        'TORNADO WATCH UNTIL 10 PM — CONDITIONS FAVOR TORNADIC DEVELOPMENT',
        'WIND ADVISORY — SUSTAINED WINDS 35-45 MPH WITH GUSTS TO 60'
    ];

    var alertStates = [
        { class: 'alert-severe', color: '#ff0000' },
        { class: 'alert-watch', color: '#e8d44d' },
        { class: 'alert-extreme', color: '#8000ff' },
        { class: 'alert-severe', color: '#ff0000' },
        { class: 'alert-watch', color: '#ff8c00' }
    ];

    var alertIndex = 0;

    function cycleAlert() {
        if (!alertBanner) { return; }

        alertBanner.classList.remove('hidden');

        if (alertIndex % 7 === 0) {
            alertBanner.classList.add('hidden');
            setTimeout(cycleAlert, 5000);
            alertIndex++;
            return;
        }

        var alertIdx = alertIndex % alertMessages.length;
        alertBanner.className = '';
        alertBanner.classList.add(alertStates[alertIdx].class);
        if (alertText) { alertText.textContent = alertMessages[alertIdx]; }

        alertIndex++;
        setTimeout(cycleAlert, 12000);
    }

    setTimeout(cycleAlert, 3000);

    /* --------------------------------------------------
       AQI UPDATER
       -------------------------------------------------- */

    function updateAQI() {
        var aqiVal = document.getElementById('aqi-value');
        var aqiDesc = document.getElementById('aqi-desc');
        if (!aqiVal) { return; }

        var aqi = randomRange(55, 130);
        var desc, color;

        if (aqi <= 50) {
            desc = 'GOOD';
            color = '#3ddc84';
        } else if (aqi <= 100) {
            desc = 'MODERATE';
            color = '#e8d44d';
        } else if (aqi <= 150) {
            desc = 'UNHEALTHY (SG)';
            color = '#ff8c00';
        } else {
            desc = 'UNHEALTHY';
            color = '#ff3b3b';
        }

        aqiVal.textContent = aqi;
        aqiVal.style.color = color;
        if (aqiDesc) {
            aqiDesc.textContent = desc;
            aqiDesc.style.color = color;
        }
    }

    setInterval(updateAQI, 15000);

    /* --------------------------------------------------
       VISIBILITY / CEILING / CLOUD UPDATER
       -------------------------------------------------- */

    function updateVisibility() {
        var visEl = document.getElementById('visibility');
        var ceilEl = document.getElementById('ceiling');
        var cldEl = document.getElementById('cloud-cover');
        var rainEl = document.getElementById('rainfall');

        if (visEl) { visEl.textContent = randomFloat(1.5, 8.0, 1); }
        if (ceilEl) { ceilEl.textContent = (randomRange(1500, 8000)).toLocaleString(); }
        if (cldEl) { cldEl.textContent = randomRange(30, 95); }
        if (rainEl) { rainEl.textContent = randomFloat(0.0, 3.5, 2); }
    }

    setInterval(updateVisibility, 20000);

    /* --------------------------------------------------
       MOON PHASE UPDATER
       -------------------------------------------------- */

    var moonPhases = [
        'NEW MOON', 'WAXING CRESCENT', 'FIRST QUARTER', 'WAXING GIBBOUS',
        'FULL MOON', 'WANING GIBBOUS', 'LAST QUARTER', 'WANING CRESCENT'
    ];

    function updateMoon() {
        var phaseEl = document.getElementById('moon-phase');
        var illumEl = document.getElementById('moon-illum');
        var moonIcon = document.getElementById('moon-icon');
        var moonDark = moonIcon ? moonIcon.querySelector('.moon-dark') : null;

        if (!phaseEl) { return; }

        var phaseIdx = randomRange(0, 7);
        var illum = Math.round((phaseIdx <= 4 ? phaseIdx : 8 - phaseIdx) / 8 * 100);

        phaseEl.textContent = moonPhases[phaseIdx];
        if (illumEl) { illumEl.textContent = illum + '% ILLUMINATED'; }

        if (moonDark) {
            var darkWidth = Math.round((100 - illum) / 100 * 80);
            moonDark.style.width = darkWidth + 'px';
        }
    }

    setInterval(updateMoon, 30000);
    updateMoon();

    /* --------------------------------------------------
       METAR UPDATER
       -------------------------------------------------- */

    function updateMETAR() {
        var now = new Date();
        var day = padZero(now.getUTCDate(), 2);
        var time = padZero(now.getUTCHours(), 2) + padZero(now.getUTCMinutes(), 2) + 'Z';

        var windDir = randomRange(180, 350);
        var windSpd = randomRange(8, 28);
        var gust = windSpd + randomRange(5, 20);
        var vis = randomRange(2, 10);

        var skyOptions = [
            'FEW025 SCT040 BKN080',
            'BKN032 BKN060 OVC090',
            'SCT015 BKN030 OVC050',
            'OVC012 BKN025',
            'FEW040 SCT250',
            'BKN050 OVC100'
        ];
        var sky = skyOptions[randomRange(0, skyOptions.length - 1)];

        var weatherOptions = ['', '-RA', 'BR', '-TSRA', '-RA BR', 'HZ', '+RA'];
        var weather = weatherOptions[randomRange(0, weatherOptions.length - 1)];

        var temp = randomRange(22, 30);
        var dew = temp - randomRange(2, 6);
        var altim = (2970 + Math.random() * 30).toFixed(0);

        var metarDisplay = document.querySelector('.metar-display');
        if (!metarDisplay) { return; }

        var lines = metarDisplay.querySelectorAll('.metar-line');

        if (lines[0]) {
            lines[0].innerHTML =
                '<span class="metar-stn">KNYC</span> ' +
                '<span class="metar-time">' + day + time + '</span> ' +
                '<span class="metar-auto">AUTO</span>';
        }

        if (lines[1]) {
            var gustStr = gust > windSpd + 10 ? 'G' + gust + 'KT' : '';
            lines[1].innerHTML =
                '<span class="metar-wind">' + padZero(windDir, 3) + padZero(windSpd, 2) + gustStr + '</span> ' +
                '<span class="metar-vis">' + vis + 'SM</span> ' +
                (weather ? '<span class="metar-weather">' + weather + '</span>' : '');
        }

        if (lines[2]) {
            lines[2].innerHTML = '<span class="metar-sky">' + sky + '</span>';
        }

        if (lines[3]) {
            lines[3].innerHTML =
                '<span class="metar-temp">' + temp + '/' + dew + '</span> ' +
                '<span class="metar-dew">A' + altim + '</span>';
        }
    }

    setInterval(updateMETAR, 25000);
    updateMETAR();

    /* --------------------------------------------------
       HIGH/LOW TREND UPDATER
       -------------------------------------------------- */

    function updateHighLow() {
        var highEl = document.getElementById('temp-high');
        var lowEl = document.getElementById('temp-low');
        var trendEl = document.querySelector('.panel-data.trend-down') || document.querySelector('.panel-data');

        if (highEl) { highEl.textContent = (randomRange(90, 102)) + '°F'; }
        if (lowEl) { lowEl.textContent = (randomRange(68, 80)) + '°F'; }

        if (trendEl) {
            var isRising = Math.random() > 0.5;
            trendEl.textContent = isRising ? '▲ RISING' : '▼ FALLING';
            trendEl.className = 'panel-data ' + (isRising ? 'trend-up' : 'trend-down');
        }
    }

    setInterval(updateHighLow, 10000);

    /* --------------------------------------------------
       SYSTEM LOG — CONSOLE EASTER EGG
       -------------------------------------------------- */

    function logSystemBoot() {
        var logs = [
            '%c[NEXUS::BOOT] WEATHER TERMINAL v4.2.1 INITIALIZED',
            '%c[DATA::SOURCE] CONNECTING TO NOAA/NWS FEED...',
            '%c[DATA::SOURCE] CONNECTION ESTABLISHED — LATENCY: 47ms',
            '%c[WIND::CALC] COMPASS MODULE LOADED — 16 POINT RESOLUTION',
            '%c[ALERT::NMS] NATIONAL WEATHER SERVICE ALERT SYSTEM ACTIVE',
            '%c[RENDER::DOM] ALL ELEMENTS MOUNTED — 0 ERRORS',
            '%c[SYSTEM] NEXUS WEATHER TERMINAL OPERATIONAL'
        ];
        var styles = [
            'color: #3ddc84; font-weight: bold;',
            'color: #888;',
            'color: #3ddc84;',
            'color: #00d4ff;',
            'color: #ff3b3b; font-weight: bold;',
            'color: #3ddc84;',
            'color: #e8d44d; font-weight: bold;'
        ];
        for (var i = 0; i < logs.length; i++) {
            console.log(logs[i], styles[i]);
        }
        console.log(
            '%c⚠ THIS IS A DELIBERATELY RAW BRUTALIST WEATHER DASHBOARD ⚠',
            'color: #ff3b3b; font-size: 14px; font-weight: bold;'
        );
    }

    logSystemBoot();

    /* --------------------------------------------------
       INITIALIZE ALL DATA
       -------------------------------------------------- */

    generateHourlyData();
    generateDailyData();

    /* --------------------------------------------------
       RE-GENERATE HOURLY DATA PERIODICALLY
       -------------------------------------------------- */

    setInterval(generateHourlyData, 600000);

    /* --------------------------------------------------
       ASCII RADAR PULSE — SIMPLE ANIMATION
       -------------------------------------------------- */

    var radarChars = ['.', '#', '%', '█'];
    var radarEl = document.getElementById('ascii-radar');

    function pulseRadar() {
        if (!radarEl) { return; }
        var text = radarEl.textContent;
        var newText = '';
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            var idx = radarChars.indexOf(ch);
            if (idx >= 0 && Math.random() > 0.95) {
                newText += radarChars[(idx + 1) % radarChars.length];
            } else {
                newText += ch;
            }
        }
        radarEl.textContent = newText;
    }

    setInterval(pulseRadar, 3000);

    /* --------------------------------------------------
       TICKER CONTENT DYNAMIC UPDATE
       -------------------------------------------------- */

    function updateTicker() {
        var tickerContent = document.getElementById('ticker-content');
        if (!tickerContent) { return; }

        var humidity = randomRange(70, 92);
        var pressure = (1000 + Math.random() * 20).toFixed(1);
        var uv = randomRange(4, 10);
        var vis = randomFloat(1.5, 8.0, 1);
        var heatIdx = randomRange(90, 105);
        var dewPt = randomRange(60, 76);
        var rain24 = randomFloat(0.0, 3.5, 2);

        var parts = [
            '/// HUMIDITY: ' + humidity + '% ' + (humidity > 85 ? 'HIGH' : 'RISING') + ' ///',
            'BAROMETRIC PRESSURE: ' + pressure + ' hPa ' + (pressure < 1010 ? 'FALLING RAPIDLY' : 'STEADY') + ' ///',
            'UV INDEX: ' + uv + ' — ' + (uv >= 8 ? 'VERY HIGH' : 'HIGH') + ' ///',
            'VISIBILITY: ' + vis + ' KM — ' + (vis < 4 ? 'REDUCED' : 'OK') + ' ///',
            'HEAT INDEX: ' + heatIdx + '°F — CAUTION ///',
            'DEWPOINT: ' + dewPt + '°F ///',
            'RAINFALL 24H: ' + rain24 + ' IN ///',
            'SNOW DEPTH: 0.0 IN ///',
            'MOON PHASE: ' + moonPhases[randomRange(0, 7)] + ' ///'
        ];

        var doubled = parts.concat(parts);
        tickerContent.innerHTML = '';
        for (var i = 0; i < doubled.length; i++) {
            var span = document.createElement('span');
            span.textContent = doubled[i];
            tickerContent.appendChild(span);
        }
    }

    setInterval(updateTicker, 30000);

})();