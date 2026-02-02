import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";
import * as pacman from "./pacmanLogic.js";

// addGhostToState(ghostNumber) is used to add a particular ghost to the centralised array denoting the placement of characters in the board
function addGhostToState(ghostNumber) {
  let newGhostCell =
    stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0]][
      stateVars.currentGhostCoor[ghostNumber][1]
    ];

  newGhostCell.push(`ghost${ghostNumber}`);
}

// addGhostToBigDisplayDOM(ghostNumber) is used to display the large ghosts with the eye direction indicators at the bottom of the page
function addGhostToBigDisplayDOM(ghostNumber) {
  const ghostSVGDisplay = docElems.ghostSVG.cloneNode(true);
  ghostSVGDisplay.classList.add(`ghosts${ghostNumber}`, `ghosts`);
  ghostSVGDisplay.style.display = "block";

  docElems.bigGhostsDisplay.appendChild(ghostSVGDisplay);
}

// addGhostToBoardDOM(ghostNumber) is used to add ghost at every step of ghost movement through the path cells
function addGhostToBoardDOM(ghostNumber) {
  const ghostSVGDisplay = docElems.ghostSVG.cloneNode(true);
  ghostSVGDisplay.classList.add(`ghosts${ghostNumber}`, `ghosts`);
  if (stateVars.ghostHexedStates[ghostNumber]) {
    ghostSVGDisplay.classList.add(`hexedghost`);
  }
  ghostSVGDisplay.style.display = "block";

  const ghostSVGInBoard = ghostSVGDisplay.cloneNode(true);

  // Set the width and height of the ghost svg to 88% of the corresponding values of each path cell
  docElems.pathCells[0] &&
    ghostSVGInBoard.setAttribute(
      "width",
      docElems.pathCells[0].getBoundingClientRect().width * 0.88,
    );
  docElems.pathCells[0] &&
    ghostSVGInBoard.setAttribute(
      "height",
      docElems.pathCells[0].getBoundingClientRect().height * 0.88,
    );

  ghostSVGInBoard.id = `ghostInBoard${ghostNumber}`;
  docElems.mainGridContainer.children[
    stateVars.currentGhostCoor[ghostNumber][0]
  ].children[stateVars.currentGhostCoor[ghostNumber][1]].appendChild(
    ghostSVGInBoard,
  );
}

// removeGhostFromState(ghostNumber) is used to remove a particular ghost from the centralised array denoting the placement of characters in the board
export function removeGhostFromState(ghostNumber) {
  const ghostInd = stateVars.pathArray[
    stateVars.currentGhostCoor[ghostNumber][0]
  ][stateVars.currentGhostCoor[ghostNumber][1]].indexOf(`ghost${ghostNumber}`);
  if (ghostInd > -1) {
    stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0]][
      stateVars.currentGhostCoor[ghostNumber][1]
    ].splice(ghostInd, 1);
  }
}

// removeGhostFromDOM(ghostNumber) is used to remove the DOM element of a ghost from the HTML, at every step of ghost movement
export function removeGhostFromDOM(ghostNumber) {
  document.querySelector(`#ghostInBoard${ghostNumber}`).remove();
}

export function removeGhostHexState(ghostNumber) {
  stateVars.ghostHexedStates[ghostNumber] = false;
  [...docElems.ghosts(ghostNumber)].forEach((ghost) =>
    ghost.classList.remove("hexedghost"),
  );
}

