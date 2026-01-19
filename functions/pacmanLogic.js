import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";

function addPacmanToState() {
  let newPacmanCell =
    stateVars.pathArray[stateVars.currentPacmanCoor[0]][
      stateVars.currentPacmanCoor[1]
    ];

  newPacmanCell.push("pacman");
}

function addPacmanToDOM() {
  const pacmanDiv = document.createElement("div");

  pacmanDiv.classList.add("pacman");

  docElems.mainGridContainer.children[stateVars.currentPacmanCoor[0]].children[
    stateVars.currentPacmanCoor[1]
  ].appendChild(pacmanDiv);
}

export function addPacmanGameOverToDOM() {
  const pacmanDiv = document.createElement("div");

  pacmanDiv.classList.add("pacmanGameOver");

  docElems.mainGridContainer.children[stateVars.currentPacmanCoor[0]].children[
    stateVars.currentPacmanCoor[1]
  ].appendChild(pacmanDiv);
}

export function removePacmanFromState() {
  const pacInd =
    stateVars.pathArray[stateVars.currentPacmanCoor[0]][
      stateVars.currentPacmanCoor[1]
    ].indexOf("pacman");
  if (pacInd > -1) {
    stateVars.pathArray[stateVars.currentPacmanCoor[0]][
      stateVars.currentPacmanCoor[1]
    ].splice(pacInd, 1);
  }
}

export function removePacmanFromDOM() {
  document.querySelector(".pacman")?.remove();
}

function updatePacmanAnimationDirection() {
  switch (stateVars.pacmanDirection) {
    case "Up":
      docElems.pacman[0].style.animationName = "pacman-up";
      break;
    case "Down":
      docElems.pacman[0].style.animationName = "pacman-down";
      break;
    case "Left":
      docElems.pacman[0].style.animationName = "pacman-left";
      break;
    case "Right":
      docElems.pacman[0].style.animationName = "pacman-right";
      break;
  }
}

export function populatePacmaninArrayandDOM() {
  const randomIndex = Math.floor(Math.random() * stateVars.pathCoord.length);

  stateVars.currentPacmanCoor = stateVars.pathCoord[randomIndex];

  addPacmanToState();

  addPacmanToDOM();
}

function updatePacmanArrayAndDOM() {
  if (!stateVars.gameOver) {
    removePacmanFromState();

    removePacmanFromDOM();

    let prevPacmanCoord = [...stateVars.currentPacmanCoor];

    // Set the new pacman coordinate based on direction
    switch (stateVars.pacmanDirection) {
      case "Up":
        // check for portal condition at top-most row
        if (stateVars.currentPacmanCoor[0] === 0) {
          stateVars.currentPacmanCoor = [
            stateVars.gridsize - 1,
            stateVars.currentPacmanCoor[1],
          ];
        } else {
          stateVars.currentPacmanCoor = [
            stateVars.currentPacmanCoor[0] - 1,
            stateVars.currentPacmanCoor[1],
          ];
        }

        break;
      case "Down":
        // check for portal condition at bottom-most row
        if (stateVars.currentPacmanCoor[0] === stateVars.gridsize - 1) {
          stateVars.currentPacmanCoor = [0, stateVars.currentPacmanCoor[1]];
        } else {
          stateVars.currentPacmanCoor = [
            stateVars.currentPacmanCoor[0] + 1,
            stateVars.currentPacmanCoor[1],
          ];
        }

        break;
      case "Left":
        // check for portal condition at left-most row
        if (stateVars.currentPacmanCoor[1] === 0) {
          stateVars.currentPacmanCoor = [
            stateVars.currentPacmanCoor[0],
            stateVars.gridsize - 1,
          ];
        } else {
          stateVars.currentPacmanCoor = [
            stateVars.currentPacmanCoor[0],
            stateVars.currentPacmanCoor[1] - 1,
          ];
        }

        break;
      case "Right":
        // check for portal condition at right-most row
        if (stateVars.currentPacmanCoor[1] === stateVars.gridsize - 1) {
          stateVars.currentPacmanCoor = [stateVars.currentPacmanCoor[0], 0];
        } else {
          stateVars.currentPacmanCoor = [
            stateVars.currentPacmanCoor[0],
            stateVars.currentPacmanCoor[1] + 1,
          ];
        }

        break;
    }

    let updatedPacmanCell =
      stateVars.pathArray[stateVars.currentPacmanCoor[0]][
        stateVars.currentPacmanCoor[1]
      ];

    if (updatedPacmanCell.includes("ghost")) {
      stateVars.gameOver = true;
      clearInterval(stateVars.pacmanInterval);
      clearInterval(stateVars.ghostInterval);
      stateVars.currentPacmanCoor = prevPacmanCoord;
      updatedPacmanCell.push("pacmanGameOver");

      addPacmanGameOverToDOM();
    } else {
      // If food is in the new cell without a ghost, remove 'food' from state array and DOM and update score

      if (updatedPacmanCell.includes("food")) {
        // remove food in state array and DOM and increase the score
        const foodInd = updatedPacmanCell.indexOf("food");
        updatedPacmanCell.splice(foodInd, 1);
        docElems.mainGridContainer.children[
          stateVars.currentPacmanCoor[0]
        ].children[stateVars.currentPacmanCoor[1]].classList.remove("food");
        stateVars.score += 1;
        docElems.scoreValue.innerHTML = stateVars.score;
      }
      updatedPacmanCell.push("pacman");

      addPacmanToDOM();
    }
  }
}

