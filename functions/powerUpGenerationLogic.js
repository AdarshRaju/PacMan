import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";

function addPowerUpToState(powerUpNumber) {
  let newpowerUpCell =
    stateVars.pathArray[stateVars.currentPowerUpCoor[powerUpNumber][0]][
      stateVars.currentPowerUpCoor[powerUpNumber][1]
    ];

  newpowerUpCell.push(`powerUp${powerUpNumber}`);
}

function addPowerUpToDOM(powerUpNumber) {
  const constPowerUpDiv =
    docElems.mainGridContainer.children[
      stateVars.currentPowerUpCoor[powerUpNumber][0]
    ].children[stateVars.currentPowerUpCoor[powerUpNumber][1]];
  constPowerUpDiv.classList.add("powerUp");
}

// populatePowerUpsinArrayandDOM() is for the placement of powerUps in the board without any ghosts or pacman in it
export function populatePowerUpsinArrayandDOM(powerUpNumber) {
  // filteredArray returns only the coordinates not occupied by pacman or ghosts or other power ups
  let filteredArray = stateVars.pathCoord.filter(([row, col]) => {
    return !(
      (row === stateVars.currentPacmanCoor[0] &&
        col === stateVars.currentPacmanCoor[1]) ||
      stateVars.currentGhostCoor?.some(([ghostNumRow, ghostNumCol]) => {
        return row === ghostNumRow && col === ghostNumCol;
      }) ||
      stateVars.currentPowerUpCoor?.some(([powerNumRow, powerNumCol]) => {
        return row === powerNumRow && col === powerNumCol;
      })
    );
  });

  let randomIndex = Math.floor(Math.random() * filteredArray.length);
  stateVars.currentPowerUpCoor[powerUpNumber] = filteredArray[randomIndex];

  addPowerUpToState(powerUpNumber);
  addPowerUpToDOM(powerUpNumber);
}
