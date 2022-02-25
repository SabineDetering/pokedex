let pokeInfos = [];
let pokeExtract = [];
let currPokemon;

function getId(id) {
    return document.getElementById(id);
}
function capFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

// loading parallel?
async function load(maxNumber) {
    for (let i = 1; i <= maxNumber; i++) {
        await loadPokemon(i);
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
    let pokeId = pokemon.id;
    let name = pokemon.name;
    let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`;

    let types = pokemon.types;
    let mainType = types[0].type.name;
    let secondType = '';
    if (types.length == 2) {
        secondType = types[1].type.name;
    }
    let species = capFirstLetter(pokemon.species.name);
    let height = (pokemon.height * 10).toString() + ' cm';
    let weight = (pokemon.weight / 10).toFixed(1) + ' kg';
    let abilities = capFirstLetter(pokemon.abilities[0].ability.name);
    for (let i = 1; i < pokemon.abilities.length; i++) {
        abilities += ', ' + capFirstLetter(pokemon.abilities[i].ability.name);
    }
    let moves = capFirstLetter(pokemon.moves[0].move.name);
    for (let i = 1; i < pokemon.moves.length; i++) {
        moves += ', ' + capFirstLetter(pokemon.moves[i].move.name);
    }

    pokeExtract[pokeId] = { pokeId, name, image, mainType, secondType, species, height, weight, abilities, moves };
}

function renderSmallCard(id) {
    let cards = getId('small-cards');
    // let pokemon = getPokeInfos(id);
    let pokemon = pokeExtract[id];

    cards.innerHTML += ` 
    <div id='card-${pokemon.pokeId}' class="small-card container m-2 p-4" onclick="showBigCard(${pokemon.pokeId})">
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
    colorizeCard(`card-${pokemon.pokeId}`, pokemon.mainType, pokemon.secondType);
}

function renderTypeDivs(main, second) {
    let htmlcode =
        `<div class="type mt-1 me-1 px-3 py-2">${capFirstLetter(main)}</div>`;
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
    renderBigCard(id);
}
function closeBigCard() {
    getId('blur').classList.add('d-none');
    document.body.style = 'overflow:auto;';
}

function renderBigCard(id) {
    currPokemon = pokeExtract[id];
    renderNav(id);
    renderHeader();
    renderInfos();
}
function renderNav(id) {
    if (id > 1) {
        getId('arrow-left').onclick = function () { renderBigCard(id - 1); };
    } else {
        getId('arrow-left').onclick = function () { closeBigCard(); }
    }

    if (id < pokeExtract.length - 1) {
        getId('arrow-right').onclick = function () { renderBigCard(id + 1); };
    } else {
        getId('arrow-right').onclick = async function () { await loadPokemon(id + 1); renderBigCard(id + 1); }
    }
}
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
                <img id="heart" src="./img/heart-outline.png">    
            </div>
        </div>
        <div class="d-flex justify-content-center"><img class="big-pic" src="${currPokemon.image}"></div>
     
    `;
    colorizeCard('big-card-upper', currPokemon.mainType, currPokemon.secondType);
}

function renderInfos() {
    renderAbout();
    renderMoves();
}
function renderAbout() {
    getId('species').innerHTML = currPokemon.species;
    getId('height').innerHTML = currPokemon.height;
    getId('weight').innerHTML = currPokemon.weight;
    getId('abilities').innerHTML = currPokemon.abilities;
}
function renderMoves() {
    let content = getId('tab-content');
    let moves = getId('moves');

    let height = window.innerHeight - content.getBoundingClientRect().top - 24;
    moves.style.height = `${height}px`;
    moves.innerHTML = currPokemon.moves;

}
