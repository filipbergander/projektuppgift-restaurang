import '../sass/main.scss'

"use strict";
// Webbtjänst
const url = "https://fb-backend-api-p9fp.onrender.com";
//const url = "http://localhost:3000";
document.addEventListener("DOMContentLoaded", () => {
    fetchDinnerDishes(); // Hämtar in maträtter till kvällsmenyn
    fetchCategoryImages(); // hämtar in bilder för kvällsmenyn
    initBookingForm(); // Initierar bokningsformuläret
    fetchNewsArticle(); // Hämtar in nyhetsartikel
});

/**
 * Hämtar maträtter till middagsmeny från webbtjänsten
 * @returns {void} - Returnerar ingenting
 */
async function fetchDinnerDishes() {
    // Om man inte är på sidan med middagsmenyn -> return
    const loadingText = document.getElementById("loading-text");
    if (!loadingText) return;
    // Meddelande innan data har hämtats i backend
    loadingText.textContent = "Hämtar maträtter från databasen, vänta på att servern ska vakna..."
    loadingText.style.textAlign = "center";
    try {
        const response = await fetch(`${url}/dinner`);

        if (!response.ok) {
            loadingText.textContent = `Kunde inte hämta maträtter från servern ${response.status}.`
            loadingText.style.textAlign = "center";
            return;
        }
        const dinnerDishes = await response.json();
        if (dinnerDishes.length === 0) {
            loadingText.textContent = "Inga maträtter finns tillagda i middagsmenyn än..."
            loadingText.style.textAlign = "center";
            return;
        }
        loadingText.textContent = ""; // Tömmer tidigare maträtter innan nya hämtas
        renderDinnerDishes(dinnerDishes);
    } catch (error) {
        // Om inte servern är uppväckt...
        if (error.message === "timeout") {
            loadingText.textContent = "Servern startar upp, prova igen strax..."
            loadingText.style.textAlign = "center";
            return;
        } else if
        // Vid connection error om inte backend skulle vara igång
        (error.message === "Failed to fetch") {
            loadingText.textContent = "Kunde inte ansluta till servern, kontrollera att backend är igång..."
            loadingText.style.textAlign = "center";
            loadingText.style.color = "#a00000";
            return;
        }
        // Felmeddelanden i DOM
        loadingText.textContent = "Fel uppstod när maträtterna skulle hämtas in..."
        loadingText.style.textAlign = "center";
        loadingText.style.color = "#a00000";
        console.error("Kunde inte hämta middags-maträtter: ", error);
    }
}

/**
 * Renderar alla maträtter och drycker i sin egna kategori, genom filtrering efter kategori som finns i databasen
 * @param {string[]} dinnerDishes - Info om maträtterna från backend, namn, beskrivning, pris och kategori
 */
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

/**
 * Hämtar in bilder för varje kategori av mat/dryck från backend
 * @returns {void} - Returnerar ingenting
 */
async function fetchCategoryImages() {
    const loadingText = document.getElementById("loading-text");
    const imageSection = document.querySelectorAll(".dish-category");
    if (!loadingText) return; // Om ingen container för maträtterna tillsammans med bilder finns, -> return
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
        renderDinnerImages(dataImages) // Anropar funktionen för att filtrera bilderna efter deras kategorier
    } catch (error) {
        console.error("Kunde inte hämta kategori-bilder: ", error);
        //loadingImageText.textContent = "Kunde inte hämta bilder från servern, prova logga in igen..."
        //loadingImageText.style.textAlign = "center";
    }
}

/**
 * Renderar bilderna inom sin kategori av maträtt eller dryck, filtrerar efter kategorin som finns i databasen
 * @param {string[]} dataImages - Info om bilderna som hämtats in från backend, url till bilder och kategori samt alt-text
 */
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

/**
 * Initierar bokningsformuläret, visar felmeddelanden i DOM, skapar sedan bokning mot backend 
 * @returns {void} - Returnerar ingenting
 */
