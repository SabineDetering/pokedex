/**
 * extract relevant data from API-response
 * @param {*} pokemon 
 */
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

/**
 * extract types from API-data
 * @param {json} pokemon 
 * @returns {mainType, secondType}
 */
function extractTypes(pokemon) {
    let types = pokemon.types;
    let mainType = types[0].type.name;
    let secondType = '';
    if (types.length == 2) {
        secondType = types[1].type.name;
    }
    return { mainType, secondType }
}
/**
 * extract abilities from API-data
 * @param {json} pokemon 
 * @returns string, comma separated list of abilities 
 */
function extractAbilities(pokemon) {
    let abilities = capFirstLetter(pokemon.abilities[0].ability.name);
    for (let i = 1; i < pokemon.abilities.length; i++) {
        abilities += ', ' + capFirstLetter(pokemon.abilities[i].ability.name);
    }
    return abilities;
}
/**
 * extract moves from API-data
 * @param {json} pokemon 
 * @returns array of moves
 */
function extractMoves(pokemon) {
    let moves = [];
    for (let i = 0; i < pokemon.moves.length; i++) {
        moves.push(capFirstLetter(pokemon.moves[i].move.name));
    }
    return moves;
}