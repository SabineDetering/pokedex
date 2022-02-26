let pokeInfos = [];
let pokeExtract = [];
let currPokemon;
let maxNumber = 0;
let favorites = [];

/////////////////////////////////////////////////////////////
function getId(id) {
    return document.getElementById(id);
}
function capFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}
/////////////////////////////////////////////////////////////
// function loadFirst(num) {
//     load(1, num);
// }
async function loadNext(num) {
    await loadAndRender( maxNumber + num);
 }
// // sequential loading
// async function load(start, end) {
//     maxNumber = end;
//     for (let i = start; i <= end; i++) {
//         await loadPokemon(i);
//         renderSmallCard(id);
//     }
// }

async function loadAndRender(til) {
    await loadTil(til);
    // getId('pikachu').style.display = "none";
    maxNumber = til;
    loadFavorites();
    renderAllCards();
}
async function loadTil(end) {
    for (let i = maxNumber + 1; i <= end; i++) {
        if (!pokeExtract[i] && i < end) {
            loadPokemon(i);
            console.log('loading' + i);
        } else {
            await loadPokemon(i);
            console.log('loading' + i);
        }
    }
}

function renderAllCards() {
    getId('small-cards').innerHTML = '';
    for (let i = 0; i < pokeExtract.length; i++) {
        if (pokeExtract[i]) {
            renderSmallCard(i);
        };
    }
    getId('small-cards').innerHTML += `<div class="small-card" style="visibility:hidden;"></div>`;
}

async function loadPokemon(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    pokemon = await response.json();
    //pokeInfos.push(pokemon);// kann später entfallen
    extractFeatures(pokemon);
}

function extractFeatures(pokemon) {
    let pokeId = pokemon.id;
    let name = pokemon.name;
    let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`;
    let types = extractTypes(pokemon);
    let mainType = types.mainType;
    let secondType = types.secondType;
    let species = capFirstLetter(pokemon.species.name);
    let height = (pokemon.height * 10).toString() + ' cm';
    let weight = (pokemon.weight / 10).toFixed(1) + ' kg';
    let abilities = extractAbilities(pokemon);
    let hp = pokemon.stats[0].base_stat;
    let attack = pokemon.stats[1].base_stat;
    let defense = pokemon.stats[2].base_stat;
    let specialAttack = pokemon.stats[3].base_stat;
    let specialDefense = pokemon.stats[4].base_stat;
    let speed = pokemon.stats[5].base_stat;
    let baseStatTotal = hp + attack + defense + specialAttack + specialDefense + speed;
    let baseStatAvg = (baseStatTotal / 6).toFixed(1);
    let baseExp = pokemon.base_experience;
    let moves = extractMoves(pokemon);
    let items = pokemon.items;

    pokeExtract[pokeId] = { pokeId, name, image, mainType, secondType, species, height, weight, abilities, hp, attack, defense, specialAttack, specialDefense, speed, baseStatTotal, baseStatAvg, baseExp, moves, items };
}

function extractTypes(pokemon) {
    let types = pokemon.types;
    let mainType = types[0].type.name;
    let secondType = '';
    if (types.length == 2) {
        secondType = types[1].type.name;
    }
    return { mainType, secondType }
}
function extractAbilities(pokemon) {
    let abilities = capFirstLetter(pokemon.abilities[0].ability.name);
    for (let i = 1; i < pokemon.abilities.length; i++) {
        abilities += ', ' + capFirstLetter(pokemon.abilities[i].ability.name);
    }
    return abilities;
}
function extractMoves(pokemon) {
    let moves = [];
    for (let i = 0; i < pokemon.moves.length; i++) {
        moves.push(capFirstLetter(pokemon.moves[i].move.name));
    }
    return moves;
}

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
    colorizeCard(`card-${pokemon.pokeId}`, pokemon.mainType, pokemon.secondType);
}

function renderTypeDivs(main, second) {
    let htmlcode =
        `<div class="type mt-1 me-1 px-2 py-1">${capFirstLetter(main)}</div>`;
    if (second) {
        htmlcode += `
        <div class="type mt-1 px-2 py-1">${capFirstLetter(second)}</div>`;
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
    if (id > maxNumber) {
        getId('arrow-right').classList.add('invisible');
        getId('arrow-left').classList.add('invisible');
    }
    renderBigCard(id);
}
function closeBigCard() {
    getId('arrow-right').classList.remove('invisible');
    getId('arrow-left').classList.remove('invisible');
    getId('blur').classList.add('d-none');
    document.body.style = 'overflow:auto;';
}

function renderBigCard(id) {
    currPokemon = pokeExtract[id];
    getId('big-card').style.border = `2px solid var(--bg-${currPokemon.mainType})`;
    renderHeader();
    renderInfos();
    defineOnclickFct(id);
}
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


function renderInfos() {
    changeTabColor();
    renderAbout();
    renderBaseStats();
    renderMoves();
    colorizeInnerBorders();
}
function colorizeInnerBorders() {

    colorizeBorder("td");
    colorizeBorder("tfoot");
    colorizeBorder(".move");
    colorizeBorder("td");
    colorizeBorder("td");
}

function colorizeBorder(element) {
    let elements = document.querySelectorAll(`${element}`);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.borderColor = `var(--bg-${currPokemon.mainType}`;
    }
}
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
function calcInfoHeight() {
    let content = getId('tab-content');
    let bigCard = getId('big-card');
    maxHeight = Math.min(window.innerHeight - content.getBoundingClientRect().top - 16, bigCard.getBoundingClientRect().bottom - content.getBoundingClientRect().top);
    return maxHeight;
}

function renderAbout() {
    let about = getId('about');
    about.style.maxHeight = `${calcInfoHeight()}px`;

    getId('species').innerHTML = currPokemon.species;
    getId('height').innerHTML = currPokemon.height;
    getId('weight').innerHTML = currPokemon.weight;
    getId('abilities').innerHTML = currPokemon.abilities;
}

function renderBaseStats() {
    let base = getId('base');
    base.style.maxHeight = `${calcInfoHeight()}px`;

    getId('hp').innerHTML = currPokemon.hp;
    getId('attack').innerHTML = currPokemon.attack;
    getId('defense').innerHTML = currPokemon.defense;
    getId('sp-attack').innerHTML = currPokemon.specialAttack;
    getId('sp-defense').innerHTML = currPokemon.specialDefense;
    getId('speed').innerHTML = currPokemon.speed;
    getId('total').innerHTML = currPokemon.baseStatTotal;
    getId('avg').innerHTML = currPokemon.baseStatAvg;
}

function renderMoves() {
    let moves = getId('moves');

    moves.style.maxHeight = `${calcInfoHeight()}px`;
    moves.innerHTML = '';
    for (let i = 0; i < currPokemon.moves.length; i++) {
        const move = currPokemon.moves[i];
        moves.innerHTML += `
        <div class="move text-nowrap p-1 text-center m-1">${move}</div>
        `;
    }
}