// updateGhostAnimationDirection changes the way the ghost's eyes are aligned (indicates movement direction)
function updateGhostAnimationDirection(ghostNumber) {
  switch (stateVars.ghostDirection[ghostNumber]) {
    case "Neutral":
      [...docElems.ghosts(ghostNumber)].forEach((ghost) => {
        const ghostUp = ghost.querySelectorAll(".eyesInner");
        ghostUp[0].setAttribute("cx", 35);
        ghostUp[0].setAttribute("cy", 30);
        ghostUp[1].setAttribute("cx", 65);
        ghostUp[1].setAttribute("cy", 30);
      });
      break;
    case "Up":
      [...docElems.ghosts(ghostNumber)].forEach((ghost) => {
        const ghostUp = ghost.querySelectorAll(".eyesInner");
        ghostUp[0].setAttribute("cx", 35);
        ghostUp[0].setAttribute("cy", 28);
        ghostUp[1].setAttribute("cx", 65);
        ghostUp[1].setAttribute("cy", 28);
      });
      break;
    case "Down":
      [...docElems.ghosts(ghostNumber)].forEach((ghost) => {
        const ghostDown = ghost.querySelectorAll(".eyesInner");
        ghostDown[0].setAttribute("cx", 35);
        ghostDown[0].setAttribute("cy", 32);
        ghostDown[1].setAttribute("cx", 65);
        ghostDown[1].setAttribute("cy", 32);
      });
      break;
    case "Left":
      [...docElems.ghosts(ghostNumber)].forEach((ghost) => {
        const ghostLeft = ghost.querySelectorAll(".eyesInner");
        ghostLeft[0].setAttribute("cx", 33);
        ghostLeft[0].setAttribute("cy", 30);
        ghostLeft[1].setAttribute("cx", 63);
        ghostLeft[1].setAttribute("cy", 30);
      });
      break;
    case "Right":
      [...docElems.ghosts(ghostNumber)].forEach((ghost) => {
        const ghostRight = ghost.querySelectorAll(".eyesInner");
        ghostRight[0].setAttribute("cx", 37);
        ghostRight[0].setAttribute("cy", 30);
        ghostRight[1].setAttribute("cx", 67);
        ghostRight[1].setAttribute("cy", 30);
      });
      break;
  }
}

// populateGhostinArrayandDOM() is for the initial placement of ghost in a random path cell in the board
export function populateGhostinArrayandDOM(ghostNumber) {
  const filteredGhostOrigin = stateVars.ghostCageCoords.filter(([row, col]) => {
    return !stateVars.currentGhostCoor.some(([ghostRow, ghostCol]) => {
      return row === ghostRow && col === ghostCol;
    });
  });
  let randomIndex = Math.floor(Math.random() * filteredGhostOrigin.length);
  stateVars.currentGhostCoor[ghostNumber] = filteredGhostOrigin[randomIndex];

  addGhostToState(ghostNumber);
  if (
    document.getElementById("bigGhostsDisplay").children.length <
    stateVars.noOfGhosts
  ) {
    addGhostToBigDisplayDOM(ghostNumber);
  }

  addGhostToBoardDOM(ghostNumber);
  setRandomGhostDirection(ghostNumber);
  requestAnimationFrame(() => updateGhostArrayAndDOM(ghostNumber));
}

