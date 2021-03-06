//functions concerning favorites

/**
 * load favorites from storage if available
 * if no info available set favorite to false
 * initiate saving favorites
 */
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


/**
 * save favorites
 */
function saveFavorites() {
    let favString = JSON.stringify(favorites);
    localStorage.setItem('favorites', favString);
}


/**
 * selects heart image according to favorite status
 * @param {integer} id of pokemon
 * @returns source for image
 */
function getHeartSrc(id) {
    if (favorites[id]) {
        return './img/heart-filled.png';
    } else { return './img/heart-outline.png'; }
}


/**
 * switch favorite status
 * @param {integer} id of pokemon
 */
function toggleFavorite(id) {
    favorites[id] = !favorites[id];
    getId('heart').src = getHeartSrc(id);
    saveFavorites();
}


/**
 * show favorites only (small cards)
 * toggle heart
 */
function showFavorites() {
    getId('small-cards').innerHTML = '';
    for (let i = 0; i < pokeExtract.length; i++) {
        if (pokeExtract[i] && favorites[i]) {
            renderSmallCard(i);
        };
    }
    getId('small-cards').innerHTML += `<div class="small-card" style="visibility:hidden;"></div>`;
    getId('small-cards').innerHTML += `<div class="small-card" style="visibility:hidden;"></div>`;
    getId('small-cards').innerHTML += `<div class="small-card" style="visibility:hidden;"></div>`;

    getId('heart-blue').onclick = function () { hideFavorites(); }
    getId('heart-blue').title = "alle anzeigen";
    getId('heart-blue').src = "./img/heart-blue-filled.png";
    getId('footer-button').classList.add('d-none');
}


/**
 * return to all cards
 * toggle heart
 */
function hideFavorites() {
    renderAllCards();
    getId('heart-blue').onclick = function () { showFavorites(); }
    getId('heart-blue').title = "Favoriten anzeigen";
    getId('heart-blue').src = "./img/heart-blue-outline.png";
    getId('footer-button').classList.remove('d-none');
}
//////////////////////////////////////////////////////////////////////
//functions concerning search

/**
 * find searched pokemon and empty search field
 * trigger search functions dependent on type of input
 */
function findPokemon(type) {
    let searchField;
    if (type == 'desktop') {
        searchField = getId('searchField');
    } else {
        searchField = getId('searchField-mobile');
    }
    searchValue = searchField.value;
    searchField.value = '';
    if (searchValueIsInteger(searchValue)) {
        findPokeId(searchValue);
    } else {
        findPokeName(searchValue);
    }
}


/**
 * returns true if search value is an integer
 * false otherwise
 * @param {string} searchValue 
 * @returns boolean
 */
function searchValueIsInteger(searchValue) {
    if (Number.isInteger(parseInt(searchValue))) {//interpretation as id
        return true;
    } else {
        return false;
    }
}


/**
 * show searched pokemon, if searched by id
 * if necessary load it before
 * @param {integer} index - id of searched pokemon
 */
async function findPokeId(index) {
    let id = parseInt(index);
    if (pokeExtract[id]) {
        showBigCard(id);
    } else {
        if (id > 0 && id < 899) {
            await loadPokemon(id);
            loadFavorites();
            renderAllCards();
            showBigCard(id);
        } else {
            showAlert('Es wurde kein passendes Pok??mon gefunden. Bitte geben Sie eine Zahl zwischen 1 und 898 ein.');
        }
    }
}


/**
 * show searched pokemon, if searched by name
 * if necessary load it before
 * @param {string} name 
 */
async function findPokeName(searchValue) {
    searchValue = searchValue.toLowerCase();
    let found = false;
    let foundIndex = pokeExtract.findIndex(
        function (pokemon) { return pokemon ? pokemon['name'].includes(searchValue) : false }
    );
    if (foundIndex != -1) {
        showBigCard(foundIndex);
        found = true;
    }
    if (!found) {//not yet loaded
        id = await loadPokemonName(searchValue);
        if (id) {
            loadFavorites();
            renderAllCards();
            showBigCard(id);
        } else {
            showAlert('Es wurde kein passendes Pok??mon gefunden.');
        }
    }
}


/**
 * shows text in toast element as alert (if searched pokemon is not found)
 * @param {string} text - to be shown as alert message
 */
function showAlert(text) {
    let errorToast = getId('error-toast');
    let toastMessage = getId('toast-message');
    toastMessage.innerHTML = text;
    const toast = new bootstrap.Toast(errorToast);
    toast.show();
}
