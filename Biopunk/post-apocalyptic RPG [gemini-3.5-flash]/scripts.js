document.addEventListener('DOMContentLoaded', () => {
    const headerToxicityElement = document.getElementById('header-toxicity');
    const specimenViabilityElement = document.getElementById('specimen-viability');
    const specimenMutationsElement = document.getElementById('specimen-mutations');
    const genomeIntegrityBar = document.getElementById('genome-integrity');
    const btnSplice = document.getElementById('btn-splice');
    const btnReset = document.getElementById('btn-reset');
    const anomalyDetails = document.getElementById('anomaly-details');
    const organicBlob = document.querySelector('.organic-blob-svg');
    const greenVialFluid = document.querySelector('.green-vial .vial-fluid');
    const redVialFluid = document.querySelector('.red-vial .vial-fluid');
    const geneNodes = document.querySelectorAll('.gene-node');
    const radarBlips = document.querySelectorAll('.radar-blip');

    const statElements = {
        armor: document.getElementById('stat-armor'),
        offense: document.getElementById('stat-offense'),
        intellect: document.getElementById('stat-intellect'),
        utility: document.getElementById('stat-utility')
    };

    const baseStats = { armor: 10, offense: 15, intellect: 5, utility: 8 };
    let currentStats = { ...baseStats };
    let selectedMutagens = [];
    let splicedCount = 0;
    let typewriterTimeout = null;

    function runAtmosphericFluctuations() {
        setInterval(() => {
            const currentToxicity = parseInt(headerToxicityElement.textContent);
            const fluctuation = Math.floor(Math.random() * 11) - 5;
            const updatedToxicity = Math.max(100, currentToxicity + fluctuation);
            headerToxicityElement.textContent = `${updatedToxicity} mSv`;
        }, 4000);
    }

    function typeWriteText(text, targetElement) {
        if (typewriterTimeout) {
            clearTimeout(typewriterTimeout);
        }
        
        targetElement.textContent = '';
        let index = 0;
        
        function nextChar() {
            if (index < text.length) {
                targetElement.textContent += text.charAt(index);
                index++;
                typewriterTimeout = setTimeout(nextChar, 25);
            }
        }
        nextChar();
    }

    function calculateStats() {
        currentStats = { ...baseStats };
        let integrityPenalty = 0;

        selectedMutagens.forEach(node => {
            const statType = node.getAttribute('data-stat');
            const statValue = parseInt(node.getAttribute('data-cost'));
            currentStats[statType] += statValue;
            integrityPenalty += 20;
        });

        Object.keys(statElements).forEach(key => {
            statElements[key].textContent = currentStats[key];
        });

        const integrityValue = Math.max(0, 100 - integrityPenalty);
        genomeIntegrityBar.style.width = `${integrityValue}%`;

        if (integrityValue < 50) {
            genomeIntegrityBar.style.background = 'var(--neon-crimson)';
        } else {
            genomeIntegrityBar.style.background = 'linear-gradient(90deg, var(--neon-crimson), var(--neon-bile))';
        }

        btnSplice.disabled = selectedMutagens.length === 0;
    }

    geneNodes.forEach(node => {
        node.addEventListener('click', () => {
            node.classList.toggle('selected');
            
            if (node.classList.contains('selected')) {
                selectedMutagens.push(node);
            } else {
                selectedMutagens = selectedMutagens.filter(item => item !== node);
            }
            
            calculateStats();
        });
    });

    btnSplice.addEventListener('click', () => {
        if (selectedMutagens.length === 0) return;

        organicBlob.style.transform = 'scale(1.25)';
        organicBlob.style.filter = 'drop-shadow(0 0 30px var(--neon-bile))';
        
        const randomGreenLevel = Math.floor(Math.random() * 60) + 30;
        const randomRedLevel = Math.floor(Math.random() * 60) + 30;
        greenVialFluid.style.height = `${randomGreenLevel}%`;
        redVialFluid.style.height = `${randomRedLevel}%`;

        setTimeout(() => {
            organicBlob.style.transform = 'scale(1)';
            organicBlob.style.filter = 'drop-shadow(0 0 15px var(--neon-crimson))';
        }, 1200);

        splicedCount += selectedMutagens.length;
        specimenMutationsElement.textContent = splicedCount;

        const calculatedViability = Math.max(15, 95 - (splicedCount * 8));
        specimenViabilityElement.textContent = `${calculatedViability}%`;

        if (calculatedViability < 40) {
            specimenViabilityElement.style.color = 'var(--neon-crimson)';
        } else {
            specimenViabilityElement.style.color = 'var(--neon-cyan)';
        }

        selectedMutagens.forEach(node => node.classList.remove('selected'));
        selectedMutagens = [];
        calculateStats();
    });

    btnReset.addEventListener('click', () => {
        selectedMutagens.forEach(node => node.classList.remove('selected'));
        selectedMutagens = [];
        splicedCount = 0;
        
        specimenMutationsElement.textContent = '0';
        specimenViabilityElement.textContent = '87%';
        specimenViabilityElement.style.color = 'var(--neon-cyan)';
        
        greenVialFluid.style.height = '70%';
        redVialFluid.style.height = '70%';
        
        calculateStats();
    });

    radarBlips.forEach(blip => {
        blip.addEventListener('click', () => {
            const name = blip.getAttribute('data-name');
            const hazard = blip.getAttribute('data-hazard');
            const distance = blip.getAttribute('data-distance');

            const telemetryString = `TARGET IDENTIFIED: ${name.toUpperCase()}\nHAZARD LEVEL: ${hazard}\nPROXIMITY: ${distance}\nSTATUS: ACTIVE GENE EXPRESSION DETECTED IN QUADRANT. ADVISE CAUTION.`;
            
            typeWriteText(telemetryString, anomalyDetails);
        });
    });

    runAtmosphericFluctuations();
});