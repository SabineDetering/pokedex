let pokeInfos = [];
let currentPokemon;

function getId(id) {
    return document.getElementById(id);
}
function capitalizeFirstLetter(string) {
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

function renderCard(i) {
    let cards = getId('small-cards');

    const pokemon = pokeInfos[i];
    let name = pokemon.name;
    console.log(name);
    let types = pokemon.types;
    let id = pokemon.id;
    let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

    cards.innerHTML += ` 
            <div id='card-${i}' class="small-pokecard">
                <h2>${capitalizeFirstLetter(name)}</h2>
                 <img src="${image}" >
            </div>
        `;

}


function renderPokemon() {
    let container = document.getElementById('pokemon-container');
    container.innerHTML = `
        <h1>${currentPokemon.name}</h1>
        <img src=${currentPokemon.sprites.front_shiny} alt="">
    `;
}