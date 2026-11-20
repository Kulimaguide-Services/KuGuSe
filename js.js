/* =========================================
   KULIMAGUIDE - TRANSPORTERS PAGE
   Search and Filter Functionality
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Select transporter page elements
    const transporterMain = document.querySelector(".transporter-main");

    // Prevent this script from affecting other pages
    if (!transporterMain) return;

    const filterForm = transporterMain.querySelector(".transporter-filter-bar");
    const transporterCards = transporterMain.querySelectorAll(".transporter-card");
    const transporterGrid = transporterMain.querySelector(".transporter-grid");

    // Get filter input fields
    const fromInput = transporterMain.querySelector(".from-input");
    const toInput = transporterMain.querySelector(".to-input");
    const vehicleSelect = transporterMain.querySelector(".vehicle-select");
    const capacityInput = transporterMain.querySelector(".capacity-input");
    const priceInput = transporterMain.querySelector(".price-input");
    const dateInput = transporterMain.querySelector(".date-input");

    // Create message for search results
    const resultMessage = document.createElement("p");
    resultMessage.className = "transporter-result-message";
    resultMessage.style.cssText =
        "font-size:14px; color:#2d5a27; margin:10px 0; font-weight:600;";

    transporterGrid.parentNode.insertBefore(
        resultMessage,
        transporterGrid.nextSibling
    );

    // SEARCH FUNCTION
    filterForm.addEventListener("submit", function (event) {

        // Prevent page from refreshing
        event.preventDefault();

        // Get entered values
        const fromLocation = fromInput.value.trim().toLowerCase();
        const toLocation = toInput.value.trim().toLowerCase();
        const vehicleType = vehicleSelect.value.toLowerCase();
        const requiredCapacity = parseFloat(capacityInput.value);
        const priceRange = priceInput.value.trim();

        // Validate capacity
        if (capacityInput.value.trim() !== "" &&
            (!Number.isFinite(requiredCapacity) || requiredCapacity <= 0)) {

            resultMessage.textContent =
                "Please enter a valid capacity greater than zero.";

            transporterCards.forEach(card => {
                card.style.display = "none";
            });

            return;
        }

        // Read price range
        let minimumPrice = null;
        let maximumPrice = null;

        if (priceRange !== "") {

            const prices = priceRange.match(/\d+(\.\d+)?/g);

            if (!prices || prices.length > 2) {
                resultMessage.textContent =
                    "Enter a valid price range, e.g. 1-10 ZMW.";

                transporterCards.forEach(card => {
                    card.style.display = "none";
                });

                return;
            }

            minimumPrice = prices.length === 2
                ? Math.min(Number(prices[0]), Number(prices[1]))
                : Number(prices[0]);

            maximumPrice = prices.length === 2
                ? Math.max(Number(prices[0]), Number(prices[1]))
                : Number(prices[0]);
        }

        // Count matching transporters
        let matchingCount = 0;

        // Check every transporter card
        transporterCards.forEach(function (card) {

            const cardFrom = card.dataset.from.toLowerCase();
            const cardTo = card.dataset.to.toLowerCase();
            const cardVehicle = card.dataset.vehicle.toLowerCase();
            const cardCapacity = Number(card.dataset.capacity);
            const cardPrice = Number(card.dataset.price);

            // Check departure location
            const matchesFrom =
                fromLocation === "" ||
                cardFrom.includes(fromLocation);

            // Check destination
            const matchesTo =
                toLocation === "" ||
                cardTo.includes(toLocation);

            // Check vehicle type
            const matchesVehicle =
                vehicleType === "all" ||
                cardVehicle === vehicleType;

            // Check capacity
            const matchesCapacity =
                capacityInput.value.trim() === "" ||
                cardCapacity >= requiredCapacity;

            // Check price range
            const matchesPrice =
                minimumPrice === null ||
                (cardPrice >= minimumPrice &&
                 cardPrice <= maximumPrice);

            // Display matching transporters
            if (
                matchesFrom &&
                matchesTo &&
                matchesVehicle &&
                matchesCapacity &&
                matchesPrice
            ) {

                card.style.display = "";
                matchingCount++;

            } else {

                card.style.display = "none";

            }

        });

        // Display search results
        if (matchingCount > 0) {

            resultMessage.textContent =
                matchingCount + " transporter(s) found.";

        } else {

            resultMessage.textContent =
                "No transporters found. Try changing your search filters.";

        }

        // Explain date limitation
        if (dateInput.value !== "") {
            resultMessage.textContent +=
                " Note: Date availability is not yet supported.";
        }

    });

    // CLEAR FILTERS WHEN THE FORM IS RESET
    filterForm.addEventListener("reset", function () {

        setTimeout(function () {

            transporterCards.forEach(function (card) {
                card.style.display = "";
            });

            resultMessage.textContent = "";

        }, 0);

    });

});