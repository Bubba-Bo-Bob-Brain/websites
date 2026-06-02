document.addEventListener("DOMContentLoaded", () => {
    initializeCurtain();
    initializeSeatingChart();
    initializeModals();
    initializeSpotlights();
});

const performanceData = {
    orfeo: {
        title: "L'Orfeo",
        subtitle: "Favola in Musica di Claudio Monteverdi",
        meta: "Capolavoro della Stagione",
        date: "14 Dicembre 1689",
        duration: "Due ore e trenta minuti",
        cast: "Orfeo: Giovanni Gualberto Magli | Euridice: Girolamo Bacchini",
        description: "The supreme fable of love, death, and music. Our production features historically researched mechanical underworld gates, celestial cloud machines, and the rarest string instruments from the private collection of the Grand Duke."
    },
    alcina: {
        title: "Alcina",
        subtitle: "Georg Friedrich Händel",
        meta: "Opera Seria in tre atti",
        date: "Venerdì, 22 Gennaio",
        duration: "Tre ore",
        cast: "Alcina: Francesca Caccini | Ruggiero: Senesino",
        description: "A spectacular performance of sorcery and illusions. Watch the stage transform from a desolate rocky coast into a gilded palace of unparalleled luxury, illustrating the deceptive enchantments of the sorceress Alcina."
    },
    dido: {
        title: "Dido & Aeneas",
        subtitle: "Henry Purcell",
        meta: "Tragedia Musicale",
        date: "Giovedì, 11 Febbraio",
        duration: "Un'ora e quaranta minuti",
        cast: "Dido: Margherita de l'Epine | Aeneas: Giovanni Maria Rubinelli",
        description: "The devastating tale of Carthage's legendary founder and her tragic romance with the Trojan prince. Featuring the deeply moving lamentation aria, performed under candlelight with muted violins."
    },
    perseo: {
        title: "Perseo",
        subtitle: "Jean-Baptiste Lully",
        meta: "Tragédie en Musique",
        date: "Sabato, 05 Marzo",
        duration: "Tre ore e quindici minuti",
        cast: "Perseo: Jean-Baptiste Lully Le Jeune | Andromeda: Vittoria Tarquini",
        description: "A triumph of French theatrical mechanics and dramatic choruses. The production employs an elaborate overhead counterweight system to allow the hero Perseus to fly across the stage to battle the sea monster."
    }
};

function initializeCurtain() {
    const curtainStage = document.getElementById("curtainStage");
    const enterTheatreBtn = document.getElementById("enterTheatreBtn");

    if (enterTheatreBtn && curtainStage) {
        enterTheatreBtn.addEventListener("click", () => {
            curtainStage.classList.add("lifted");
            playIntroChime();
        });
    }
}

function playIntroChime() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playTone(freq, start, duration) {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, start);
            gainNode.gain.setValueAtTime(0.15, start);
            gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
            osc.start(start);
            osc.stop(start + duration);
        }
        
        const now = audioCtx.currentTime;
        playTone(261.63, now, 1.5);
        playTone(329.63, now + 0.2, 1.5);
        playTone(392.00, now + 0.4, 1.5);
        playTone(523.25, now + 0.6, 2.5);
    } catch (e) {
        
    }
}

function initializeSeatingChart() {
    const seats = document.querySelectorAll(".box-seat");
    const selectionDetails = document.getElementById("selectionDetails");
    const reservationForm = document.getElementById("reservationForm");
    const patronNameInput = document.getElementById("patronName");
    const submitBtn = document.querySelector(".submit-booking-btn");

    let selectedSeatElement = null;

    seats.forEach(seat => {
        seat.addEventListener("click", () => {
            if (selectedSeatElement) {
                selectedSeatElement.classList.remove("selected");
            }

            seat.classList.add("selected");
            selectedSeatElement = seat;

            const tier = seat.getAttribute("data-tier");
            const price = seat.getAttribute("data-price");

            updateSelectionDetails(tier, price);
            reservationForm.classList.remove("hidden");
        });
    });

    if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const patronName = patronNameInput.value.trim() || "Noble Guest";
            const tierName = selectedSeatElement ? selectedSeatElement.getAttribute("data-tier") : "";
            
            showBookingConfirmation(patronName, tierName);
        });
    }
}

