import * as docElems from "./globalVariables/docElems.js";
import stateVars from "./globalVariables/stateVars.js";
import * as gameFunc from "./functions/mainGameFunctions.js";
import * as pacmanLogic from "./functions/pacmanLogic.js";
import * as ghostLogic from "./functions/ghostsLogic.js";
import * as powerUpLogic from "./functions/powerUpGenerationLogic.js";
import * as foodGen from "./functions/foodGenerationLogic.js";

docElems.loadGridPattern.addEventListener("click", async () => {
  stateVars.pacmanAudio?.source.stop();
  stateVars.pacmanAudio = null;

  try {
    // const [handle] = await window.showOpenFilePicker({
    //   multiple: false,
    //   startIn: "desktop",
    //   types: [
    //     {
    //       description: "grid coordinates in json array format",
    //       accept: { "application/json": [".txt"] },
    //     },
    //   ],
    // });
    const handle = await fetch("./stageGrids/Size 25 grid 1.txt");
    // const file = await handle.getFile();
    // const text = await file.text();

    const text = await handle.text();
    let jsonExtract;

    try {
      jsonExtract = JSON.parse(text);
      gameFunc.generateFalseOnlyGrid();
      gameFunc.resetBoard();
      stateVars.pathCoord = [...jsonExtract];
    } catch (err) {
      console.error(err);
    }

    const existingHighScore = localStorage.getItem("pacmanHighScore");
    if (existingHighScore) {
      stateVars.highScore = parseInt(JSON.parse(existingHighScore));
    } else {
      localStorage.setItem("pacmanHighScore", JSON.stringify(0));
    }
    docElems.highScoreValue.innerHTML = stateVars.highScore;
    gameFunc.createMainGrid();
    // populatePathStateArrayandDOM generates the path for pacman and ghosts from the coordinates received
    gameFunc.populatePathStateArrayandDOM(stateVars.pathCoord);
    pacmanLogic.populatePacmaninArrayandDOM();
    stateVars.pacmanAudio = gameFunc.loadAudioThroughAudioContext(
      gameFunc.pacmanSoundBufferDecoded,
      { loop: true },
    );

    for (let i = 0; i < stateVars.noOfGhosts; i++) {
      // populateGhostinArrayandDOM(ghostnumber) deals with all the logic for one ghost
      ghostLogic.populateGhostinArrayandDOM(i);
      stateVars.ghostHexedStates.push(false);
    }
    for (let i = 0; i < stateVars.noOfPowerUps; i++) {
      // populatePowerUpsinArrayandDOM(powerUpnumber) deals with all the logic for one power up
      powerUpLogic.populatePowerUpsinArrayandDOM(i);
    }

    foodGen.populateFoodinArrayandDOM();

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
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
window.startGhostMovement = ghostLogic.updateGhostArrayAndDOM;

window.stateVars = stateVars;
// #endregion for testing and debugging
