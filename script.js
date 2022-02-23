let currentPokemon;

async function loadPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon/charmander`;
    let response = await fetch(url);
    console.log(response);
    currentPokemon = await response.json();
    console.log(currentPokemon);
    renderPokemon();
}
function renderPokemon() {
    let container = document.getElementById('pokemon-container');
    container.innerHTML = `
        <h1>${currentPokemon.name}</h1>
        <img src=${currentPokemon.sprites.front_shiny} alt="">
    `;
}