function setGhostSpeed(ghostNumber) {
  if (
    !stateVars.pacmanInSight[ghostNumber] ||
    (stateVars.pacmanInSight[ghostNumber] &&
      stateVars.ghostHexedStates[ghostNumber])
  ) {
    stateVars.ghostInterval[ghostNumber] = setInterval(
      updateGhostArrayAndDOM,

      stateVars.ghostNormalSpeed,
      ghostNumber,
    );
  } else {
    console.log(
      "stateVars.pacmanInSight[ghostNumber] activated is: ",
      stateVars.pacmanInSight[ghostNumber],
    );
    docElems.pacmanLOSSound.play();
    stateVars.ghostInterval[ghostNumber] = setInterval(
      updateGhostArrayAndDOM,

      stateVars.ghostLOSSpeed,
      ghostNumber,
    );
  }
}
export function ghostPathFindingLogic(ghostNumber) {
  clearInterval(stateVars.ghostInterval[ghostNumber]);
  const dirArr = getAvailableDirectionsGhost(ghostNumber);
  // The ghost will continue moving forward unless it hits a wall or finds an alternative path
  switch (stateVars.ghostDirection[ghostNumber]) {
    case "Up":
      if (
        (dirArr.includes(ghostRight) ||
          dirArr.includes(ghostLeft) ||
          !dirArr.includes(ghostUp)) &&
        (!stateVars.pacmanInSight[ghostNumber] ||
          (stateVars.pacmanInSight[ghostNumber] &&
            stateVars.ghostHexedStates[ghostNumber]))
      ) {
        if (
          stateVars.pacmanInSight[ghostNumber] &&
          stateVars.ghostHexedStates[ghostNumber] &&
          dirArr.includes(ghostUp)
        ) {
          const ind = dirArr.indexOf(ghostUp);
          dirArr.splice(ind, 1);
          dirArr[Math.floor(Math.random() * dirArr.length)](ghostNumber);
        } else {
          setRandomGhostDirection(ghostNumber);
        }

        stateVars.ghostInterval[ghostNumber] = setInterval(
          updateGhostArrayAndDOM,

          stateVars.ghostNormalSpeed,
          ghostNumber,
        );
      } else {
        if (
          stateVars.pacmanInSight[ghostNumber] &&
          stateVars.ghostHexedStates[ghostNumber] &&
          dirArr.includes(ghostUp)
        ) {
          ghostDown(ghostNumber);
        } else {
          ghostUp(ghostNumber);
        }

        setGhostSpeed(ghostNumber);
      }

      break;
    case "Down":
      if (
        (dirArr.includes(ghostRight) ||
          dirArr.includes(ghostLeft) ||
          !dirArr.includes(ghostDown)) &&
        (!stateVars.pacmanInSight[ghostNumber] ||
          (stateVars.pacmanInSight[ghostNumber] &&
            stateVars.ghostHexedStates[ghostNumber]))
      ) {
        if (
          stateVars.pacmanInSight[ghostNumber] &&
          stateVars.ghostHexedStates[ghostNumber] &&
          dirArr.includes(ghostDown)
        ) {
          const ind = dirArr.indexOf(ghostDown);
          dirArr.splice(ind, 1);
          dirArr[Math.floor(Math.random() * dirArr.length)](ghostNumber);
        } else {
          setRandomGhostDirection(ghostNumber);
        }

        stateVars.ghostInterval[ghostNumber] = setInterval(
          updateGhostArrayAndDOM,

          stateVars.ghostNormalSpeed,
          ghostNumber,
        );
      } else {
        if (
          stateVars.pacmanInSight[ghostNumber] &&
          stateVars.ghostHexedStates[ghostNumber] &&
          dirArr.includes(ghostDown)
        ) {
          ghostUp(ghostNumber);
        } else {
          ghostDown(ghostNumber);
        }

        setGhostSpeed(ghostNumber);
      }
      break;
    case "Left":
      if (
        (dirArr.includes(ghostUp) ||
          dirArr.includes(ghostDown) ||
          !dirArr.includes(ghostLeft)) &&
        (!stateVars.pacmanInSight[ghostNumber] ||
          (stateVars.pacmanInSight[ghostNumber] &&
            stateVars.ghostHexedStates[ghostNumber]))
      ) {
        if (
          stateVars.pacmanInSight[ghostNumber] &&
          stateVars.ghostHexedStates[ghostNumber] &&
          dirArr.includes(ghostLeft)
        ) {
          const ind = dirArr.indexOf(ghostLeft);
          dirArr.splice(ind, 1);
          dirArr[Math.floor(Math.random() * dirArr.length)](ghostNumber);
        } else {
          setRandomGhostDirection(ghostNumber);
        }

        stateVars.ghostInterval[ghostNumber] = setInterval(
          updateGhostArrayAndDOM,

          stateVars.ghostNormalSpeed,
          ghostNumber,
        );
      } else {
        if (
          stateVars.pacmanInSight[ghostNumber] &&
          stateVars.ghostHexedStates[ghostNumber] &&
          dirArr.includes(ghostLeft)
        ) {
          ghostRight(ghostNumber);
        } else {
          ghostLeft(ghostNumber);
        }

        setGhostSpeed(ghostNumber);
      }

      break;
    case "Right":
      if (
        (dirArr.includes(ghostUp) ||
          dirArr.includes(ghostDown) ||
          !dirArr.includes(ghostRight)) &&
        (!stateVars.pacmanInSight[ghostNumber] ||
          (stateVars.pacmanInSight[ghostNumber] &&
            stateVars.ghostHexedStates[ghostNumber]))
      ) {
        if (
          stateVars.pacmanInSight[ghostNumber] &&
          stateVars.ghostHexedStates[ghostNumber] &&
          dirArr.includes(ghostRight)
        ) {
          const ind = dirArr.indexOf(ghostRight);
          dirArr.splice(ind, 1);
          dirArr[Math.floor(Math.random() * dirArr.length)](ghostNumber);
        } else {
          setRandomGhostDirection(ghostNumber);
        }

        stateVars.ghostInterval[ghostNumber] = setInterval(
          updateGhostArrayAndDOM,

          stateVars.ghostNormalSpeed,
          ghostNumber,
        );
      } else {
        if (
          stateVars.pacmanInSight[ghostNumber] &&
          stateVars.ghostHexedStates[ghostNumber] &&
          dirArr.includes(ghostRight)
        ) {
          ghostLeft(ghostNumber);
        } else {
          ghostRight(ghostNumber);
        }
        setGhostSpeed(ghostNumber);
      }

      break;
  }
}

