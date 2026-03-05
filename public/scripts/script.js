import { POKEMON_TYPES } from "./utils/pokemon.js";
import {
  appendWithParentAndGrandparent,
  cls,
  createElement,
  ELEMENTS,
  getHtmlElement,
  removeChildElement,
} from "./utils/DOM.js";

const { LI, BUTTON, DIV, IMG, H3, P, TABLE, TR, TD } = ELEMENTS;

const createFragments = ([tag, attribute, ...contents]) => {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attribute)) {
    element.setAttribute(key, value);
  }

  if (contents.length === 1 && typeof contents[0] === "string") {
    element.textContent = contents[0];
    return element;
  }

  element.append(...contents.map(createFragments));

  return element;
};

const createImageContainer = (url) =>
  [DIV, { class: "img-container" },
    [IMG, { class: "image", src: url }, ""]
  ];

const createTableRows = (stats) => {
  const rows = [];

  for (const [name, value] of Object.entries(stats)) {
    const row = [
      TR, cls("stats-row"),
      [TD, cls("stats-name"), name],
      [TD, cls("stats-value"), `${value}`]
    ];

    rows.push(row);
  }

  return rows;
};

const createTypes = (types) => types.map((type) => ["p", cls(type), type]);

const createOverView = (name, types) =>
  [ DIV, cls("overview"),
    [H3, cls("name"), name],
    [DIV, cls("types"), ...createTypes(types)]
  ];

const createContentContainer = (name, types, stats) =>
  [ DIV, cls("content-container"),
    createOverView(name, types),
    [TABLE, cls("stats"), ...createTableRows(stats)]
  ];

const createPokemonCard = ({ img, name, types, stats }) => {
  const cards = [
    DIV, cls("card"), 
    createImageContainer(img), 
    createContentContainer(name, types, stats),
  ];

  return createFragments(cards);
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

const createButtonElement = (type) => {
  const buttons = [LI, {}, [BUTTON, { type: "submit", id: type }, type]];

  return createFragments(buttons);
};

const generateSideBar = (pageType) => {
  const buttons = [];

  for (const type of POKEMON_TYPES) {
    const button = createButtonElement(type);

    if (type === pageType) button.setAttribute("class", type);

    buttons.push(button);
  }

  return buttons;
};

const generatePage = async (e) => {
  if (e.target.tagName !== "BUTTON") return;

  e.preventDefault();

  const main = getHtmlElement("main");
  const sideBar = getHtmlElement("#side-bar");

  const navBar = getHtmlElement("#nav-bar");
  removeChildElement(sideBar, navBar);

  const navBarElement = createElement("ul", "nav-bar");
  const buttons = generateSideBar(e.target.textContent);
  appendWithParentAndGrandparent(buttons, navBarElement, sideBar);

  const containerDiv = getHtmlElement("#container");
  removeChildElement(main, containerDiv);

  const container = createElement("div", "container");
  const divs = await generatePokemonCards(e.target.textContent);
  appendWithParentAndGrandparent(divs, container, main);
};

const init = async () => {
  const main = getHtmlElement("main");
  const sideBar = getHtmlElement("#side-bar");

  const navBar = createElement("ul", "nav-bar");
  const container = createElement("div", "container");

  const buttons = generateSideBar("all");
  const divs = await generatePokemonCards("all");

  appendWithParentAndGrandparent(buttons, navBar, sideBar);
  appendWithParentAndGrandparent(divs, container, main);

  sideBar.addEventListener("click", generatePage);
};

window.onload = init;
