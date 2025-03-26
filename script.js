const loader = document.createElement("div");
loader.className = "loader";
loader.style.display = "none";
loader.textContent = "Loading...";

const quoteContainer = document.createElement("div");
quoteContainer.className = "quote-container";

const authorContainer = document.createElement("div");
authorContainer.className = "author-container";

const ageContainer = document.createElement("div");
ageContainer.className = "age-container";

const imageContainer = document.createElement("div");
imageContainer.className = "image-container";

const button = document.createElement("button");
button.className = "fetch-quote";
button.textContent = "Fetch Quote";

document.body.appendChild(loader);
document.body.appendChild(quoteContainer);
document.body.appendChild(authorContainer);
document.body.appendChild(ageContainer);
document.body.appendChild(imageContainer);
document.body.appendChild(button);

function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}

async function fetchQuote() {
    showLoader();
    
    const timeoutId = setTimeout(() => {
        hideLoader();
        quoteContainer.textContent = "Le chargement a pris trop de temps.";
    }, 10000);

    try {
        const response = await fetch("https://thatsthespir.it/api");
        const data = await response.json();
        
        clearTimeout(timeoutId);
        hideLoader();
        
        quoteContainer.textContent = `"${data.quote}"`;
        authorContainer.textContent = `- ${data.author}`;
        ageContainer.textContent = "";
        imageContainer.innerHTML = "";
        
        if (data.photo) {
            const img = document.createElement("img");
            img.src = data.photo;
            img.alt = data.author;
            imageContainer.appendChild(img);
        }
        
        if (data.author) {
            await fetchAge(data.author.split(" ")[0]);
        }
    
    } catch (error) {
        clearTimeout(timeoutId);
        quoteContainer.textContent = "Erreur lors du chargement de la citation.";
    } finally {
        hideLoader();
    }
}

async function fetchAge(name) {
    showLoader();
    try {
        const response = await fetch(`https://api.agify.io?name=${name}`);
        const data = await response.json();
        if (data.age !== null) {
            ageContainer.textContent = `Âge estimé: ${data.age} ans`;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'âge", error);
    } finally {
        hideLoader();
    }
}

button.addEventListener("click", fetchQuote);

fetchQuote();