// If pacman is in the direct line of sight of a ghost, it will start moving faster
export function checkForGhostLineOfSight(ghostNumber) {
  if (
    // First checking if a ghost and pacaman are in the same row
    stateVars.currentGhostCoor[ghostNumber][0] ===
    stateVars.currentPacmanCoor[0]
  ) {
    switch (stateVars.ghostDirection[ghostNumber]) {
      case "Right":
        if (
          // If a ghost is facing right and pacman is to the left of the ghost
          stateVars.currentGhostCoor[ghostNumber][1] <
          stateVars.currentPacmanCoor[1]
        ) {
          let localCellCount = 0;
          for (
            let i = stateVars.currentGhostCoor[ghostNumber][1];
            i < stateVars.currentPacmanCoor[1];
            i++
          ) {
            if (
              stateVars.pathCoord.some(([row, col]) => {
                return (
                  row === stateVars.currentGhostCoor[ghostNumber][0] &&
                  col === i
                );
              })
            ) {
              localCellCount += 1;
            }
          }

          if (
            localCellCount ===
            parseInt(stateVars.currentPacmanCoor[1]) -
              parseInt(stateVars.currentGhostCoor[ghostNumber][1])
          ) {
            stateVars.pacmanInSight[ghostNumber] = true;
            console.log("Pacman at right LOS activated");
          }
        } else {
          stateVars.pacmanInSight[ghostNumber] = false;
        }
        break;
      case "Left":
        if (
          stateVars.currentGhostCoor[ghostNumber][1] >
          stateVars.currentPacmanCoor[1]
        ) {
          let localCellCount = 0;
          for (
            let i = stateVars.currentGhostCoor[ghostNumber][1];
            i > stateVars.currentPacmanCoor[1];
            i--
          ) {
            if (
              stateVars.pathCoord.some(([row, col]) => {
                return (
                  row === stateVars.currentGhostCoor[ghostNumber][0] &&
                  col === i
                );
              })
            ) {
              localCellCount += 1;
            }
          }

          if (
            localCellCount ===
            stateVars.currentGhostCoor[ghostNumber][1] -
              stateVars.currentPacmanCoor[1]
          ) {
            stateVars.pacmanInSight[ghostNumber] = true;
            console.log("Pacman at left LOS activated");
          }
        } else {
          stateVars.pacmanInSight[ghostNumber] = false;
        }
        break;
      case "Up":
        stateVars.pacmanInSight[ghostNumber] = false;
        break;
      case "Down":
        stateVars.pacmanInSight[ghostNumber] = false;
        break;
    }
  } else if (
    // Checking if pacman and ghost are in the same column
    stateVars.currentGhostCoor[ghostNumber][1] ===
    stateVars.currentPacmanCoor[1]
  ) {
    switch (stateVars.ghostDirection[ghostNumber]) {
      case "Up":
        if (
          stateVars.currentGhostCoor[ghostNumber][0] >
          stateVars.currentPacmanCoor[0]
        ) {
          let localCellCount = 0;
          for (
            let i = stateVars.currentGhostCoor[ghostNumber][0];
            i > stateVars.currentPacmanCoor[0];
            i--
          ) {
            if (
              stateVars.pathCoord.some(([row, col]) => {
                return (
                  row === i &&
                  col === stateVars.currentGhostCoor[ghostNumber][1]
                );
              })
            ) {
              localCellCount += 1;
            }
          }

          if (
            localCellCount ===
            stateVars.currentGhostCoor[ghostNumber][0] -
              stateVars.currentPacmanCoor[0]
          ) {
            stateVars.pacmanInSight[ghostNumber] = true;
            console.log("Pacman at Up LOS activated");
          }
        } else {
          stateVars.pacmanInSight[ghostNumber] = false;
        }
        break;
      case "Down":
        if (
          stateVars.currentGhostCoor[ghostNumber][0] <
          stateVars.currentPacmanCoor[0]
        ) {
          let localCellCount = 0;
          for (
            let i = stateVars.currentGhostCoor[ghostNumber][0];
            i < stateVars.currentPacmanCoor[0];
            i++
          ) {
            if (
              stateVars.pathCoord.some(([row, col]) => {
                return (
                  row === i &&
                  col === stateVars.currentGhostCoor[ghostNumber][1]
                );
              })
            ) {
              localCellCount += 1;
            }
          }
          if (
            localCellCount ===
            stateVars.currentPacmanCoor[0] -
              stateVars.currentGhostCoor[ghostNumber][0]
          ) {
            stateVars.pacmanInSight[ghostNumber] = true;
          }
        } else {
          stateVars.pacmanInSight[ghostNumber] = false;
          console.log("Pacman at down LOS activated");
        }
        break;
      case "Right":
        stateVars.pacmanInSight[ghostNumber] = false;
        break;
      case "Left":
        stateVars.pacmanInSight[ghostNumber] = false;
        break;
    }
  } else {
    stateVars.pacmanInSight[ghostNumber] = false;
  }
}

