const createFragments = (tag, attribute, contents) => {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attribute)) {
    element.setAttribute(key, value);
  }

  if (contents.length === 1 && typeof contents[0] === "string") {
    element.textContent = contents[0];
    return element;
  }

  contents.forEach((content) =>
    element.appendChild(createFragments(...content))
  );

  return element;
};

const createImageContainer = (url) => [
  "div",
  { class: "img-container" },
  [["img", { class: "image", src: url }, [""]]],
];

const createTableRows = (stats) => {
  const rows = [];

  for (const [name, value] of Object.entries(stats)) {
    const row = ["tr", { class: "stats-row" }, [[
      "td",
      { class: "stats-name" },
      [name],
    ], ["td", { class: "stats-value" }, [`${value}`]]]];

    rows.push(row);
  }

  return rows;
};

const createTypes = (types) =>
  types.map((type) => ["p", { class: type }, [type]]);

const createOverView = (name, types) => [
  "div",
  { class: "overview" },
  [["h3", { class: "name" }, [name]], [
    "div",
    { class: "types" },
    createTypes(types),
  ]],
];

const createContentContainer = (name, types, stats) => [
  "div",
  { class: "content-container" },
  [createOverView(name, types), [
    "table",
    { class: "stats" },
    createTableRows(stats),
  ]],
];

const createPokemonCard = ({ img, name, types, stats }) => {
  const cards = [
    "div",
    { class: "card" },
    [createImageContainer(img), createContentContainer(name, types, stats)],
  ];

  return createFragments(...cards);
};

const createAllPokemonCards = (dataSet) => {
  const data = [];

  for (const pokemon in dataSet) {
    const pokemonData = createPokemonCard(dataSet[pokemon]);

    data.push(pokemonData);
  }

  return data;
};

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
  fetch("/data/pokemon.json")
    .then((data) => data.json())
    .then((data) => type === "all" ? data : filterPokemonByType(data, type));

const generatePokemonCards = async (type) => {
  const pokemon = await fetchPokemon(type);

  return createAllPokemonCards(pokemon);
};

const POKEMON_TYPES = [
  "all",
  "grass",
  "poison",
  "fire",
  "flying",
  "water",
  "bug",
  "normal",
  "ground",
  "fairy",
  "fighting",
  "electric",
  "psychic",
  "rock",
  "ice",
  "dragon",
  "ghost",
  "dark",
  "steel",
];

const createButtonElement = (type) => {
  const buttons = ["li", {}, [["button", { type: "submit", id: type }, [
    type,
  ]]]];

  return createFragments(...buttons);
};

const generateSideBar = (pageType) => {
  const buttons = [];

  for (const type of POKEMON_TYPES) {
    const button = createButtonElement(type);

    if (type === pageType) {
      button.setAttribute("class", type);
    }

    buttons.push(button);
  }

  return buttons;
};

const createContainer = () => {
  const container = document.createElement("div");
  container.setAttribute("id", "container");

  return container;
};

const createAndSetElements = (tag, id) => {
  const childElement = document.createElement(tag);
  childElement.setAttribute("id", id);

  return childElement;
}

const appendChildElements = (tag, id, elements, parentTag) => {
  const childElement = createAndSetElements(tag, id)
  elements.forEach((element) => childElement.appendChild(element));
  parentTag.appendChild(childElement);
}

const removeElements = (selector, parent) => {
  const childElement = document.querySelector(selector);
  parent.removeChild(childElement)
}

const generatePage = async (e) => {
  if (e.target.tagName !== "BUTTON") return;
  e.preventDefault();
  const main = document.querySelector("main");
  const sideBar = document.querySelector("#side-bar");
  removeElements('#nav-bar', sideBar);
  const buttons = generateSideBar(e.target.textContent);
  appendChildElements('ul', 'nav-bar', buttons, sideBar);
  removeElements('#container', main);
  
  const divs = await generatePokemonCards(e.target.textContent);

  appendChildElements('div', 'container', divs, main)
};

const init = async () => {
  const navBar = createAndSetElements("id", "nav-bar")
  const sideBar = document.querySelector("#side-bar");
  const main = document.querySelector("main");
  const container = createContainer();
  const buttons = generateSideBar("all");
  const divs = await generatePokemonCards("all");

  buttons.forEach((button) => navBar.appendChild(button));
  sideBar.appendChild(navBar);
  divs.forEach((div) => container.appendChild(div));
  main.appendChild(container);

  sideBar.addEventListener("click", generatePage);
};

window.onload = init;
