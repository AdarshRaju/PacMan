import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";

export function populateFoodinArrayandDOM() {
  // First, the game state, represented through an array is updated
  stateVars.pathArray.forEach((rowItem) => {
    rowItem.forEach((colItem) => {
      if (
        colItem &&
        !colItem.includes("pacman") &&
        // !colItem.includes("ghost") &&
        !colItem.some((subitem) => subitem.includes("powerUp"))
      ) {
        colItem.push("food");
      }
    });
  });

  // The indices from the state array is used to add classes to the corresponding indices of DOM element
  stateVars.pathArray.forEach((rowItem, rowIndex) => {
    rowItem.forEach((colItem, colIndex) => {
      if (
        colItem &&
        colItem.includes("food") &&
        !colItem.includes("pacman") &&
        // !colItem.includes("ghost") &&
        !colItem.some((subitem) => subitem.includes("powerUp"))
      ) {
        docElems.mainGridContainer.children[rowIndex].children[
          colIndex
        ].classList.add("food");
      }
    });
  });
}
