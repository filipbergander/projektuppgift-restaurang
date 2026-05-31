import '../sass/main.scss'

"use strict";
// Webbtjänst
//const url = "https://fb-backend-api-p9fp.onrender.com";
const url = "http://localhost:3000";
document.addEventListener("DOMContentLoaded", () => {
    //fetchDinnerDishes();
    //fetchCategoryImages();
    initBookingForm();
});

// Hämtar maträtter till middagsmeny från webbtjänst
async function fetchDinnerDishes() {
    const loadingText = document.getElementById("loading-text");
    // Meddelande innan data har hämtats i backend
    loadingText.textContent = "Hämtar maträtter från databasen, vänta på att servern ska vakna..."
    try {
        const response = await fetch(`${url}/dinner`);

        if (!response.ok) {
            throw Error(`Fel hos server, kunde inte hämta maträtter : ${response.status}`)
        }
        const dinnerDishes = await response.json();
        loadingText.textContent = ""; // Tömmer tidigare maträtter innan nya hämtas
        if (dinnerDishes.length === 0) {
            loadingText.textContent = "Inga maträtter finns tillagda i middagsmenyn än..."
            loadingText.style.textAlign = "center";
            return;
        }

        console.log(dinnerDishes);
        renderDinnerDishes(dinnerDishes);
    } catch (error) {
        console.error("Kunde inte hämta middags-maträtter: ", error);
        // Felmeddelanden i DOM
        loadingText.textContent = "Kunde inte hämta maträtter för middagsmeny från servern, prova logga in igen..."
        loadingText.style.textAlign = "center";
    }
}

// Renderar alla maträtter och drycker
function renderDinnerDishes(dinnerDishes) {
    //Hämtar in
    const starterCont = document.getElementById("starter-container");
    const mainsCont = document.getElementById("mains-container");
    const dessertCont = document.getElementById("dessert-container");
    const drinkCont = document.getElementById("drink-container");
    // Tömmer
    starterCont.textContent = "";
    mainsCont.textContent = "";
    dessertCont.textContent = "";
    drinkCont.textContent = "";

    dinnerDishes.forEach(dish => {
        // skapar artikel för varje maträtt/dryck
        const dishItem = document.createElement("article");
        dishItem.classList.add("dish-item");

        // Namn
        const name = document.createElement("h4");
        name.textContent = dish.name;

        //Beskrivning
        const description = document.createElement("p");
        description.classList.add("description-p");
        description.textContent = dish.description;

        // Pris
        const price = document.createElement("p");
        price.classList.add("price-p");
        price.textContent = `${dish.price} kr`;

        // Lägger till elementen till artikeln
        dishItem.appendChild(name);
        dishItem.appendChild(price);
        dishItem.appendChild(description);


        // Lägger till rätterna i sin specifika container
        if (dish.category === "Förrätt")
            starterCont.appendChild(dishItem);

        if (dish.category === "Huvudrätt")
            mainsCont.appendChild(dishItem)

        if (dish.category === "Efterrätt")
            dessertCont.appendChild(dishItem)

        if (dish.category === "Dryck")
            drinkCont.appendChild(dishItem)
    });
}

// Hämtar in bilder för varje kategori av mat/dryck från backend
async function fetchCategoryImages() {
    const imageSection = document.querySelectorAll(".dish-category");
    if (!imageSection) return; // Om ingen container för maträtterna tillsammans med bilder finns, -> return
    try {
        const response = await fetch(`${url}/dinner/category-images`);
        if (!response.ok) {
            throw new Error("Kunde inte hämta kategori-bilder...");
        }
        const dataImages = await response.json(); // Data
        if (dataImages.length === 0) {
            //loadingImageText.textContent = "Inga bilder finns tillagda i databasen än..."
            // loadingImageText.style.textAlign = "center";
            return;
        }
        console.log(dataImages);
        renderDinnerImages(dataImages) // Anropar funktionen för att filtrera bilderna efter deras kategorier
    } catch (error) {
        console.error("Kunde inte hämta kategori-bilder: ", error);
        //loadingImageText.textContent = "Kunde inte hämta bilder från servern, prova logga in igen..."
        //loadingImageText.style.textAlign = "center";
    }
}

