/* KULIMAGUIDE TRANSPORTER PAGE
   Frontend demonstration: filtering, WhatsApp links,
   browser-based registration and date availability.
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Sample transporter data based on the supplied HTML page.
    // The original sample listings do not specify date ranges,
    // so their exact date availability must be confirmed by phone.
    const sampleTransporters = [
        {
            id: "sample-1",
            name: "J. Banda Transport",
            location: "Kasama, Northern Province",
            from: "Kasama",
            to: "Ndola",
            vehicle: "Truck",
            capacity: 10,
            price: 20,
            phone: "0971234567",
            availableFrom: "",
            availableUntil: "",
            source: "sample",
            verified: false
        },
        {
            id: "sample-2",
            name: "J. Northern Logistics",
            location: "Mpika, Muchinga Province",
            from: "Mpika",
            to: "Kasama",
            vehicle: "Pickup",
            capacity: 3,
            price: 7,
            phone: "+260967783344",
            availableFrom: "",
            availableUntil: "",
            source: "sample",
            verified: false
        },
        {
            id: "sample-3",
            name: "Mansa Haulers",
            location: "Mansa, Luapula Province",
            from: "Mansa",
            to: "Kasama",
            vehicle: "Tractor Trailer",
            capacity: 15,
            price: 12,
            phone: "+26075552211",
            availableFrom: "",
            availableUntil: "",
            source: "sample",
            verified: false
        },
        {
            id: "sample-4",
            name: "Agro Move Services",
            location: "Kitwe, Copperbelt Province",
            from: "Kitwe",
            to: "Ndola",
            vehicle: "Oxcart",
            capacity: 2,
            price: 4,
            phone: "+260953349988",
            availableFrom: "",
            availableUntil: "",
            source: "sample",
            verified: false
        }
    ];

    const STORAGE_KEY = "kulimaguideTransporters";
    const listElement = document.querySelector("#transporterList");
    const emptyState = document.querySelector("#emptyState");
    const resultCount = document.querySelector("#resultCount");
    const searchForm = document.querySelector("#searchForm");
    const registrationForm = document.querySelector("#registrationForm");
    const registrationMessage = document.querySelector("#registrationMessage");

    const filters = {
        from: document.querySelector("#fromFilter"),
        to: document.querySelector("#toFilter"),
        vehicle: document.querySelector("#vehicleFilter"),
        capacity: document.querySelector("#capacityFilter"),
        price: document.querySelector("#priceFilter"),
        date: document.querySelector("#dateFilter"),
        keyword: document.querySelector("#keywordFilter")
    };

    // Set the footer year automatically.
    document.querySelector("#currentYear").textContent = new Date().getFullYear();

    // Mobile navigation menu.
    const menuToggle = document.querySelector("#menuToggle");
    const navigation = document.querySelector("#mainNavigation");

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    function getRegisteredTransporters() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            console.warn("Could not read saved transporter records:", error);
            return [];
        }
    }

    function saveRegisteredTransporters(records) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
            return true;
        } catch (error) {
            console.error("Could not save transporter records:", error);
            return false;
        }
    }

    function allTransporters() {
        return [...sampleTransporters, ...getRegisteredTransporters()];
    }

    function normalise(value) {
        return String(value || "").trim().toLocaleLowerCase();
    }

    function formatMoney(value) {
        return Number(value).toLocaleString("en-ZM", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    // Escape user-entered values before placing them into HTML.
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };
            return entities[character];
        });
    }

    function toWhatsAppNumber(rawNumber) {
        let digits = String(rawNumber || "").replace(/\D/g, "");

        // Convert a Zambian local number such as 0971234567 to 260971234567.
        if (digits.startsWith("0")) {
            digits = "260" + digits.slice(1);
        }

        return digits;
    }

    function createWhatsAppURL(phone, transporterName) {
        const number = toWhatsAppNumber(phone);
        const message = encodeURIComponent(
            `Hello ${transporterName}, I found your transport service on KulimaGuide. ` +
            "I would like to enquire about your route, price and availability."
        );

        return `https://wa.me/${number}?text=${message}`;
    }

    function dateIsAvailable(transporter, selectedDate) {
        // No date range means availability cannot be confirmed by the site.
        if (!transporter.availableFrom || !transporter.availableUntil) {
            return false;
        }

        return selectedDate >= transporter.availableFrom &&
               selectedDate <= transporter.availableUntil;
    }

    function matchesFilters(transporter) {
        const from = normalise(filters.from.value);
        const to = normalise(filters.to.value);
        const vehicle = normalise(filters.vehicle.value);
        const keyword = normalise(filters.keyword.value);
        const minimumCapacity = filters.capacity.value === ""
            ? null : Number(filters.capacity.value);
        const maximumPrice = filters.price.value === ""
            ? null : Number(filters.price.value);
        const selectedDate = filters.date.value;

        const routeFromMatches = !from || normalise(transporter.from) === from;
        const routeToMatches = !to || normalise(transporter.to) === to;
        const vehicleMatches = !vehicle || normalise(transporter.vehicle) === vehicle;
        const capacityMatches = minimumCapacity === null ||
            Number(transporter.capacity) >= minimumCapacity;
        const priceMatches = maximumPrice === null ||
            Number(transporter.price) <= maximumPrice;

        const searchableText = [
            transporter.name,
            transporter.location,
            transporter.from,
            transporter.to,
            transporter.vehicle,
            transporter.phone
        ].join(" ").toLocaleLowerCase();

        const keywordMatches = !keyword || searchableText.includes(keyword);
        const dateMatches = !selectedDate ||
            dateIsAvailable(transporter, selectedDate);

        return routeFromMatches && routeToMatches && vehicleMatches &&
            capacityMatches && priceMatches && keywordMatches && dateMatches;
    }

    function createTransporterCard(transporter) {
        const card = document.createElement("article");
        card.className = "transporter-card";

        const name = escapeHTML(transporter.name);
        const location = escapeHTML(transporter.location);
        const from = escapeHTML(transporter.from);
        const to = escapeHTML(transporter.to);
        const vehicle = escapeHTML(transporter.vehicle);
        const phone = escapeHTML(transporter.phone);
        const capacity = escapeHTML(transporter.capacity);
        const price = escapeHTML(formatMoney(transporter.price));

        const dateText = transporter.availableFrom && transporter.availableUntil
            ? `${escapeHTML(transporter.availableFrom)} to ${escapeHTML(transporter.availableUntil)}`
            : "Contact transporter to confirm";

        // User registrations are pending verification. Do not label them verified.
        const badge = transporter.verified
            ? '<span class="badge">Verified</span>'
            : transporter.source === "registered"
                ? '<span class="badge pending">Pending verification</span>'
                : '<span class="badge pending">Not verified</span>';

        const whatsappURL = createWhatsAppURL(transporter.phone, transporter.name);
        const phoneDigits = String(transporter.phone || "").replace(/[^\d+]/g, "");

        card.innerHTML = `
            <div class="card-top">
                <h3>${name}</h3>
                ${badge}
            </div>
            <div class="transporter-details">
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Vehicle:</strong> ${vehicle}</p>
                <p><strong>Capacity:</strong> ${capacity} tonnes</p>
                <p><strong>Route:</strong> ${from} &rarr; ${to}</p>
                <p><strong>Price per km:</strong> ZMW ${price}</p>
                <p><strong>Availability:</strong> ${dateText}</p>
                <p><strong>Phone/WhatsApp:</strong> ${phone}</p>
            </div>
            <div class="card-actions">
                <a class="whatsapp-button" href="${whatsappURL}"
                   target="_blank" rel="noopener noreferrer">Contact via WhatsApp</a>
                <a class="phone-link" href="tel:${phoneDigits}">Call transporter</a>
            </div>
        `;

        return card;
    }

    function renderTransporters(records = allTransporters()) {
        const filtered = records.filter(matchesFilters);
        listElement.replaceChildren();

        filtered.forEach((transporter) => {
            listElement.appendChild(createTransporterCard(transporter));
        });

        resultCount.textContent =
            `${filtered.length} transporter${filtered.length === 1 ? "" : "s"} found`;

        emptyState.hidden = filtered.length !== 0;
    }

    function runSearch() {
        renderTransporters();
    }

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        runSearch();
    });

    // Live filtering when a user changes a field or types a keyword.
    Object.values(filters).forEach((field) => {
        field.addEventListener("input", runSearch);
        field.addEventListener("change", runSearch);
    });

    document.querySelector("#resetFilters").addEventListener("click", () => {
        searchForm.reset();
        runSearch();
    });

    function showRegistrationMessage(message, isError = false) {
        registrationMessage.textContent = message;
        registrationMessage.classList.toggle("error", isError);
    }

   registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const transporter = {
        name: document.querySelector("#regName").value.trim(),
        location: document.querySelector("#regLocation").value.trim(),
        from: document.querySelector("#regFrom").value.trim(),
        to: document.querySelector("#regTo").value.trim(),
        vehicle: document.querySelector("#regVehicle").value,
        capacity: Number(document.querySelector("#regCapacity").value),
        price: Number(document.querySelector("#regPrice").value),
        phone: document.querySelector("#regPhone").value.trim(),
        availableFrom: document.querySelector("#regAvailableFrom").value,
        availableUntil: document.querySelector("#regAvailableUntil").value
    };

    try {
        showRegistrationMessage("Submitting registration...");

        const response = await fetch("api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transporter)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Registration failed.");
        }

        registrationForm.reset();

        showRegistrationMessage(
            "Registration submitted successfully! Awaiting verification."
        );

    } catch (error) {
        console.error("Registration error:", error);

        showRegistrationMessage(
            error.message || "Unable to submit registration.",
            true
        );
    }
});


    // Prevent selecting past dates for new availability dates and search date.
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    document.querySelector("#regAvailableFrom").min = localToday;
    document.querySelector("#regAvailableUntil").min = localToday;
    filters.date.min = localToday;

    // Ensure the end date cannot be before the start date.
    const availableFromInput = document.querySelector("#regAvailableFrom");
    const availableUntilInput = document.querySelector("#regAvailableUntil");

    availableFromInput.addEventListener("change", () => {
        availableUntilInput.min = availableFromInput.value || localToday;

        if (availableUntilInput.value &&
            availableUntilInput.value < availableFromInput.value) {
            availableUntilInput.value = "";
        }
    });

    // Initial page display.
    renderTransporters();
});
