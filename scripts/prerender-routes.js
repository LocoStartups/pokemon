
const TOTAL_POKEMONS = 151;
const TOTAL_PAGES = 5;

( async () => {

  const fs = require('fs');

  const pokemonIds = Array.from({length: TOTAL_POKEMONS},(_,i) => i + 1);

  let fileContents = pokemonIds.map(
    id => `pokemons/${id}`
  ).join('\n')

  fs.writeFileSync('routes.txt',fileContents);

  const pagesIds = Array.from({length: TOTAL_PAGES},(_,i) => i + 1);

  let fileContents2 = pagesIds.map(
    id => `pokemons/page/${id}`
  ).join('\n')


  fs.appendFileSync('routes.txt','\n');
  fs.appendFileSync('routes.txt',fileContents2);


  const pokemonNameList = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ TOTAL_POKEMONS }`)
  .then( res => res.json() )

  pokemonNames = pokemonNameList.results.map(poke => `pokemons/${ poke.name }`);

  fs.appendFileSync('routes.txt','\n');
  fs.appendFileSync('routes.txt',pokemonNames.join('\n'));



  console.log('Routes.txt generado');

} )();
