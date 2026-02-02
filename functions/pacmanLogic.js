import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";
import * as gameFunc from "./mainGameFunctions.js";
import * as ghosts from "./ghostsLogic.js";

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
  const randomIndex = Math.floor(
    Math.random() * stateVars.filteredpathCoord.length,
  );
  stateVars.currentPacmanCoor = stateVars.filteredpathCoord[randomIndex];

  addPacmanToState();

  addPacmanToDOM();
}

export function handleNewHighScore() {
  if (stateVars.score > stateVars.highScore) {
    stateVars.highScore = stateVars.score;
    docElems.highScoreValue.innerHTML = stateVars.highScore;
    localStorage.setItem(
      "pacmanHighScore",
      JSON.stringify(stateVars.highScore),
    );
  }
}

export function handleGameOver() {
  stateVars.gameOver = true;

  stateVars.pacmanAudio.source.stop();

  clearInterval(stateVars.pacmanInterval);

  stateVars.ghostInterval.forEach((ghostInt) => {
    if (ghostInt !== null) {
      clearInterval(ghostInt);
    }
  });
  stateVars.pathArray[stateVars.currentPacmanCoor[0]][
    stateVars.currentPacmanCoor[1]
  ].push("pacmanGameOver");

  addPacmanGameOverToDOM();

  if (parseInt(stateVars.score) >= parseInt(stateVars.highScore)) {
    docElems.newHighScoreSound.play();
  } else if (docElems.foodCells.length === 0) {
    docElems.allFoodFinishedSound.play();
  } else {
    gameFunc.loadAudioThroughAudioContext(gameFunc.pacmanGameOverBufferDecoded);
  }
}

function handlePacmanPowerUpOnState() {
  stateVars.poweredUp = true;

  gameFunc.handlePacmanMovementReStart();

  stateVars.ghostHexedStates.forEach((gs, i, array) => (array[i] = true));

  [...document.querySelectorAll(".ghosts")].forEach((ghost) => {
    ghost.classList.add("hexedghost");
  });

  // Clears any setTimeOut set from previous powerUp picked up by pacman
  clearInterval(stateVars.pacmanPoweredUpSetTimeOut);
  stateVars.pacmanPoweredUpSetTimeOut = setTimeout(
    handlePacmanPowerUpOffState,
    stateVars.pacmanPoweredUpTime,
  );
}

function handlePacmanPowerUpOffState() {
  stateVars.poweredUp = false;
  stateVars.ghostHexedStates.forEach((gs, i, array) => (array[i] = false));
  [...document.querySelectorAll(".ghosts")].forEach((ghost) => {
    ghost.classList.remove("hexedghost");
  });
}

function updatePacmanArrayAndDOM() {
  if (!stateVars.gameOver && !stateVars.paused) {
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

    // Check for gameOver or ghost swallow if pacman hits ghost
    const cellWithGhostCheck = updatedPacmanCell.filter((element) =>
      element.includes("ghost"),
    );

    if (cellWithGhostCheck.length > 0) {
      const ghostNumber = parseInt(cellWithGhostCheck[0].slice(5));

      if (stateVars.ghostHexedStates[ghostNumber]) {
        docElems.ghostSwallowSound.play();
        stateVars.score += 10;
        docElems.scoreValue.innerHTML = stateVars.score;
        handleNewHighScore();

        ghosts.removeGhostFromState(ghostNumber);
        ghosts.removeGhostFromDOM(ghostNumber);
        ghosts.populateGhostinArrayandDOM(ghostNumber);
        ghosts.removeGhostHexState(ghostNumber);
      } else {
        stateVars.currentPacmanCoor = prevPacmanCoord;

        handleGameOver();
      }
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

        handleNewHighScore();
        docElems.scoreValue.innerHTML = stateVars.score;
        if (docElems.foodCells.length === 0) {
          handleGameOver();
          docElems.scoreValue.innerHTML = "Congrats! You won!";
        }
      }
      if (updatedPacmanCell.some((element) => element.includes("powerUp"))) {
        const powerUpInd = updatedPacmanCell.findIndex((subitem) =>
          subitem.includes("powerUp"),
        );
        updatedPacmanCell.splice(powerUpInd, 1);
        docElems.mainGridContainer.children[
          stateVars.currentPacmanCoor[0]
        ].children[stateVars.currentPacmanCoor[1]].classList.remove("powerUp");

        handlePacmanPowerUpOnState();
      }
      updatedPacmanCell.push("pacman");
      if (!stateVars.gameOver && !stateVars.paused) {
        addPacmanToDOM();
      }
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
