let pokeInfos = [];
let pokeExtract = [];
let currentPokemon;

function getId(id) {
    return document.getElementById(id);
}
function capFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}


// loading parallel?
function load(maxNumber) {
    for (let i = 1; i <= maxNumber; i++) {
        loadPokemon(i);
    }
}

async function loadPokemon(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    pokemon = await response.json();
    pokeInfos.push(pokemon);// kann später entfallen
    extractFeatures(pokemon);
    renderSmallCard(id);
}

function extractFeatures(pokemon) {
    // let index = i - 1;//Index in array 1 lower than id
    // const pokemon = pokeInfos[index];

    let pokeId = pokemon.id;
    let name = pokemon.name;
    let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`;

    let types = pokemon.types;
    let mainType = types[0].type.name;
    let secondType = '';
    if (types.length == 2) {
        secondType = types[1].type.name;
    }
    pokeExtract[pokeId] = { pokeId, name, image, mainType, secondType };
}

function renderSmallCard(id) {
    let cards = getId('small-cards');
    // let pokemon = getPokeInfos(id);
    let pokemon = pokeExtract[id];

    // let typeDivs = renderTypeDivs(pokemon.mainType, pokemon.secondType);
    cards.innerHTML += ` 
    <div id='card-${pokemon.pokeId}' class="small-pokecard container m-2 p-4" onclick="showBigCard(${pokemon.pokeId})">
        <div  class="d-flex justify-content-between"> 
            <h2>${capFirstLetter(pokemon.name)}</h2>
            <span class="">#${pokemon.pokeId}</span>
        </div>
        <div class="d-flex justify-content-between"> 
            <div>                       
                 ${renderTypeDivs(pokemon.mainType, pokemon.secondType)}       
            </div>
            <img src="${pokemon.image}" >
        </div>
     </div>
        `;
    colorizeCard(`card-${pokemon.pokeId}`, pokemon.mainType, pokemon.secondType);
}

function renderTypeDivs(main, second) {
    let htmlcode =
        `<div class="type mt-1 mr-1 px-3 py-2">${capFirstLetter(main)}</div>`;
    if (second) {
        htmlcode += `
        <div class="type mt-1 px-3 py-2">${capFirstLetter(second)}</div>`;
    }
    return htmlcode;
}

function colorizeCard(cardid, main, second) {
    getId(cardid).style.backgroundColor = `var(--bg-${main})`;
    if (second) {
        let secondType = getId(cardid).getElementsByClassName('type')[1];
        secondType.style.backgroundColor = `var(--bg-${second})`;
    }
}


function showBigCard(id) {
    getId('blur').classList.remove('d-none');
    document.body.style = 'overflow:hidden;';
    getId('big-card').classList.remove('d-none');
    renderBigCard(id);
}
function closeBigCard(id) {
    getId('blur').classList.add('d-none');
    document.body.style = 'overflow:auto;';
    getId('big-card').classList.add('d-none');
}

function renderBigCard(id) {
    renderNav();
    renderHeader(id);
    renderInfos(id);
}
function renderNav() {

}
function renderHeader(id) {
    let card = getId('header');
    let pokemon = pokeExtract[id];

    card.innerHTML += `     
        <div  class="d-flex justify-content-between"> 
            <div>
                <h2>${capFirstLetter(pokemon.name)}</h2>
                <div class="type-wrapper">
                     ${renderTypeDivs(pokemon.mainType, pokemon.secondType)}
                </div>
            </div>
            <div class="d-flex flex-column align-items-end"> 
                <img src="./img/heart-outline.png">
                <span class="">#${pokemon.pokeId}</span>        
            </div>
        </div>
            <img src="${pokemon.image}" >
     
    `;
    colorizeCard('big-card', pokemon.mainType, pokemon.secondType);
}


function renderInfos(id) { }

