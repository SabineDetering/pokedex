
function loadFavorites() {
    let favString = localStorage.getItem('favorites');
    if (favString) {
        favorites = JSON.parse(favString);
    }
    for (let i = 1; i < Math.max(maxNumber + 1, pokeExtract.length); i++) {
        if (!favorites[i]) {
            favorites[i] = false;
        }
    }
    saveFavorites();
}
function saveFavorites() {
    let favString = JSON.stringify(favorites);
    localStorage.setItem('favorites', favString);
}

function getHeartSrc(id) {
    if (favorites[id]) {
        return './img/heart-filled.png';
    } else { return './img/heart-outline.png'; }
}

function toggleFavorite(id) {
    favorites[id] = !favorites[id];
    getId('heart').src = getHeartSrc(id);
    saveFavorites();
}

function showFavorites() {
    getId('small-cards').innerHTML = '';
    for (let i = 0; i < pokeExtract.length; i++) {
        if (pokeExtract[i] && favorites[i]) {
            renderSmallCard(i);
        };
    }
    getId('small-cards').innerHTML += `<div class="small-card" style="visibility:hidden;"></div>`;

    getId('heart-blue').onclick = function () { hideFavorites(); }
    getId('heart-blue').title = "alle anzeigen";
    getId('heart-blue').src = "./img/heart-blue-filled.png";
}

function hideFavorites() {
    renderAllCards();
    getId('heart-blue').onclick = function () { showFavorites(); }
    getId('heart-blue').title = "Favoriten anzeigen";
    getId('heart-blue').src = "./img/heart-blue-outline.png";
}
//////////////////////////////////////////////////////////////////////
getId('searchField').addEventListener("keydown", function () {
    if (e.key == "Enter") {
        e.preventDefault();
        findPokemon();
    }
});

function findPokemon() {
    searchValue = getId('searchField').value;
    if (searchValueIsInteger(searchValue)) {
        findPokeId(searchValue);
    } else {
        findPokeName(searchValue);
    }
}

function searchValueIsInteger(searchValue) {
    if (Number.isInteger(parseInt(searchValue))) {//interpretation as id
        return true;
    } else {
        return false;
    }
}
async function findPokeId(index) {
    let id = parseInt(index);
    if (pokeExtract[id]) {
        showBigCard(id)
    } else {
        if (id>0 && id < 899) {
            await loadPokemon(id);
            loadFavorites();
            renderAllCards();
            showBigCard(id);
        } else { alert('Es wurde kein passendes Pokémon gefunden. Bitte geben Sie eine Zahl zwischen 1 und 898 ein.');}
    }
}
function findPokeName(name) {
    name = name.toLowerCase();
    for (let i = 0; i < pokeExtract.length; i++) {
        if (pokeExtract[i]) {
            if (pokeExtract[i].name.includes(name)) {
                showBigCard(i);
                break;
            }
        }
    }
}
