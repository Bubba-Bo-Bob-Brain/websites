const customCursor = document.getElementById('customCursor');
const mascotText = document.getElementById('mascotText');
const nextTipBtn = document.getElementById('nextTipBtn');
const departureRows = document.getElementById('departureRows');
const suitColorButtons = document.querySelectorAll('.color-btn');
const accentColorButtons = document.querySelectorAll('.accent-btn');
const visorColorButtons = document.querySelectorAll('.visor-btn');
const spacesuitSvg = document.getElementById('spacesuitSvg');
const destinationCards = document.querySelectorAll('.luggage-tag');
const bookingForm = document.getElementById('bookingForm');
const destinationSelect = document.getElementById('destinationSelect');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModalBtn');

const ticketPassenger = document.getElementById('ticketPassenger');
const ticketDestination = document.getElementById('ticketDestination');
const ticketDate = document.getElementById('ticketDate');

const cosmoQuotes = [
    "Don't forget to pack your gold-plated zero-gravity sunglasses!",
    "The lounge on Celestia-9 serves a marvelous dehydrated shrimp cocktail!",
    "When on Mars, keep an eye out for shiny chromium-plated pebbles!",
    "Astro-Tours guarantees 99.8% cosmic radiation deflection!",
    "The Moon's gravity makes everyone a master acrobat! Bounce away!",
    "Did you know? Our rockets run on clean, super-fizz atomic fuel!",
    "Cosmo says: A happy astronaut always checks their helmet seal twice!"
];

const departureTimes = [165, 2712, 4320, 541];

function initializeCursor() {
    document.addEventListener('mousemove', (event) => {
        customCursor.style.left = `${event.clientX}px`;
        customCursor.style.top = `${event.clientY}px`;
    });
}

function handleMascotQuotes() {
    let currentQuoteIndex = 0;
    nextTipBtn.addEventListener('click', () => {
        mascotText.style.opacity = '0';
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % cosmoQuotes.length;
            mascotText.textContent = `"${cosmoQuotes[currentQuoteIndex]}"`;
            mascotText.style.opacity = '1';
        }, 200);
    });
}

function updateDepartureBoard() {
    const countdownCells = document.querySelectorAll('.count-down');
    
    setInterval(() => {
        countdownCells.forEach((cell, index) => {
            if (departureTimes[index] > 0) {
                departureTimes[index]--;
                
                const totalSeconds = departureTimes[index];
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                let timeString = '';
                if (hours > 0) {
                    timeString += `${hours.toString().padStart(2, '0')}h `;
                }
                timeString += `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
                cell.textContent = timeString;
            } else {
                cell.textContent = "IGNITION";
                cell.className = "flip-cell status-boarding";
            }
        });
    }, 1000);
}

function handleSpacesuitCustomizer() {
    suitColorButtons.forEach(button => {
        button.addEventListener('click', () => {
            suitColorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const chosenColor = button.getAttribute('data-color');
            document.documentElement.style.setProperty('--suit-color', chosenColor);
        });
    });

    accentColorButtons.forEach(button => {
        button.addEventListener('click', () => {
            accentColorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const chosenAccent = button.getAttribute('data-accent');
            document.documentElement.style.setProperty('--accent-color', chosenAccent);
        });
    });

    visorColorButtons.forEach(button => {
        button.addEventListener('click', () => {
            visorColorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const chosenVisor = button.getAttribute('data-visor');
            
            let finalVisorColor = 'rgba(233, 196, 106, 0.7)';
            if (chosenVisor === 'cosmic-blue') {
                finalVisorColor = 'rgba(56, 163, 165, 0.7)';
            } else if (chosenVisor === 'neon-ruby') {
                finalVisorColor = 'rgba(231, 111, 81, 0.7)';
            }
            
            document.documentElement.style.setProperty('--visor-color', finalVisorColor);
        });
    });
}

function handleDestinationSelection() {
    destinationCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetDestination = card.getAttribute('data-destination');
            destinationSelect.value = targetDestination;
            
            const bookingSection = document.getElementById('booking');
            bookingSection.scrollIntoView({ behavior: 'smooth' });
            
            destinationSelect.classList.add('highlight-select');
            setTimeout(() => {
                destinationSelect.classList.remove('highlight-select');
            }, 1000);
        });
    });
}

function handleBookingSubmission() {
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const passengerNameValue = document.getElementById('passengerName').value;
        const selectedDestinationOption = destinationSelect.options[destinationSelect.selectedIndex].text;
        const launchDateValue = document.getElementById('launchDate').value;
        
        ticketPassenger.textContent = `PASSENGER: ${passengerNameValue.toUpperCase()}`;
        ticketDestination.textContent = `DESTINATION: ${selectedDestinationOption.toUpperCase()}`;
        ticketDate.textContent = `DEPARTURE CYCLE: ${launchDateValue}`;
        
        successModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        bookingForm.reset();
    });

    successModal.addEventListener('click', (event) => {
        if (event.target === successModal) {
            successModal.classList.remove('active');
            bookingForm.reset();
        }
    });
}

function setDefaultDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    document.getElementById('launchDate').value = `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCursor();
    handleMascotQuotes();
    updateDepartureBoard();
    handleSpacesuitCustomizer();
    handleDestinationSelection();
    handleBookingSubmission();
    setDefaultDate();
});