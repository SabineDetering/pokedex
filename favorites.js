
function loadFavorites() {
    let favString = localStorage.getItem('favorites');
    if (favString) {
        favorites = JSON.parse(favString);
    }
    for (let i = 1; i < Math.max(maxNumber+1, favorites.length); i++) {
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
