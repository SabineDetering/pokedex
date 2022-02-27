//relevant data of loaded pokemon
let pokeExtract = [];
//current pokemon
let currPokemon;
//number of loaded pokemon without gaps (there might single pokemon with higher ids that were loaded via search)
let maxNumber = 0;
//array of booleans to mark favorite pokemon
let favorites = [];

/////////////////////////////////////////////////////////////
function getId(id) {
    return document.getElementById(id);
}
function capFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}
// /*not working*/
// let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
// let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//     return new bootstrap.Tooltip(tooltipTriggerEl)
// })
/////////////////////////////////////////////////////////////
/**
 * intiates loading and rendering additional pokemon (parallel load)
 * @param {integer} num: number of pokemon to load starting from maxNumber
 */
async function loadNext(num) {
    await loadAndRender(maxNumber + num);
}
/**
 * loads and renders pokemon starting from maxNumber
 * @param {integer} til: highest id of pokemon to load 
 */
async function loadAndRender(til) {
    await loadTil(til);
    maxNumber = til;
    loadFavorites();
    renderAllCards();
    getId('footer-button').innerHTML = "Weitere 10 Pokémon laden";
    getId('footer-button').classList.remove('disabled');
}
/**
 * parallel loading of pokemon starting at maxNumber
 * function is done when all pokemon wanted are loaded
 * @param {integer} end: highest id of pokemon to load
 */
async function loadTil(end) {
    let id_array = [];
    for (let i = maxNumber + 1; i <= end; i++) {
        id_array.push(i);
    }
    const promises = id_array.map(id => loadPokemon(id));
    await Promise.all(promises);
}

/**
 * load single pokemon from API, reference by name
 * extract relevant data from response
 * @param {string} name 
 * @returns id
 */
async function loadPokemonName(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    pokemon = await response.json();
    extractFeatures(pokemon);
    return pokemon.id;
}
/**
 * load single pokemon from API, reference by id
 * extract relevant data from response
 * @param {integer} id 
 */
async function loadPokemon(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    pokemon = await response.json();
    extractFeatures(pokemon);
}
//////////////////////////////////////////////////////////////////
/**
 * show all loaded pokemon as small cards
 * missing pokemon are omitted
 */
function renderAllCards() {
    getId('small-cards').innerHTML = '';
    for (let i = 0; i < pokeExtract.length; i++) {
        if (pokeExtract[i]) {
            renderSmallCard(i);
        };
    }
    // invisible card for layout purposes
    getId('small-cards').innerHTML += `<div class="small-card" style="visibility:hidden;"></div>`;
    getId('small-cards').innerHTML += `<div class="small-card" style="visibility:hidden;"></div>`;
    getId('small-cards').innerHTML += `<div class="small-card" style="visibility:hidden;"></div>`;
}

/**
 * render small card for single pokemon
 * @param {integer} id 
 */
function renderSmallCard(id) {
    let cards = getId('small-cards');
    let pokemon = pokeExtract[id];

    cards.innerHTML += ` 
    <div id='card-${pokemon.pokeId}' class="small-card container-lg m-2 p-4" onclick="showBigCard(${pokemon.pokeId})">

        <div  class="d-flex justify-content-between"> 
            <h2>${capFirstLetter(pokemon.name)}</h2>
            <h4 >#${pokemon.pokeId}</h4>
        </div>

        <div class="d-flex justify-content-between"> 
            <div>                       
                 ${renderTypeDivs(pokemon.mainType, pokemon.secondType)}       
            </div>
            <img src="${pokemon.image}" >
        </div>
     </div>
        `;
    // use colors of types
    colorizeCard(`card-${pokemon.pokeId}`, pokemon.mainType, pokemon.secondType);
}

/**
 * render types
 * @param {string} main :mainType
 * @param {string} second :secondType
 * @returns html code
 */
function renderTypeDivs(main, second) {
    let htmlcode =
        `<div class="type mt-1 me-1 px-2 py-1">${capFirstLetter(main)}</div>`;
    if (second) {
        htmlcode += `
        <div class="type mt-1 px-2 py-1">${capFirstLetter(second)}</div>`;
    }
    return htmlcode;
}
/**
 * sets background color of card according to mainType
 * background of secondType according to secondType
 * @param {integer} cardid :id of pokemon
 * @param {string} main :mainType
 * @param {string} second :secondType
 */
function colorizeCard(cardid, main, second) {
    getId(cardid).style.backgroundColor = `var(--bg-${main})`;
    if (second) {
        let secondType = getId(cardid).getElementsByClassName('type')[1];
        secondType.style.backgroundColor = `var(--bg-${second})`;
    }
}

/**
 * show single pokemon on big card
 * @param {integer} id of pokemon
 */
function showBigCard(id) {
    getId('blur').classList.remove('d-none');
    document.body.style = 'overflow:hidden;';
    if (id > maxNumber) {
        getId('arrow-right').classList.add('invisible');
        getId('arrow-left').classList.add('invisible');
    }
    renderBigCard(id);
}
/**
 * close single pokemon view
 */
