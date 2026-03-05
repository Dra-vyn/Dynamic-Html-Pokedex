export const ELEMENTS = {
  LI: "li",
  BUTTON: "button",
  DIV: "div",
  IMG: "img",
  H3: "h3",
  P: "p",
  TABLE: "table",
  TR: "tr",
  TD: "td",
};

export const cls = (string) => ({ class: string});

export const createElement = (tag, id) => {
  const childElement = document.createElement(tag);

  if (id) childElement.id = id;

  return childElement;
};

const appendChildren = (children, parent) => {
  children.forEach((child) => parent.appendChild(child));
};

const appendChild = (parent, child) => parent.appendChild(child);

export const appendWithParentAndGrandparent = (
  children,
  parent,
  grandParent,
) => {
  appendChildren(children, parent);
  appendChild(grandParent, parent);
};

export const removeChildElement = (parent, child) => parent.removeChild(child);

export const getHtmlElement = (selector) => document.querySelector(selector);
