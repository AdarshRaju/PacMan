import * as docElems from "./globalVariables/docElems.js";
import stateVars from "./globalVariables/stateVars.js";
import * as gameFunc from "./functions/mainGameFunctions.js";
import * as pacmanLogic from "./functions/pacmanLogic.js";
import * as ghostLogic from "./functions/ghostsLogic.js";
import * as foodGen from "./functions/foodGenerationLogic.js";

docElems.loadGridPattern.addEventListener("click", async () => {
  try {
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      startIn: "desktop",
      types: [
        {
          description: "grid coordinates in json array format",
          accept: { "application/json": [".txt"] },
        },
      ],
    });
    const file = await handle.getFile();
    const text = await file.text();

    let jsonExtract;

    try {
      jsonExtract = JSON.parse(text);
      gameFunc.generateFalseOnlyGrid();
      gameFunc.resetBoard();
      stateVars.pathCoord = [...jsonExtract];
    } catch (err) {
      console.error(err);
    }

    gameFunc.createMainGrid();

    gameFunc.populatePathStateArrayandDOM(stateVars.pathCoord);
    pacmanLogic.populatePacmaninArrayandDOM();

    for (let i = 0; i < stateVars.noOfGhosts; i++) {
      // populateGhostinArrayandDOM(ghostnumber) deals with all the logic for one ghost
      ghostLogic.populateGhostinArrayandDOM(i);
    }

    foodGen.populateFoodinArrayandDOM();
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("User has cancelled the Select File operation ");
    } else {
      console.error(err);
    }
  }
});

document.addEventListener("keydown", gameFunc.handleKeyPress);

// #region for testing and debugging
window.generateGhostAtParticularPoint =
  ghostLogic.generateGhostAtParticularPoint;
window.randomGhostDirection = ghostLogic.setRandomGhostDirection;

window.generatePacmanAtParticularPoint =
  pacmanLogic.generatePacmanAtParticularPoint;

window.ghostLOS = ghostLogic.checkForGhostLineOfSight;

window.stateVars = stateVars;
// #endregion for testing and debugging