function pacmanNormalUpCheck() {
  return stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentPacmanCoor[0] - 1 &&
      col === stateVars.currentPacmanCoor[1]
    );
  });
}
function pacmanUpPortalCheck() {
  if (
    stateVars.currentPacmanCoor[0] === 0 &&
    stateVars.pathCoord.some(([row, col]) => {
      return (
        row === stateVars.gridsize - 1 && col === stateVars.currentPacmanCoor[1]
      );
    })
  ) {
    return true;
  }
}

export function pacmanUp() {
  const checkUp = pacmanNormalUpCheck() || pacmanUpPortalCheck();
  if (checkUp) {
    stateVars.pacmanDirection = "Up";

    updatePacmanArrayAndDOM();

    docElems.pacman[0] &&
      (docElems.pacman[0].style.animationName = "pacman-up");
  } else {
  }
}

function pacmanNormalDownCheck() {
  return stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentPacmanCoor[0] + 1 &&
      col === stateVars.currentPacmanCoor[1]
    );
  });
}
function pacmanDownPortalCheck() {
  if (
    stateVars.currentPacmanCoor[0] === stateVars.gridsize - 1 &&
    stateVars.pathCoord.some(([row, col]) => {
      return row === 0 && col === stateVars.currentPacmanCoor[1];
    })
  ) {
    return true;
  }
}
export function pacmanDown() {
  const checkDown = pacmanNormalDownCheck() || pacmanDownPortalCheck();

  if (checkDown) {
    stateVars.pacmanDirection = "Down";

    updatePacmanArrayAndDOM();
    docElems.pacman[0] &&
      (docElems.pacman[0].style.animationName = "pacman-down");
  } else {
  }
}

function pacmanNormalLeftCheck() {
  return stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentPacmanCoor[0] &&
      col === stateVars.currentPacmanCoor[1] - 1
    );
  });
}
function pacmanLeftPortalCheck() {
  if (
    stateVars.currentPacmanCoor[1] === 0 &&
    stateVars.pathCoord.some(([row, col]) => {
      return (
        row === stateVars.currentPacmanCoor[0] && col === stateVars.gridsize - 1
      );
    })
  ) {
    return true;
  }
}

export function pacmanLeft() {
  const checkLeft = pacmanNormalLeftCheck() || pacmanLeftPortalCheck();

  if (checkLeft) {
    stateVars.pacmanDirection = "Left";

    updatePacmanArrayAndDOM();
    docElems.pacman[0] &&
      (docElems.pacman[0].style.animationName = "pacman-left");
  } else {
  }
}
function pacmanNormalRightCheck() {
  return stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentPacmanCoor[0] &&
      col === stateVars.currentPacmanCoor[1] + 1
    );
  });
}
function pacmanRightPortalCheck() {
  if (
    stateVars.currentPacmanCoor[1] === stateVars.gridsize - 1 &&
    stateVars.pathCoord.some(([row, col]) => {
      return row === stateVars.currentPacmanCoor[0] && col === 0;
    })
  ) {
    return true;
  }
}
export function pacmanRight() {
  const checkRight = pacmanRightPortalCheck() || pacmanNormalRightCheck();

  if (checkRight) {
    stateVars.pacmanDirection = "Right";

    updatePacmanArrayAndDOM();
    docElems.pacman[0] &&
      (docElems.pacman[0].style.animationName = "pacman-right");
  } else {
  }
}

export function generatePacmanAtParticularPoint(x, y, direction) {
  clearInterval(stateVars.pacmanInterval);
  removePacmanFromState();
  removePacmanFromDOM();
  stateVars.currentPacmanCoor[0] = x;
  stateVars.currentPacmanCoor[1] = y;
  stateVars.pacmanDirection = direction;
  addPacmanToState();
  addPacmanToDOM();
  updatePacmanAnimationDirection();
}
