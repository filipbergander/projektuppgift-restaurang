import '../sass/main.scss'

"use strict";
// Webbtjänst
const url = "https://fb-backend-api-p9fp.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    fetchDinnerDishes();
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
        dishItem.appendChild(description);
        dishItem.appendChild(price);

        // Lägger till rätterna i sin specifika container
        if (dish.category === "Förrätt") {
            starterCont.appendChild(dishItem);
        } else if (dish.category === "Huvudrätt") {
            mainsCont.appendChild(dishItem)
        } else if (dish.category === "Efterrätt") {
            dessertCont.appendChild(dishItem)
        } else if (dish.category === "Dryck") {
            drinkCont.appendChild(dishItem)
        }
    });
}