async function renderDinnerImages(dataImages) {
    // Containers för respektive matkategori
    const starterImg = document.getElementById("starter-category");
    const mainsImg = document.getElementById("mains-category");
    const dessertImg = document.getElementById("dessert-category");
    const drinkImg = document.getElementById("drink-category");

    // Skapar bilderna med sin info
    dataImages.forEach(image => {
        const imgEl = document.createElement("img");
        imgEl.classList.add("category-image");
        imgEl.src = image.image;
        imgEl.alt = image.alt;
        imgEl.height = 150;
        imgEl.width = 150;

        // Lägger till bilderna i sin kategori
        if (image.category === "Förrätt")
            starterImg.prepend(imgEl);

        if (image.category === "Huvudrätt")
            mainsImg.prepend(imgEl);

        if (image.category === "Efterrätt")
            dessertImg.prepend(imgEl);

        if (image.category === "Dryck")
            drinkImg.prepend(imgEl);
    });
}

// Visar felmeddelande om användaren inte har godkänt integritetspolicyn när de försöker slutföra bokningen
function initBookingForm() {
    // Formuläret med knapp, checkbox
    const bookingForm = document.getElementById("booking-form");
    const bookingBtn = document.getElementById("new-booking-btn");
    const checkbox = document.getElementById("booking-privacy");

    // Felmeddelandet ovanför submit-knappen
    const errorMessage = document.getElementById("button-error-text");

    // Om inte elementen finns finns, -> return
    if (!bookingBtn || !checkbox || !errorMessage || !bookingForm) return;

    // Inputs i formuläret
    const nameInput = document.getElementById("booking-name");
    const emailInput = document.getElementById("booking-email");
    const guestsInput = document.getElementById("booking-guests");
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const phoneInput = document.getElementById("booking-telephone");
    const messageInput = document.getElementById("booking-message");

    // Felmeddelanden containern ovanför formuläret
    const errorMsgList = bookingForm.querySelector(".error-message ul");

    // Lyssnar på checkboxen för att dölja felmeddelandet om den är ibockad
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            errorMessage.classList.add("hidden");
        }
    })

    // Lyssnar på submit för formuläret
    bookingForm.addEventListener("submit", async(event) => {
        event.preventDefault(); // Så att inte formuläret skickas iväg direkt vid klick
        let errors = [];

        errorMsgList.innerHTML = ""; // Tömmer tidigare felmeddelanden innan nya visas

        // Värden i inputsen
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const guests = guestsInput.value;
        const date = dateInput.value;
        const time = timeInput.value;
        const phone = phoneInput.value.trim();
        const message = messageInput.value.trim();

        // Validering för inputs och felmeddelanden
        if (!name && !email && !guests && !date && !time && !phone) {
            displayErrorMessages(["Alla fält måste fyllas i"], errorMsgList);
            bookingForm.scrollIntoView({ behavior: "smooth" }); // Scrollar upp till felmeddelanden
            return;
        }

        if (!name) errors.push("Fyll i ditt namn");

        if (!email) {
            errors.push("Fyll i din email");
        } else if (!email.includes("@") || !email.includes(".") || email.length < 5) {
            errors.push("Fyll i en giltig email");
        }

        if (!guests) {
            errors.push("Fyll i antal gäster");
        } else if (guests < 1) {
            errors.push("Antal gäster måste vara minst 1");
        } else if (guests > 10) {
            errors.push("Kontakta restaurangen direkt för bokningar av fler än 10 personer");
        }

        if (!date) {
            errors.push("Välj ett datum för din bokning");
        } else if (new Date(date) < new Date()) {
            errors.push("Datumet måste vara i framtiden");
        }

        if (!time) {
            errors.push("Välj en tid för din bokning");
        } else if (time < "16:00" || (time > "22:00" && time < "24:00") || time >= "24:00") {
            errors.push("Bokningstiderna finns mellan 16:00 - 22:00");
        }

        if (!phone) {
            errors.push("Fyll i ditt telefonnummer");
        } else if (phone.length < 7 || phone.length > 16) {
            errors.push("Fyll i ett giltigt telefonnummer");
        }

        if (message && message.length > 150) {
            errors.push("Ert meddelande är över 150 tecken, kontakta oss på telefon i stället");
        }

        // Om checkboxen inte är ikryssad visas felmeddelandet 
        if (!checkbox.checked) {
            errorMessage.classList.remove("hidden");
            return;
        }

        // Om felmeddelanden finns lagrade visas dem i DOM
        if (errors.length > 0) {
            displayErrorMessages(errors, errorMsgList);
            bookingForm.scrollIntoView({ behavior: "smooth" });
            return;
        }
        // Annars skickas formuläret
        else {
            errorMessage.classList.add("hidden");
            await createBooking();
        }
    })
};

