/* ============================================
1940s MILITARY COMMAND WAR ROOM
STRATEGIC OPERATIONS CENTER - JAVASCRIPT
============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeWarRoom();
});

function initializeWarRoom() {
    initClockSystem();
    initLampSystem();
    initRadioSystem();
    initMapSystem();
    initUnitSystem();
    initGaugeSystem();
    initPropagandaSystem();
    initEmergencySystem();
    initTooltipSystem();
    initAmbientEffects();
    initKonamiCode();
    console.log('[COMMAND] All systems initialized. Strategic Command Online.');
}

function initClockSystem() {
    var dateDisplay = document.getElementById('currentDate');
    var timeDisplay = document.getElementById('currentTime');
    var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    var historicalDate = new Date(1944, 2, 15);
    
    function updateDisplay() {
        var now = new Date();
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        
        if (timeDisplay) {
            timeDisplay.textContent = hours + minutes;
        }
        if (dateDisplay) {
            dateDisplay.textContent = historicalDate.getDate() + ' ' + 
                months[historicalDate.getMonth()] + ' ' + historicalDate.getFullYear();
        }
    }
    
    updateDisplay();
    setInterval(updateDisplay, 1000);
}

function initLampSystem() {
    var overheadLamp = document.getElementById('overheadLamp');
    var lampGlow = document.querySelector('.lamp-glow');
    var shadowCaster = document.querySelector('.shadow-caster');
    var flickerInterval;
    var isFlickering = true;
    
    function performFlicker() {
        if (!isFlickering) return;
        
        var randomIntensity = Math.random();
        var randomDuration = Math.random() * 500 + 100;
        
        if (randomIntensity > 0.85) {
            overheadLamp.style.opacity = '0.6';
            if (lampGlow) lampGlow.style.opacity = '0.5';
            if (shadowCaster) shadowCaster.style.opacity = '1.5';
            setTimeout(function() {
                overheadLamp.style.opacity = '1';
                if (lampGlow) lampGlow.style.opacity = '1';
                if (shadowCaster) shadowCaster.style.opacity = '1';
            }, randomDuration);
        } else if (randomIntensity > 0.7) {
            overheadLamp.style.opacity = '0.8';
            if (lampGlow) lampGlow.style.opacity = '0.7';
            setTimeout(function() {
                overheadLamp.style.opacity = '1';
                if (lampGlow) lampGlow.style.opacity = '1';
            }, randomDuration / 2);
        }
        
        var nextFlicker = Math.random() * 3000 + 2000;
        flickerInterval = setTimeout(performFlicker, nextFlicker);
    }
    
    setTimeout(function() {
        performFlicker();
    }, 1000);
}

function initRadioSystem() {
    var logEntries = document.querySelectorAll('.log-entry');
    var waveformBars = document.querySelectorAll('.wave-bar');
    var freqNeedle = document.getElementById('freqNeedle');
    var interceptLog = document.getElementById('interceptLog');
    var playBtn = document.getElementById('playIntercept');
    var recordBtn = document.getElementById('recordBtn');
    
    logEntries.forEach(function(entry) {
        var staticBar = entry.querySelector('.static-bar');
        if (staticBar) {
            var speed = Math.random() * 2 + 1;
            staticBar.style.animationDuration = speed + 's';
        }
    });
    
    function animateWaveform() {
        waveformBars.forEach(function(bar) {
            var randomHeight = Math.random() * 25 + 10;
            bar.style.height = randomHeight + 'px';
        });
    }
    setInterval(animateWaveform, 150);
    
    function sweepFrequency() {
        if (!freqNeedle) return;
        var currentLeft = parseFloat(freqNeedle.style.left) || 70;
        var newPosition = currentLeft + (Math.random() * 10 - 5);
        newPosition = Math.max(30, Math.min(90, newPosition));
        freqNeedle.style.left = newPosition + '%';
        freqNeedle.style.transform = 'rotate(' + ((newPosition - 70) * 2) + 'deg)';
    }
    setInterval(sweepFrequency, 2000);
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            playBtn.classList.toggle('playing');
            var icon = playBtn.querySelector('.btn-icon');
            icon.textContent = playBtn.classList.contains('playing') ? '||' : String.fromCharCode(9654);
        });
    }
    
    if (recordBtn) {
        var isRecording = false;
        recordBtn.addEventListener('click', function() {
            isRecording = !isRecording;
            recordBtn.classList.toggle('recording');
            recordBtn.style.background = isRecording ? '#8a2a2a' : '';
        });
    }
}

function initMapSystem() {
    var strategyMap = document.getElementById('strategyMap');
    var zoomInBtn = document.getElementById('zoomIn');
    var zoomOutBtn = document.getElementById('zoomOut');
    var toggleGridBtn = document.getElementById('toggleGrid');
    var toggleFogBtn = document.getElementById('toggleFog');
    var gridOverlay = document.querySelector('.grid-overlay');
    var currentZoom = 1;
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            if (currentZoom < 2) {
                currentZoom += 0.2;
                if (strategyMap) {
                    strategyMap.style.transform = 'scale(' + currentZoom + ')';
                    strategyMap.style.transformOrigin = 'center center';
                }
            }
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            if (currentZoom > 0.5) {
                currentZoom -= 0.2;
                if (strategyMap) {
                    strategyMap.style.transform = 'scale(' + currentZoom + ')';
                    strategyMap.style.transformOrigin = 'center center';
                }
            }
        });
    }
    
    if (toggleGridBtn) {
        toggleGridBtn.addEventListener('click', function() {
            toggleGridBtn.classList.toggle('active');
            if (gridOverlay) {
                gridOverlay.classList.toggle('hidden');
            }
        });
    }
    
    if (toggleFogBtn) {
        var fogEnabled = true;
        toggleFogBtn.addEventListener('click', function() {
            fogEnabled = !fogEnabled;
            toggleFogBtn.style.opacity = fogEnabled ? '1' : '0.5';
        });
    }
}

function initUnitSystem() {
    var unitMarkers = document.querySelectorAll('.unit-markers .unit');
    var tokensOverlay = document.getElementById('tokensOverlay');
    
    if (tokensOverlay && unitMarkers.length > 0) {
        createDraggableTokens(unitMarkers);
    }
    
    unitMarkers.forEach(function(unit) {
        unit.addEventListener('click', function(e) {
            var unitName = unit.getAttribute('data-unit');
            var unitStrength = unit.getAttribute('data-strength');
            showUnitDetails(unit, unitName, unitStrength, e);
        });
        
        unit.addEventListener('mouseenter', function() {
            unit.style.filter = 'brightness(1.3) drop-shadow(0 0 10px rgba(218, 168, 48, 0.8))';
        });
        
        unit.addEventListener('mouseleave', function() {
            unit.style.filter = '';
        });
    });
}

function createDraggableTokens(svgUnits) {
    var tokensOverlay = document.getElementById('tokensOverlay');
    if (!tokensOverlay) return;
    
    svgUnits.forEach(function(unit) {
        var transform = unit.getAttribute('transform');
        var match = transform.match(/translate\((\d+),\s*(\d+)\)/);
        if (!match) return;
        
        var x = parseInt(match[1]);
        var y = parseInt(match[2]);
        var isAllied = unit.classList.contains('allied');
        var isArmor = unit.classList.contains('armor');
        var type = isArmor ? String.fromCharCode(0x2B21) : String.fromCharCode(0x265F);
        
        var token = document.createElement('div');
        token.className = 'draggable-token ' + (isAllied ? 'allied' : 'axis');
        token.dataset.originalX = x;
        token.dataset.originalY = y;
        token.dataset.unitName = unit.getAttribute('data-unit');
        token.dataset.strength = unit.getAttribute('data-strength');
        token.innerHTML = '<div class="token-base">' + type + '</div>';
        
        var mapContainer = document.querySelector('.map-table');
        if (mapContainer) {
            var percentX = (x / 1000) * 100;
            var percentY = (y / 700) * 100;
            token.style.left = percentX + '%';
            token.style.top = percentY + '%';
        }
        
        makeTokenDraggable(token);
        tokensOverlay.appendChild(token);
    });
}

function makeTokenDraggable(token) {
    var isDragging = false;
    var startX, startY, offsetX, offsetY;
    
    token.addEventListener('mousedown', function(e) {
        isDragging = true;
        token.classList.add('dragging');
        var rect = token.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        offsetX = rect.left;
        offsetY = rect.top;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        token.style.left = (offsetX + dx) + 'px';
        token.style.top = (offsetY + dy) + 'px';
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            token.classList.remove('dragging');
        }
    });
    
    token.addEventListener('touchstart', function(e) {
        isDragging = true;
        token.classList.add('dragging');
        var touch = e.touches[0];
        var rect = token.getBoundingClientRect();
        startX = touch.clientX;
        startY = touch.clientY;
        offsetX = rect.left;
        offsetY = rect.top;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        var touch = e.touches[0];
        var dx = touch.clientX - startX;
        var dy = touch.clientY - startY;
        token.style.left = (offsetX + dx) + 'px';
        token.style.top = (offsetY + dy) + 'px';
    });
    
    document.addEventListener('touchend', function() {
        if (isDragging) {
            isDragging = false;
            token.classList.remove('dragging');
        }
    });
}

function showUnitDetails(unitElement, unitName, strength, event) {
    var tooltip = document.getElementById('unitTooltip');
    if (!tooltip) return;
    
    var tooltipTitle = document.getElementById('tooltipTitle');
    var tooltipType = document.getElementById('tooltipType');
    var tooltipStrength = document.getElementById('tooltipStrength');
    var tooltipStatus = document.getElementById('tooltipStatus');
    var tooltipCommand = document.getElementById('tooltipCommand');
    
    tooltipTitle.textContent = unitName;
    tooltipStrength.textContent = strength + '%';
    
    var strengthNum = parseInt(strength);
    var status = 'ACTIVE';
    var statusColor = '#5aba5a';
    
    if (strengthNum < 50) {
        status = 'DEGRADED';
        statusColor = '#ba8a2a';
    }
    if (strengthNum < 25) {
        status = 'CRITICAL';
        statusColor = '#ba4a4a';
    }
    
    tooltipStatus.textContent = status;
    tooltipStatus.style.color = statusColor;
    
    var isAllied = unitElement.classList.contains('allied');
    var isArmor = unitElement.classList.contains('armor');
    var isAirborne = unitElement.classList.contains('airborne');
    
    var typeText = 'INFANTRY';
    if (isArmor) typeText = 'ARMOR';
    if (isAirborne) typeText = 'AIRBORNE';
    
    tooltipType.textContent = typeText;
    tooltipType.className = 'tooltip-type' + (isAllied ? '' : ' axis');
    
    var commands = ['7TH ARMY', '3RD CORPS', 'CENTRAL COMMAND', 'RESERVE FORCE'];
    tooltipCommand.textContent = commands[Math.floor(Math.random() * commands.length)];
    
    tooltip.style.left = (event.clientX + 20) + 'px';
    tooltip.style.top = (event.clientY + 20) + 'px';
    tooltip.classList.add('visible');
    
    setTimeout(function() {
        tooltip.classList.remove('visible');
    }, 4000);
}

function initGaugeSystem() {
    var gauges = [
        { valueId: 'steelGauge', needleId: 'steelNeedle', initialValue: 72, min: -135, max: 0 },
        { valueId: 'fuelGauge', needleId: 'fuelNeedle', initialValue: 45, min: -135, max: 0 },
        { valueId: 'armsGauge', needleId: 'armsNeedle', initialValue: 88, min: -135, max: 0 }
    ];
    
    gauges.forEach(function(gauge) {
        var valueElement = document.getElementById(gauge.valueId);
        var needleElement = document.getElementById(gauge.needleId);
        if (!valueElement || !needleElement) return;
        
        var value = parseInt(valueElement.textContent);
        var rotation = gauge.min + (value / 100) * (gauge.max - gauge.min);
        needleElement.style.setProperty('--needle-rotation', rotation + 'deg');
        needleElement.style.transform = 'translateX(-50%) rotate(' + rotation + 'deg)';
        
        function fluctuateValue() {
            var change = Math.random() * 6 - 3;
            var newValue = value + change;
            newValue = Math.max(5, Math.min(100, newValue));
            value = newValue;
            valueElement.textContent = Math.round(newValue);
            
            var newRotation = gauge.min + (newValue / 100) * (gauge.max - gauge.min);
            needleElement.style.transform = 'translateX(-50%) rotate(' + newRotation + 'deg)';
            
            if (newValue < 30) {
                needleElement.style.background = 'linear-gradient(180deg, #ba4a4a 0%, #8a2a2a 100%)';
            } else if (newValue < 60) {
                needleElement.style.background = 'linear-gradient(180deg, #ba8a2a 0%, #8a6a1a 100%)';
            } else {
                needleElement.style.background = 'linear-gradient(180deg, #5aba5a 0%, #3a8a3a 100%)';
            }
        }
        
        setInterval(fluctuateValue, Math.random() * 2000 + 3000);
    });
}

function initPropagandaSystem() {
    var posters = document.querySelectorAll('.poster-frame');
    
    posters.forEach(function(poster) {
        poster.addEventListener('click', function() {
            poster.classList.add('active');
            poster.style.transform = 'scale(1.1)';
            setTimeout(function() {
                poster.style.transform = '';
            }, 200);
        });
        
        poster.addEventListener('mouseenter', function() {
            var rotation = Math.random() * 4 - 2;
            poster.style.transform = 'rotate(' + rotation + 'deg)';
        });
        
        poster.addEventListener('mouseleave', function() {
            poster.style.transform = '';
        });
    });
}

function initEmergencySystem() {
    var emergencyBtn = document.getElementById('emergencyBtn');
    var emergencyModal = document.getElementById('emergencyModal');
    var confirmBtn = document.getElementById('confirmAlert');
    var cancelBtn = document.getElementById('cancelAlert');
    var authInput = document.getElementById('authCode');
    
    if (!emergencyBtn || !emergencyModal) return;
    
    emergencyBtn.addEventListener('click', function() {
        emergencyModal.classList.add('visible');
        authInput.value = '';
        authInput.focus();
    });
    
    cancelBtn.addEventListener('click', function() {
        emergencyModal.classList.remove('visible');
    });
    
    confirmBtn.addEventListener('click', function() {
        var code = authInput.value;
        if (code.length >= 4) {
            emergencyModal.style.borderColor = '#3a8a3a';
            setTimeout(function() {
                emergencyModal.classList.remove('visible');
                emergencyModal.style.borderColor = '';
                flashStatusLights();
            }, 1000);
        } else {
            authInput.style.borderColor = '#8a2a2a';
            authInput.classList.add('shake');
            setTimeout(function() {
                authInput.style.borderColor = '';
                authInput.classList.remove('shake');
            }, 500);
        }
    });
    
    var backdrop = emergencyModal.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', function() {
            emergencyModal.classList.remove('visible');
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emergencyModal.classList.contains('visible')) {
            emergencyModal.classList.remove('visible');
        }
    });
}

function flashStatusLights() {
    var statusLights = document.querySelectorAll('.status-light');
    statusLights.forEach(function(light, index) {
        setTimeout(function() {
            light.style.opacity = '1';
            light.style.boxShadow = '0 0 20px currentColor';
            setTimeout(function() {
                light.style.opacity = '';
                light.style.boxShadow = '';
            }, 200);
        }, index * 100);
    });
}

function initTooltipSystem() {
    var tooltip = document.getElementById('unitTooltip');
    if (!tooltip) return;
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.unit') && !e.target.closest('.unit-tooltip')) {
            tooltip.classList.remove('visible');
        }
    });
    
    tooltip.addEventListener('mouseenter', function() {
        tooltip.classList.add('visible');
    });
    
    tooltip.addEventListener('mouseleave', function() {
        tooltip.classList.remove('visible');
    });
}

function initAmbientEffects() {
    var warRoom = document.getElementById('warRoom');
    
    setInterval(function() {
        if (Math.random() > 0.98) {
            warRoom.style.opacity = '0.95';
            setTimeout(function() {
                warRoom.style.opacity = '1';
            }, 50);
        }
    }, 100);
    
    var indicatorLight = document.querySelector('.indicator-light');
    if (indicatorLight) {
        setInterval(function() {
            if (Math.random() > 0.8) {
                indicatorLight.style.opacity = '0.3';
                setTimeout(function() {
                    indicatorLight.style.opacity = '1';
                }, 100);
            }
        }, 2000);
    }
    
    var style = document.createElement('style');
    style.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .shake { animation: shake 0.3s ease-in-out; }';
    document.head.appendChild(style);
}

function initKonamiCode() {
    var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var currentIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[currentIndex]) {
            currentIndex++;
            if (currentIndex === konamiCode.length) {
                document.body.classList.add('cheat-mode');
                for (var i = 0; i < 3; i++) {
                    setTimeout(function(j) {
                        return function() {
                            document.body.style.filter = 'brightness(2)';
                            setTimeout(function() {
                                document.body.style.filter = '';
                            }, 100);
                        };
                    }(i), j * 200);
                }
                currentIndex = 0;
            }
        } else {
            currentIndex = 0;
        }
    });
}

window.addEventListener('resize', function() {
    // Handle resize if needed
});

console.log('[COMMAND] Strategic Command Center - All Systems Nominal');
console.log('[COMMAND] Ready for operations. Awaiting orders.');