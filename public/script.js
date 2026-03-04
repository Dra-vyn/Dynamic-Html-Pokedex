const createFragments = (tag, attribute, contents) => {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attribute)) {
    element.setAttribute(key, value);
  }
  
  if (contents.length === 1 && typeof contents[0] === 'string') {
    element.textContent = contents[0];
    return element;
  }

  contents.forEach(content => element.append(createFragments(...content)));

  return element;
};

const createImageContainer = (url) => [
  "div", { class: "img-container" },
  [["img", { class: "image", src: url }, ['']]]];

const createTableRows = (stats) => {
  const rows = [];

  for (const [name, value] of Object.entries(stats)) {
    const row = ['tr', { class: "stats-row" },
      [['td', { class: 'stats-name' }, [name]],
        ['td', { class: 'stats-value' }, [`${value}`]]]];
    
    rows.push(row);
  };

  return rows
}  

const createTypes = (types) => 
  types.map(type => ['p', { class: type }, [type]]);

const createOverView = (name, types) => [
  'div', { class: 'overview' }, [['h3', { class: 'name' }, [name]],
  ['div', { class: 'types' }, createTypes(types)]]];
  
const createContentContainer = (name, types, stats) => [
  'div', { class: 'content-container' },
  [createOverView(name, types), ['table',
    { class: 'stats' }, createTableRows(stats)]]
];

const createPokemonCard = ({ img, name, types, stats }) => {
  const cards = [
    "div",
    { class: "card" },
    [createImageContainer(img), createContentContainer(name, types, stats)]
  ];

  return createFragments(...cards);
};

const createAllPokemonCards = (dataSet) => {
  const data = [];

  for (const pokemon in dataSet) {
    const pokemonData = createPokemonCard(dataSet[pokemon]);

    data.push(pokemonData);
  };

  return data;
}

const isRequiredType = ({ types }, type) => types.includes(type);

const filterPokemonByType = (dataSet, type) => {
  const pokedex = {};

  for (const pokemon in dataSet) {
    const data = dataSet[pokemon];
    if (isRequiredType(data, type)) pokedex[pokemon] = data;
  }

  return pokedex;
};

const fetchPokemon = async (type) =>
  fetch('/data/pokemon.json')
    .then(data => data.json())
    .then(data => filterPokemonByType(data, type));

const generatePokemonCards = async (type) => {
  const pokemon = await fetchPokemon(type);

  return createAllPokemonCards(pokemon);
}

const init = async () => {
  const main = document.querySelector('main');
  const container = document.createElement('div');
  container.setAttribute('id', 'container');

  const divs = await generatePokemonCards('flying')

  divs.forEach(div => container.append(div));
  main.append(container);
console.log(main)
  return main;
}

window.onload = init;