// Skapar bokning mot backend
async function createBooking() {

    // Formuläret
    const bookingForm = document.getElementById("booking-form");

    // Inputs i formuläret
    const nameInput = document.getElementById("booking-name");
    const emailInput = document.getElementById("booking-email");
    const guestsInput = document.getElementById("booking-guests");
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const phoneInput = document.getElementById("booking-telephone");
    const messageInput = document.getElementById("booking-message");

    // Värden i inputsen
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const guests = guestsInput.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // Laddningsikon och "success"-meddelande
    const loadingSpinner = bookingForm.querySelector(".loading-spinner");
    const successMsg = bookingForm.querySelector(".success-message ul");

    // Felmeddelande containern
    const errorMsgList = bookingForm.querySelector(".error-message ul");

    try {
        const response = await fetch(`${url}/dinner/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                guests,
                date,
                time,
                phone,
                message
            })
        });

        const data = await response.json();

        // Om något blev fel i backend
        if (!response.ok) {
            loadingSpinner.classList.add("hidden");
            throw new Error(data.message || "Något gick fel, kunde inte skapa ny bokning");
            displayErrorMessages([data.message || "Något gick fel, kunde inte skapa ny bokning"], errorMsgList);
            return;
        }

        // Vid lyckats respons
        errorMsgList.innerHTML = ""; // Tömmer
        successMsg.innerHTML = "<li>Bokningen skapas!</li>";
        loadingSpinner.classList.remove("hidden");
        setTimeout(() => {
            loadingSpinner.classList.add("hidden"); // Döljer ikonen

            // Resettar formuläret efter lyckad registrering
            successMsg.innerHTML = "";
            errorMsgList.innerHTML = "";
            resetBookingForm();
        }, 1500);

    } catch (error) {
        console.error("Kunde inte göra bokningen: ", error);
        loadingSpinner.classList.add("hidden");
        displayErrorMessages([error.message || "Något gick fel, kunde inte skapa ny bokning"], errorMsgList);
    }
}


function displayErrorMessages(errors, errorMsgList) {
    errorMsgList.innerHTML = "";
    errors.forEach(error => {
        const li = document.createElement("li");
        li.textContent = error;
        errorMsgList.appendChild(li);
    });
}

function resetBookingForm() {
    const bookingForm = document.getElementById("booking-form");

    const nameInput = document.getElementById("booking-name");
    const emailInput = document.getElementById("booking-email");
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const guestsInput = document.getElementById("booking-guests");
    const messageInput = document.getElementById("booking-message");
    const privacyCheckbox = document.getElementById("booking-privacy");

    nameInput.value = "";
    emailInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    guestsInput.value = "";
    messageInput.value = "";
    privacyCheckbox.checked = false;
}