function closeBigCard() {
    getId('arrow-right').classList.remove('invisible');
    getId('arrow-left').classList.remove('invisible');
    getId('blur').classList.add('d-none');
    document.body.style = 'overflow:auto;';
}
/**
 * render view of single pokemon
 * @param {integer} id of pokemon
 */
function renderBigCard(id) {
    currPokemon = pokeExtract[id];
    getId('big-card').style.border = `2px solid var(--bg-${currPokemon.mainType})`;
    renderHeader();
    renderInfos();
    defineOnclickFct(id);
}
/**
 * define onclick functions for arrows and heart
 * @param {integer} id of pokemon
 */
function defineOnclickFct(id) {
    if (id > 1) {
        getId('arrow-left').onclick = function () { renderBigCard(id - 1); };
    } else {
        getId('arrow-left').onclick = function () { closeBigCard(); }
    }

    if (id < pokeExtract.length - 1) {
        getId('arrow-right').onclick = function () { renderBigCard(id + 1); };
    } else {
        getId('arrow-right').onclick = async function () { await loadNext(1); renderBigCard(id + 1); }
    }
    getId('heart').onclick = function () { toggleFavorite(id); }
}
/**
 * render colored part of infos
 * color according to main type
 * heart shows if pokemon is favorite
 */
function renderHeader() {
    let card = getId('header');

    card.innerHTML = `     
        <div  class="d-flex justify-content-between"> 
            <div>
                <h2>${capFirstLetter(currPokemon.name)}</h2>
                <div class="type-wrapper">
                     ${renderTypeDivs(currPokemon.mainType, currPokemon.secondType)}
                </div>
            </div>
            <div class="d-flex flex-column align-items-end mt-1"> 
                <h4 class="">#${currPokemon.pokeId}</h4>    
                <img id="heart" src="${getHeartSrc(currPokemon.pokeId)}">    
            </div>
        </div>
        <div class="d-flex justify-content-center"><img class="big-pic" src="${currPokemon.image}"></div>
     
    `;
    colorizeCard('big-card-upper', currPokemon.mainType, currPokemon.secondType);
}

/**
 * render white part of infos
 */
function renderInfos() {
    changeTabColor();
    renderAbout();
    renderBaseStats();
    renderMoves();
    colorizeInnerBorders();
}
/**
 * use main type color for all borders in the card
 */
function colorizeInnerBorders() {
    colorizeBorder("td");
    colorizeBorder("tfoot");
    colorizeBorder(".move");
    colorizeBorder("td");
    colorizeBorder("td");
}
/**
 * apply main type color to borders of element
 * @param {id} of element 
 */
function colorizeBorder(element) {
    let elements = document.querySelectorAll(`${element}`);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.borderColor = `var(--bg-${currPokemon.mainType}`;
    }
}
/**
 * apply main type color to mark active tab
 */
function changeTabColor() {
    let links = document.querySelectorAll(".nav-link");
    for (let i = 0; i < links.length; i++) {
        links[i].style.color = "black";
        links[i].style.backgroundColor = "#f9f9de";
    }
    let active = document.querySelector(".nav-link.active");
    active.style.backgroundColor = `var(--bg-${currPokemon.mainType}`;
    active.style.color = "#f9f9de";
}
/**
 * calculates the max available height for infos in the white part
 * @returns maxheight
 */
function calcInfoHeight() {
    let content = getId('tab-content');
    let bigCard = getId('big-card');
    maxHeight = bigCard.getBoundingClientRect().bottom - content.getBoundingClientRect().top - 24;
    return maxHeight;
}
/**
 * render about tab infos
 */
function renderAbout() {
    let about = getId('about');
    // about.style.maxHeight = `${calcInfoHeight()}px`;

    getId('species').innerHTML = currPokemon.species;
    getId('height').innerHTML = currPokemon.height;
    getId('weight').innerHTML = currPokemon.weight;
    getId('abilities').innerHTML = currPokemon.abilities;
}

/**
 * render base stat infos
 */
function renderBaseStats() {
    let base = getId('base');
    // base.style.maxHeight = `${calcInfoHeight()}px`;

    getId('hp').innerHTML = currPokemon.hp;
    getId('attack').innerHTML = currPokemon.attack;
    getId('defense').innerHTML = currPokemon.defense;
    getId('sp-attack').innerHTML = currPokemon.specialAttack;
    getId('sp-defense').innerHTML = currPokemon.specialDefense;
    getId('speed').innerHTML = currPokemon.speed;
    getId('total').innerHTML = currPokemon.baseStatTotal;
    getId('avg').innerHTML = currPokemon.baseStatAvg;
}

/**
 * render moves tab infos
 */
function renderMoves() {
    let moves = getId('moves');
    // moves.style.maxHeight = `${calcInfoHeight()}px`;
    moves.innerHTML = '';

    for (let i = 0; i < currPokemon.moves.length; i++) {
        const move = currPokemon.moves[i];
        moves.innerHTML += `
        <div class="move text-nowrap p-1 text-center m-1">${move}</div>
        `;
    }
}
