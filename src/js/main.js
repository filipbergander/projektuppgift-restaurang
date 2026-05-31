import '../sass/main.scss'

"use strict";
// Webbtjänst
//const url = "https://fb-backend-api-p9fp.onrender.com";
const url = "http://localhost:3000";
document.addEventListener("DOMContentLoaded", () => {
    fetchDinnerDishes();
    fetchCategoryImages();
    showErrorMessage();
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
function showErrorMessage() {
    const checkbox = document.getElementById("booking-privacy");
    const bookingBtn = document.getElementById("new-booking-btn");
    const errorMessage = document.getElementById("button-error-text");
    if (!bookingBtn || !checkbox || !errorMessage) return; // Om inte checkbox eller knapp finns, -> return


    bookingBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Så att inte formuläret skickas iväg direkt vid klick
        if (!checkbox.checked) {
            errorMessage.classList.remove("hidden");
        } else if (checkbox.checked) {
            errorMessage.classList.add("hidden");
            submitBookingForm();
        }
    })

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            errorMessage.classList.add("hidden");
        }
    })
};