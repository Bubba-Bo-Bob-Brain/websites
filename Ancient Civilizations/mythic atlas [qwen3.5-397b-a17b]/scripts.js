document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');
    const mapSVG = document.getElementById('world-map');
    const landMasses = document.querySelectorAll('.land-mass');
    const eraSlider = document.getElementById('era-slider');
    const eraNameDisplay = document.getElementById('current-era-name');
    const timelineMarkers = document.querySelectorAll('.timeline-markers span');
    const modal = document.getElementById('lore-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeModalBtn = document.getElementById('close-modal');
    const hiddenRegions = document.querySelectorAll('.hidden-era');

    // --- State ---
    const ERAS = {
        0: { name: "Mythic Age", class: "era-mythic" },
        1: { name: "Golden Age", class: "era-golden" },
        2: { name: "Age of Decay", class: "era-decay" }
    };

    let currentEraIndex = 1; // Start at Golden Age

    // --- Initialization ---
    // Simulate loading time for atmosphere
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }
    }, 1500);

    // --- Event Listeners ---

    // 1. Map Interactions
    landMasses.forEach(region => {
        region.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing modal immediately
            openLore(region);
        });
    });

    // Close modal when clicking on the map background (SVG)
    if (mapSVG) {
        mapSVG.addEventListener('click', () => {
            closeLore();
        });
    }

    // 2. Timeline Slider
    if (eraSlider) {
        eraSlider.addEventListener('input', (e) => {
            currentEraIndex = parseInt(e.value);
            updateEra(currentEraIndex);
        });
    }

    // 3. Modal Close
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeLore);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeLore();
        }
    });

    // --- Functions ---

    function updateEra(index) {
        const eraData = ERAS[index];
        
        // Update Text
        if (eraNameDisplay) {
            eraNameDisplay.textContent = eraData.name;
        }

        // Update Slider Markers
        timelineMarkers.forEach(marker => {
            const val = parseInt(marker.getAttribute('data-val'));
            if (val === index) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });

        // Update Map Visibility (The Magic)
        // Toggle the 'hidden-era' class based on data-era attribute
        hiddenRegions.forEach(region => {
            const regionEra = region.getAttribute('data-era');
            
            // Example logic: 'ancient' regions only show in era 0 (Mythic)
            if (regionEra === 'ancient' && index === 0) {
                region.style.display = 'block';
                // Small timeout to allow display:block to render before opacity transition
                setTimeout(() => region.style.opacity = '1', 50);
            } else if (regionEra === 'ancient' && index !== 0) {
                region.style.opacity = '0';
                setTimeout(() => region.style.display = 'none', 500); // Wait for fade out
            }
        });

        // Update App Class for global theme shifts if needed
        if (app) {
            // Remove previous era classes
            Object.values(ERAS).forEach(era => app.classList.remove(era.class));
            // Add current
            app.classList.add(eraData.class);
        }
    }

    function openLore(regionElement) {
        if (!modal) return;

        const name = regionElement.getAttribute('data-name') || "Unknown Region";
        const desc = regionElement.getAttribute('data-desc') || "No records exist of this place.";
        
        if (modalTitle) modalTitle.textContent = name;
        if (modalDesc) modalDesc.textContent = desc;
        
        modal.classList.add('active');
    }

    function closeLore() {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // --- Custom Cursor Effect (Optional Polish) ---
    // Creates a subtle trailing effect following the mouse
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.border = '1px solid var(--gold-primary, #d97706)';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.2s, height 0.2s';
    cursor.style.zIndex = '9999';
    cursor.style.opacity = '0.5';
    cursor.style.mixBlendMode = 'difference';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.width = '15px';
        cursor.style.height = '15px';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
    });
});