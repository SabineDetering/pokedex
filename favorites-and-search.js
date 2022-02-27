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

    getId('heart-blue').onclick = function () { hideFavorites(); }
    getId('heart-blue').title = "alle anzeigen";
    getId('heart-blue').src = "./img/heart-blue-filled.png";
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
}
//////////////////////////////////////////////////////////////////////
// getId("searchField").addEventListener("keydown", function () {
//     if (e.key == "Enter") {
//         e.preventDefault();
//         findPokemon();
//     }
// });
/**
 * allow return key as affirmation of input field
 * not working!
 * @param {*} e 
 */
function keydown(e) {
    if (e.keyCode == 13) {
        findPokemon();
    }
}
/**
 * find searched pokemon
 */
function findPokemon() {
    searchValue = getId('searchField').value;
    getId('searchField').value='';
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
 * show searched pokemon
 * if necessary load it before
 * @param {integer} index id of searched pokemon
 */
async function findPokeId(index) {
    let id = parseInt(index);
    if (pokeExtract[id]) {
        showBigCard(id)
    } else {
        if (id > 0 && id < 899) {
            await loadPokemon(id);
            loadFavorites();
            renderAllCards();
            showBigCard(id);
        } else { alert('Es wurde kein passendes Pokémon gefunden. Bitte geben Sie eine Zahl zwischen 1 und 898 ein.'); }
    }
}
/**
 * show searched pokemon
 * if necessary load it before
 * @param {string} name 
 */
async function findPokeName(name) {
    name = name.toLowerCase();
    let found = false;
    for (let i = 0; i < pokeExtract.length; i++) {
        if (pokeExtract[i]) {
            if (pokeExtract[i].name.includes(name)) {
                showBigCard(i);
                found = true;
                break;
            }
        }
    }
    if (!found) {//not yet loaded
        id = await loadPokemonName(name);
        if (id) {
            loadFavorites();
            renderAllCards();
            showBigCard(id);
        } else {
            alert('Es wurde kein passendes Pokémon gefunden.');
        }
    }
}