// updateGhostArrayAndDOM() is used to move the ghost along the path cells available to it
export function updateGhostArrayAndDOM(ghostNumber) {
  if (!stateVars.gameOver && !stateVars.paused) {
    removeGhostFromState(ghostNumber);

    removeGhostFromDOM(ghostNumber);

    let prevGhostCoor = [...stateVars.currentGhostCoor[ghostNumber]];

    // Set the new ghost coordinate based on direction
    switch (stateVars.ghostDirection[ghostNumber]) {
      case "Up":
        stateVars.currentGhostCoor[ghostNumber] = [
          stateVars.currentGhostCoor[ghostNumber][0] - 1,
          stateVars.currentGhostCoor[ghostNumber][1],
        ];
        break;
      case "Down":
        stateVars.currentGhostCoor[ghostNumber] = [
          stateVars.currentGhostCoor[ghostNumber][0] + 1,
          stateVars.currentGhostCoor[ghostNumber][1],
        ];
        break;
      case "Left":
        stateVars.currentGhostCoor[ghostNumber] = [
          stateVars.currentGhostCoor[ghostNumber][0],
          stateVars.currentGhostCoor[ghostNumber][1] - 1,
        ];
        break;
      case "Right":
        stateVars.currentGhostCoor[ghostNumber] = [
          stateVars.currentGhostCoor[ghostNumber][0],
          stateVars.currentGhostCoor[ghostNumber][1] + 1,
        ];
        break;
    }

    let updatedGhostCell =
      stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0]][
        stateVars.currentGhostCoor[ghostNumber][1]
      ];
    // Check for gameOver if ghost hits pacman
    if (updatedGhostCell.includes("pacman")) {
      if (stateVars.ghostHexedStates[ghostNumber]) {
        docElems.ghostSwallowSound.play();
        stateVars.score += 10;
        docElems.scoreValue.innerHTML = stateVars.score;
        pacman.handleNewHighScore();
        removeGhostHexState(ghostNumber);
        populateGhostinArrayandDOM(ghostNumber);

        return;
      } else {
        pacman.removePacmanFromState();
        pacman.removePacmanFromDOM();
        clearInterval(stateVars.ghostInterval[ghostNumber]);
        pacman.handleGameOver();

        stateVars.currentGhostCoor[ghostNumber] = prevGhostCoor;
      }
    }
    updatedGhostCell.push(`ghost${ghostNumber}`);

    addGhostToBoardDOM(ghostNumber);
    requestAnimationFrame(() => updateGhostAnimationDirection(ghostNumber));
    if (!stateVars.gameOver && !stateVars.paused) {
      checkForGhostLineOfSight(ghostNumber);
      ghostPathFindingLogic(ghostNumber);
    }
  }
}

function checkUpForPath(ghostNumber) {
  return stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[ghostNumber][0] - 1 &&
      col === stateVars.currentGhostCoor[ghostNumber][1]
    );
  });
}

function checkUpGhostInNextCell(ghostNumber) {
  const pathCell =
    stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0] - 1][
      stateVars.currentGhostCoor[ghostNumber][1]
    ];
  if (pathCell) {
    return pathCell.some((item) => item.includes("ghost"));
  } else {
    return false;
  }
}

export function ghostUp(ghostNumber) {
  const checkUp =
    checkUpForPath(ghostNumber) && !checkUpGhostInNextCell(ghostNumber);

  if (checkUp) {
    stateVars.ghostDirection[ghostNumber] = "Up";
  }
}

function checkDownForPath(ghostNumber) {
  return stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[ghostNumber][0] + 1 &&
      col === stateVars.currentGhostCoor[ghostNumber][1]
    );
  });
}

function checkDownGhostInNextCell(ghostNumber) {
  const pathCell =
    stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0] + 1][
      stateVars.currentGhostCoor[ghostNumber][1]
    ];
  if (pathCell) {
    return pathCell.some((item) => item.includes("ghost"));
  } else {
    return false;
  }
}

