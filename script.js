let pokeInfos = [];
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
    pokeInfos.push(pokemon);
    renderCard(id);
}

function renderCard(id) {
    let cards = getId('small-cards');
    let index = id - 1;//Index in array 1 lower than id

    const pokemon = pokeInfos[index];
    let name = pokemon.name;
    let pokeId = pokemon.id;
    let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`;

    let types = pokemon.types;
    let mainType = types[0].type.name;
    let secondType = '';
    if (types.length == 2) {
        secondType = types[1].type.name;
    }
    let typeDivs = `
        <div class="type px-3 py-2">${capFirstLetter(mainType)}</div>`;
    if (secondType) {
        typeDivs += `
        <div id="type2-${pokeId}" class="type px-3 py-2">${capFirstLetter(secondType)}</div>`;
    }
    cards.innerHTML += ` 
    <div id='card-${pokeId}' class="small-pokecard m-2 p-4">
        <div  class="d-flex justify-content-between"> 
            <h2>${capFirstLetter(name)}</h2>
            <span class="">#${pokeId}</span>
        </div>
        <div class="d-flex justify-content-between"> 
            <div>                       
                 ${typeDivs}       
            </div>
            <img src="${image}" >
        </div>
     </div>
        `;
    getId('card-' + pokeId).style.backgroundColor = `var(--bg-${mainType})`;
    if (secondType) {
        getId('type2-' + pokeId).style.backgroundColor = `var(--bg-${secondType})`;
    }
}