function updateSelectionDetails(tier, price) {
    const selectionDetails = document.getElementById("selectionDetails");
    selectionDetails.innerHTML = `
        <p class="seat-meta-title">${tier}</p>
        <p class="seat-meta-price">${price}</p>
        <p class="placeholder-text" style="margin-top: 15px;">This exclusive viewing space has been provisioned with velvet cushions and direct visual lines to the Royal Stage.</p>
    `;
}

function showBookingConfirmation(patron, tier) {
    const selectionDetails = document.getElementById("selectionDetails");
    const reservationForm = document.getElementById("reservationForm");

    reservationForm.classList.add("hidden");
    selectionDetails.innerHTML = `
        <div class="booking-success-message" style="animation: fadeIn 0.8s ease;">
            <svg viewBox="0 0 100 100" style="width: 60px; height: 60px; color: var(--gold-primary); margin: 0 auto 15px; display: block;">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M30,50 L45,65 L70,35" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h5 style="font-family: var(--font-display); color: var(--gold-primary); font-size: 1.2rem; margin-bottom: 10px;">Decree Registered</h5>
            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--parchment);">
                The private chambers of <strong style="color: var(--gold-bright);">${tier}</strong> have been formally locked under the coat of arms of <strong style="color: var(--gold-bright);">${patron}</strong> for the upcoming masterwork.
            </p>
        </div>
    `;
}

function initializeModals() {
    const modal = document.getElementById("performanceModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalContent = document.getElementById("modalContent");

    const cards = document.querySelectorAll(".gilded-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const performanceKey = card.getAttribute("data-performance");
            const data = performanceData[performanceKey];
            if (data) {
                populateAndOpenModal(data);
            }
        });
    });

    const heroBtn = document.querySelector(".baroque-hero .gold-action-btn");
    if (heroBtn) {
        heroBtn.addEventListener("click", () => {
            const performanceKey = heroBtn.getAttribute("data-target");
            const data = performanceData[performanceKey];
            if (data) {
                populateAndOpenModal(data);
            }
        });
    }

    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener("click", () => {
            modal.classList.remove("active");
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    }
}

function populateAndOpenModal(data) {
    const modal = document.getElementById("performanceModal");
    const modalContent = document.getElementById("modalContent");

    modalContent.innerHTML = `
        <span class="modal-meta">${data.meta}</span>
        <h4 class="modal-title">${data.title}</h4>
        <p class="modal-subtitle">${data.subtitle}</p>
        
        <div class="modal-details-grid">
            <div class="modal-detail-col">
                <h5>Rappresentazione</h5>
                <p>${data.date}</p>
            </div>
            <div class="modal-detail-col">
                <h5>Durata Stimata</h5>
                <p>${data.duration}</p>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <h5 style="font-family: var(--font-italian); color: var(--gold-primary); font-size: 0.85rem; letter-spacing: 1.5px; margin-bottom: 8px; text-transform: uppercase;">I Protagonisti</h5>
            <p style="font-style: italic; color: var(--parchment-dark);">${data.cast}</p>
        </div>

        <p class="modal-description">${data.description}</p>
        
        <div class="modal-action-btn-container">
            <button class="gold-action-btn modal-reserve-btn">
                <span class="btn-inner">Inviare Richiesta Palco</span>
            </button>
        </div>
    `;

    modal.classList.add("active");

    const modalReserveBtn = modalContent.querySelector(".modal-reserve-btn");
    if (modalReserveBtn) {
        modalReserveBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            document.getElementById("theatre-map").scrollIntoView({ behavior: "smooth" });
        });
    }
}

function initializeSpotlights() {
    const profiles = document.querySelectorAll(".virtuoso-profile");

    profiles.forEach(profile => {
        const spotlight = profile.querySelector(".spotlight-layer");

        profile.addEventListener("mousemove", (e) => {
            const bounds = profile.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;

            spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 239, 191, 0.2) 0%, transparent 60%)`;
        });

        profile.addEventListener("mouseleave", () => {
            spotlight.style.background = `radial-gradient(circle at center, rgba(255, 239, 191, 0.1) 0%, transparent 60%)`;
        });
    });
}