export function ghostDown(ghostNumber) {
  const checkDown =
    checkDownForPath(ghostNumber) && !checkDownGhostInNextCell(ghostNumber);

  if (checkDown) {
    stateVars.ghostDirection[ghostNumber] = "Down";
  }
}

function checkLeftForPath(ghostNumber) {
  return stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[ghostNumber][0] &&
      col === stateVars.currentGhostCoor[ghostNumber][1] - 1
    );
  });
}

function checkLeftGhostInNextCell(ghostNumber) {
  const pathCell =
    stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0]][
      stateVars.currentGhostCoor[ghostNumber][1] - 1
    ];
  if (pathCell) {
    return pathCell.some((item) => item.includes("ghost"));
  } else {
    return false;
  }
}

export function ghostLeft(ghostNumber) {
  const checkLeft =
    checkLeftForPath(ghostNumber) && !checkLeftGhostInNextCell(ghostNumber);

  if (checkLeft) {
    stateVars.ghostDirection[ghostNumber] = "Left";
  }
}

function checkRightForPath(ghostNumber) {
  return stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[ghostNumber][0] &&
      col === stateVars.currentGhostCoor[ghostNumber][1] + 1
    );
  });
}

function checkRightGhostInNextCell(ghostNumber) {
  const pathCell =
    stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0]][
      stateVars.currentGhostCoor[ghostNumber][1] + 1
    ];
  if (pathCell) {
    return pathCell.some((item) => item.includes("ghost"));
  } else {
    return false;
  }
}

export function ghostRight(ghostNumber) {
  const checkRight =
    checkRightForPath(ghostNumber) && !checkRightGhostInNextCell(ghostNumber);

  if (checkRight) {
    stateVars.ghostDirection[ghostNumber] = "Right";
  }
}
// Randomly assign an available direction to the ghostDirection state variable for a particular ghost
export function setRandomGhostDirection(ghostNumber) {
  clearInterval(stateVars.ghostInterval[ghostNumber]);
  const dirArr = getAvailableDirectionsGhost(ghostNumber);

  const ranDir = dirArr[Math.floor(Math.random() * dirArr.length)];

  if (dirArr.length > 0) {
    ranDir(ghostNumber);
  } else {
    // If a dead end is reached by a ghost and there is another ghost blocking tne way, then the ghost waits for sometime in neutral position
    stateVars.ghostDirection[ghostNumber] = "Neutral";
    requestAnimationFrame(() => updateGhostAnimationDirection(ghostNumber));

    setTimeout(() => {
      setRandomGhostDirection(ghostNumber);
      setGhostSpeed(ghostNumber);
    }, stateVars.ghostNormalSpeed + 100);
  }
}

// getAvailableDirectionsGhost() is used to get the available path directions for a ghost
export function getAvailableDirectionsGhost(ghostNumber) {
  const dirArr = [];

  const checkUp =
    checkUpForPath(ghostNumber) && !checkUpGhostInNextCell(ghostNumber);

  if (checkUp) {
    dirArr.push(ghostUp);
  }

  const checkDown =
    checkDownForPath(ghostNumber) && !checkDownGhostInNextCell(ghostNumber);

  if (checkDown) {
    dirArr.push(ghostDown);
  }

  const checkLeft =
    checkLeftForPath(ghostNumber) && !checkLeftGhostInNextCell(ghostNumber);

  if (checkLeft) {
    dirArr.push(ghostLeft);
  }

  const checkRight =
    checkRightForPath(ghostNumber) && !checkRightGhostInNextCell(ghostNumber);

  if (checkRight) {
    dirArr.push(ghostRight);
  }

  return dirArr;
}
// generateGhostAtParticularPoint is used to generate a ghost a at particular coordinate point for debugging and testing
export function generateGhostAtParticularPoint(ghostNumber, x, y, direction) {
  clearInterval(stateVars.ghostInterval[ghostNumber]);
  removeGhostFromState(ghostNumber);
  removeGhostFromDOM(ghostNumber);
  stateVars.currentGhostCoor[ghostNumber][0] = x;
  stateVars.currentGhostCoor[ghostNumber][1] = y;
  stateVars.ghostDirection[ghostNumber] = direction;
  addGhostToState(ghostNumber);

  addGhostToBoardDOM(ghostNumber);
  requestAnimationFrame(() => updateGhostAnimationDirection(ghostNumber));
}