function initBookingForm() {
    // Formuläret med knapp, checkbox
    const bookingForm = document.getElementById("booking-form");
    const bookingBtn = document.getElementById("new-booking-btn");
    const checkbox = document.getElementById("booking-privacy");

    // Felmeddelandet ovanför submit-knappen
    const errorMessage = document.getElementById("button-error-text");

    // Om inte elementen finns, -> return
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
        // Specifika valideringar för varje input och sitt eget felmeddelande
        if (!name) {
            errors.push("Fyll i ditt namn")
        } else if (name.length > 30) {
            errors.push("Namnet kan inte vara längre än 30 tecken");
        }

        if (!email) {
            errors.push("Fyll i din email");
        } else if (!email.includes("@") || !email.includes(".") || email.length < 5) {
            errors.push("Fyll i en giltig email");
        } else if (email.length > 40) {
            errors.push("Emailen kan inte vara längre än 40 tecken");
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

/**
 * Skapar en bokning av bord, anrop mot backend med formulärets data
 * @returns {void} - Returnerar ingenting
 */
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

    loadingSpinner.classList.remove("hidden"); // Visar laddningsikonen
    successMsg.innerHTML = ""; // Tömmer tidigare "success"-meddelanden
    errorMsgList.innerHTML = ""; // Tömmer tidigare felmeddelanden
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
            displayErrorMessages([data.message || "Något gick fel, kunde inte skapa ny bokning"], errorMsgList);
            bookingForm.scrollIntoView({ behavior: "smooth" });
            return;
        }

        // Vid lyckad respons
        errorMsgList.innerHTML = ""; // Tömmer
        successMsg.innerHTML = "<li>Bokningen skapas!</li>";
        setTimeout(() => {
            loadingSpinner.classList.add("hidden"); // Döljer ikonen
            // Resettar formuläret efter lyckad registrering
            successMsg.innerHTML = "";
            errorMsgList.innerHTML = "";
            resetBookingForm();
        }, 1500);

    } catch (error) {
        // Olika hantering av felmeddelanden beroende på vad som faktiskt gick fel
        if (error.message === "timeout") {
            loadingSpinner.classList.add("hidden");
            loginBtn.disabled = false;
            loginBtn.classList.remove("disabled");
            displayErrorMessages(["Servern startar upp...", "Prova igen strax"], errorMsgList);
            bookingForm.scrollIntoView({ behavior: "smooth" });
            return;
        } else if (error.message === "Failed to fetch") { // Om servern inte är igång eller anropas på fel url
            displayErrorMsg(["Kunde inte ansluta till servern, kontrollera att backend är igång..."], errorMsgList);
            loginBtn.disabled = false;
            loginBtn.classList.remove("disabled");
            loadingSpinner.classList.add("hidden");
            bookingForm.scrollIntoView({ behavior: "smooth" });
            return;
        }
        console.error("Kunde inte göra bokningen: ", error);
        loadingSpinner.classList.add("hidden");
        displayErrorMessages(["Något gick fel, kunde inte skapa ny bokning"], errorMsgList);
        bookingForm.scrollIntoView({ behavior: "smooth" });
    }
}
/**
 * Hämtar in publicerad nyhetsartikel från backend
 */
async function fetchNewsArticle() {
    const articleContainer = document.getElementById("article-container");

    if (!articleContainer) return; // Om ingen container för nyhetsartikeln finns, -> return

    try {
        const response = await fetch(`${url}/news`);
        if (!response.ok) {
            throw new Error(`Fel hos server, kunde inte hämta nyheter: ${response.status}`);
        }
        const newsArticles = await response.json();
        articleContainer.textContent = ""; // Tömmer tidigare nyhetsartikel

        // Om inga nyhetsartiklar finns lagrade i databasen, visa ingenting
        if (newsArticles.length === 0) {
            articleContainer.style.display = "none"; // Döljer hela containern för nyhetsartikeln om ingen nyhet finns
            return;
        }
        articleContainer.style.display = "block"; // Visar containern för nyhetsartikeln om det finns en nyhet
        renderNewsArticle(newsArticles); // Renderar nyhetsartikeln i DOM
    } catch (error) {
        articleContainer.style.display = "none";
        console.error(error);
    }
}

/**
 * Skapar och skriver ut nyhetsartikel i DOM från inlägget som skapats och lagras i databasen
 * @param {{headline: string, content: string, author:string, createdAt: date}} newsArticles 
 */
async function renderNewsArticle(newsArticles) {
    const articleContainer = document.getElementById("article-container");

    if (!articleContainer) return; // Return om ingen container för nyhetsartikeln finns, alltså befinner sig på en annan sida

    articleContainer.textContent = ""; // Tömmer tidigare nyhetsartikel

    newsArticles.forEach(article => {
        // Skapar artikel för nyhetsartikeln
        const articleEl = document.createElement("article");
        articleEl.classList.add("news-article");
        articleContainer.appendChild(articleEl);

        // skapar rubrik för hela artikel-elementet
        const newsHeadline = document.createElement("h2");
        newsHeadline.classList.add("news-headline");
        newsHeadline.textContent = "Nyheter";
        articleEl.appendChild(newsHeadline);

        // Skapar titel på nyhetsartikeln
        const title = document.createElement("h3");
        title.classList.add("news-title");
        title.textContent = article.headline;
        articleEl.appendChild(title);

        // Inläggets innehåll
        const content = document.createElement("p");
        content.classList.add("news-content");
        content.textContent = article.content;
        articleEl.appendChild(content);
    });
}

/**
 * Visar felmeddelanden i DOM
 * @param {string[]} errors - Felmeddelanden som skapats i frontend
 * @param {HTMLUListElement} errorMsgList - Elementen i DOM där felmeddelanden ska visas
 */
function displayErrorMessages(errors, errorMsgList) {
    errorMsgList.innerHTML = "";
    // skapar li för varje felmeddelande och lägger till i DOM
    errors.forEach(error => {
        const li = document.createElement("li");
        li.textContent = error; // Li får felmeddelandet
        errorMsgList.appendChild(li); // Lägger till i DOM
    });
}
/**
 * Återställer bokningsformuläret, tömmer inputs och avmarkerar checkboxen
 */
function resetBookingForm() {
    // Formuläret
    const bookingForm = document.getElementById("booking-form");

    // Inputs i formuläret
    const nameInput = document.getElementById("booking-name");
    const emailInput = document.getElementById("booking-email");
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const guestsInput = document.getElementById("booking-guests");
    const phoneInput = document.getElementById("booking-telephone");
    const messageInput = document.getElementById("booking-message");
    const privacyCheckbox = document.getElementById("booking-privacy");

    // Tömmer inputs och återställer checkboxen
    nameInput.value = "";
    emailInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    guestsInput.value = "";
    phoneInput.value = "";
    messageInput.value = "";
    privacyCheckbox.checked = false;
}