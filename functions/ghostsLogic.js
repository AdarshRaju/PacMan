import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";
import * as pacman from "./pacmanLogic.js";

function addGhostToState() {
  let newGhostCell =
    stateVars.pathArray[stateVars.currentGhostCoor[0]][
      stateVars.currentGhostCoor[1]
    ];

  newGhostCell.push("ghost");
}

function addGhostToDOM() {
  const ghostSVG = docElems.ghostSVG.cloneNode(true);

  docElems.pathCells[0] &&
    ghostSVG.setAttribute(
      "width",
      docElems.pathCells[0].getBoundingClientRect().width * 0.88,
    );
  docElems.pathCells[0] &&
    ghostSVG.setAttribute(
      "height",
      docElems.pathCells[0].getBoundingClientRect().height * 0.88,
    );
  ghostSVG.style.display = "block";
  ghostSVG.style.fill = "orange";
  ghostSVG.id = "ghostInBoard";
  docElems.mainGridContainer.children[stateVars.currentGhostCoor[0]].children[
    stateVars.currentGhostCoor[1]
  ].appendChild(ghostSVG);
}

function removeGhostFromState() {
  const ghostInd =
    stateVars.pathArray[stateVars.currentGhostCoor[0]][
      stateVars.currentGhostCoor[1]
    ].indexOf("ghost");
  if (ghostInd > -1) {
    stateVars.pathArray[stateVars.currentGhostCoor[0]][
      stateVars.currentGhostCoor[1]
    ].splice(ghostInd, 1);
  }
}

function removeGhostFromDOM() {
  document.querySelector(".ghosts")?.remove();
}

// updateGhostAnimationDirection changes the way the ghost's eyes are aligned (indicates movement direction)
function updateGhostAnimationDirection() {
  switch (stateVars.ghostDirection) {
    case "Up":
      [...docElems.ghosts].forEach((ghost) => {
        ghost.querySelectorAll(".eyesInner")[0].setAttribute("cx", 35);
        ghost.querySelectorAll(".eyesInner")[0].setAttribute("cy", 28);
        ghost.querySelectorAll(".eyesInner")[1].setAttribute("cx", 65);
        ghost.querySelectorAll(".eyesInner")[1].setAttribute("cy", 28);
      });
      break;
    case "Down":
      [...docElems.ghosts].forEach((ghost) => {
        ghost.querySelectorAll(".eyesInner")[0].setAttribute("cx", 35);
        ghost.querySelectorAll(".eyesInner")[0].setAttribute("cy", 32);
        ghost.querySelectorAll(".eyesInner")[1].setAttribute("cx", 65);
        ghost.querySelectorAll(".eyesInner")[1].setAttribute("cy", 32);
      });
      break;
    case "Left":
      [...docElems.ghosts].forEach((ghost) => {
        ghost.querySelectorAll(".eyesInner")[0].setAttribute("cx", 33);
        ghost.querySelectorAll(".eyesInner")[0].setAttribute("cy", 30);
        ghost.querySelectorAll(".eyesInner")[1].setAttribute("cx", 63);
        ghost.querySelectorAll(".eyesInner")[1].setAttribute("cy", 30);
      });
      break;
    case "Right":
      [...docElems.ghosts].forEach((ghost) => {
        ghost.querySelectorAll(".eyesInner")[0].setAttribute("cx", 37);
        ghost.querySelectorAll(".eyesInner")[0].setAttribute("cy", 30);
        ghost.querySelectorAll(".eyesInner")[1].setAttribute("cx", 67);
        ghost.querySelectorAll(".eyesInner")[1].setAttribute("cy", 30);
      });
      break;
  }
  [...docElems.ghosts];
}

// populateGhostinArrayandDOM() is for the initial placement of ghost in a random path cell in the board
export function populateGhostinArrayandDOM() {
  let randomIndex = Math.floor(Math.random() * stateVars.pathCoord.length);

  // reassign randomIndex if pacman is already in the path cell
  while (
    stateVars.pathCoord[randomIndex].toString() ===
    stateVars.currentPacmanCoor.toString()
  ) {
    randomIndex = Math.floor(Math.random() * stateVars.pathCoord.length);
  }
  stateVars.currentGhostCoor = stateVars.pathCoord[randomIndex];

  addGhostToState();
  addGhostToDOM();
  setRandomGhostDirection();
  updateGhostArrayAndDOM();
  // ghostPathFindingLogic();
}

function setGhostSpeed() {
  if (!stateVars.pacmanInSight) {
    stateVars.ghostInterval = setInterval(
      updateGhostArrayAndDOM,
      stateVars.ghostNormalSpeed,
    );
  } else {
    stateVars.ghostInterval = setInterval(
      updateGhostArrayAndDOM,
      stateVars.ghostLOSSpeed,
    );
  }
}
function ghostPathFindingLogic() {
  clearInterval(stateVars.ghostInterval);
  const dirArr = getAvailableDirectionsGhost();
  // The ghost will continue moving forward unless it hits a wall or finds an alternative path
  switch (stateVars.ghostDirection) {
    case "Up":
      if (
        (dirArr.includes(ghostRight) ||
          dirArr.includes(ghostLeft) ||
          !dirArr.includes(ghostUp)) &&
        !stateVars.pacmanInSight
      ) {
        setRandomGhostDirection();
        stateVars.ghostInterval = setInterval(
          updateGhostArrayAndDOM,
          stateVars.ghostNormalSpeed,
        );
      } else {
        ghostUp();

        setGhostSpeed();
      }

      break;
    case "Down":
      if (
        (dirArr.includes(ghostRight) ||
          dirArr.includes(ghostLeft) ||
          !dirArr.includes(ghostDown)) &&
        !stateVars.pacmanInSight
      ) {
        setRandomGhostDirection();
        stateVars.ghostInterval = setInterval(
          updateGhostArrayAndDOM,
          stateVars.ghostNormalSpeed,
        );
      } else {
        ghostDown();

        setGhostSpeed();
      }
      break;
    case "Left":
      if (
        (dirArr.includes(ghostUp) ||
          dirArr.includes(ghostDown) ||
          !dirArr.includes(ghostLeft)) &&
        !stateVars.pacmanInSight
      ) {
        setRandomGhostDirection();
        stateVars.ghostInterval = setInterval(
          updateGhostArrayAndDOM,
          stateVars.ghostNormalSpeed,
        );
      } else {
        ghostLeft();

        setGhostSpeed();
      }

      break;
    case "Right":
      if (
        (dirArr.includes(ghostUp) ||
          dirArr.includes(ghostDown) ||
          !dirArr.includes(ghostRight)) &&
        !stateVars.pacmanInSight
      ) {
        setRandomGhostDirection();
        stateVars.ghostInterval = setInterval(
          updateGhostArrayAndDOM,
          stateVars.ghostNormalSpeed,
        );
      } else {
        ghostRight();

        setGhostSpeed();
      }

      break;
  }
}

// If pacman is in the direct line of sight of a ghost, it will start moving faster
export function checkForGhostLineOfSight() {
  if (stateVars.currentGhostCoor[0] === stateVars.currentPacmanCoor[0]) {
    switch (stateVars.ghostDirection) {
      case "Right":
        if (stateVars.currentGhostCoor[1] < stateVars.currentPacmanCoor[1]) {
          let localCellCount = 0;
          for (
            let i = stateVars.currentGhostCoor[1];
            i < stateVars.currentPacmanCoor[1];
            i++
          ) {
            if (
              stateVars.pathCoord.some(([row, col]) => {
                return row === stateVars.currentGhostCoor[0] && col === i;
              })
            ) {
              localCellCount += 1;
            }
          }
          console.log("localCellCount returned is: ", localCellCount);
          if (
            localCellCount ===
            parseInt(stateVars.currentPacmanCoor[1]) -
              parseInt(stateVars.currentGhostCoor[1])
          ) {
            console.log("LOS right true condition was activated");
            stateVars.pacmanInSight = true;
          }
        } else {
          console.log("LOS right false condition was activated");
          stateVars.pacmanInSight = false;
        }
        break;
      case "Left":
        if (stateVars.currentGhostCoor[1] > stateVars.currentPacmanCoor[1]) {
          let localCellCount = 0;
          for (
            let i = stateVars.currentGhostCoor[1];
            i > stateVars.currentPacmanCoor[1];
            i--
          ) {
            if (
              stateVars.pathCoord.some(([row, col]) => {
                return row === stateVars.currentGhostCoor[0] && col === i;
              })
            ) {
              localCellCount += 1;
            }
          }

          if (
            localCellCount ===
            stateVars.currentGhostCoor[1] - stateVars.currentPacmanCoor[1]
          ) {
            console.log("LOS left true condition was activated");
            stateVars.pacmanInSight = true;
          }
        } else {
          console.log("LOS left false condition was activated");
          stateVars.pacmanInSight = false;
        }
        break;
      case "Up":
        stateVars.pacmanInSight = false;
        break;
      case "Down":
        stateVars.pacmanInSight = false;
        break;
    }
  } else if (stateVars.currentGhostCoor[1] === stateVars.currentPacmanCoor[1]) {
    switch (stateVars.ghostDirection) {
      case "Up":
        if (stateVars.currentGhostCoor[0] > stateVars.currentPacmanCoor[0]) {
          let localCellCount = 0;
          for (
            let i = stateVars.currentGhostCoor[0];
            i > stateVars.currentPacmanCoor[0];
            i--
          ) {
            if (
              stateVars.pathCoord.some(([row, col]) => {
                return row === i && col === stateVars.currentGhostCoor[1];
              })
            ) {
              localCellCount += 1;
            }
          }
          console.log("localCellCount returned for UP is: ", localCellCount);
          if (
            localCellCount ===
            stateVars.currentGhostCoor[0] - stateVars.currentPacmanCoor[0]
          ) {
            console.log("LOS up true condition was activated");
            stateVars.pacmanInSight = true;
          }
        } else {
          console.log("LOS up false condition was activated");
          stateVars.pacmanInSight = false;
        }
        break;
      case "Down":
        if (stateVars.currentGhostCoor[0] < stateVars.currentPacmanCoor[0]) {
          let localCellCount = 0;
          for (
            let i = stateVars.currentGhostCoor[0];
            i < stateVars.currentPacmanCoor[0];
            i++
          ) {
            if (
              stateVars.pathCoord.some(([row, col]) => {
                return row === i && col === stateVars.currentGhostCoor[1];
              })
            ) {
              localCellCount += 1;
            }
          }
          if (
            localCellCount ===
            stateVars.currentPacmanCoor[0] - stateVars.currentGhostCoor[0]
          ) {
            console.log("LOS down true condition was activated");
            stateVars.pacmanInSight = true;
            console.log(
              "pacmanInSight just after activation is: ",
              stateVars.pacmanInSight,
            );
          }
        } else {
          console.log("LOS down false condition was activated");
          stateVars.pacmanInSight = false;
        }
        break;
      case "Right":
        stateVars.pacmanInSight = false;
        break;
      case "Left":
        stateVars.pacmanInSight = false;
        break;
    }
  } else {
    stateVars.pacmanInSight = false;
  }
}

// updateGhostArrayAndDOM() is used to move the ghost along the path cells available to it
function updateGhostArrayAndDOM() {
  if (!stateVars.gameOver) {
    removeGhostFromState();

    removeGhostFromDOM();

    let prevGhostCoor = [...stateVars.currentGhostCoor];

    // Set the new ghost coordinate based on direction
    switch (stateVars.ghostDirection) {
      case "Up":
        stateVars.currentGhostCoor = [
          stateVars.currentGhostCoor[0] - 1,
          stateVars.currentGhostCoor[1],
        ];
        break;
      case "Down":
        stateVars.currentGhostCoor = [
          stateVars.currentGhostCoor[0] + 1,
          stateVars.currentGhostCoor[1],
        ];
        break;
      case "Left":
        stateVars.currentGhostCoor = [
          stateVars.currentGhostCoor[0],
          stateVars.currentGhostCoor[1] - 1,
        ];
        break;
      case "Right":
        stateVars.currentGhostCoor = [
          stateVars.currentGhostCoor[0],
          stateVars.currentGhostCoor[1] + 1,
        ];
        break;
    }

    let updatedGhostCell =
      stateVars.pathArray[stateVars.currentGhostCoor[0]][
        stateVars.currentGhostCoor[1]
      ];
    if (updatedGhostCell.includes("pacman")) {
      stateVars.gameOver = true;
      clearInterval(stateVars.pacmanInterval);
      clearInterval(stateVars.ghostInterval);
      stateVars.currentGhostCoor = prevGhostCoor;
      pacman.removePacmanFromState();
      pacman.removePacmanFromDOM();
      stateVars.pathArray[stateVars.currentPacmanCoor[0]][
        stateVars.currentPacmanCoor[1]
      ].push("pacmanGameOver");
      pacman.addPacmanGameOverToDOM();
    }
    updatedGhostCell.push("ghost");
    updateGhostAnimationDirection();
    addGhostToDOM();
    checkForGhostLineOfSight();
    ghostPathFindingLogic();
  }
}

export function ghostUp() {
  const checkUp = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[0] - 1 &&
      col === stateVars.currentGhostCoor[1]
    );
  });

  if (checkUp) {
    stateVars.ghostDirection = "Up";

    // updateGhostArrayAndDOM();
  } else {
  }
}

export function ghostDown() {
  const checkDown = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[0] + 1 &&
      col === stateVars.currentGhostCoor[1]
    );
  });

  if (checkDown) {
    stateVars.ghostDirection = "Down";

    // updateGhostArrayAndDOM();
  } else {
  }
}

export function ghostLeft() {
  const checkLeft = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[0] &&
      col === stateVars.currentGhostCoor[1] - 1
    );
  });

  if (checkLeft) {
    stateVars.ghostDirection = "Left";

    // updateGhostArrayAndDOM();
  } else {
  }
}

export function ghostRight() {
  const checkRight = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[0] &&
      col === stateVars.currentGhostCoor[1] + 1
    );
  });

  if (checkRight) {
    stateVars.ghostDirection = "Right";

    // updateGhostArrayAndDOM();
  } else {
  }
}
// Randomly assign an available direction for the ghost to move in a fixed interval
export function setRandomGhostDirection() {
  clearInterval(stateVars.ghostInterval);
  const dirArr = getAvailableDirectionsGhost();
  const ranDir = dirArr[Math.floor(Math.random() * dirArr.length)];
  // if (stateVars.pacmanInSight) {
  //   stateVars.ghostInterval = setInterval(ranDir, 100);
  // } else {
  //   stateVars.ghostInterval = setInterval(ranDir, 500);
  // }
  ranDir();
}

export function getAvailableDirectionsGhost() {
  const dirArr = [];
  const checkUp = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[0] - 1 &&
      col === stateVars.currentGhostCoor[1]
    );
  });

  if (checkUp) {
    dirArr.push(ghostUp);
  }

  const checkDown = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[0] + 1 &&
      col === stateVars.currentGhostCoor[1]
    );
  });
  if (checkDown) {
    dirArr.push(ghostDown);
  }

  const checkLeft = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[0] &&
      col === stateVars.currentGhostCoor[1] - 1
    );
  });
  if (checkLeft) {
    dirArr.push(ghostLeft);
  }

  const checkRight = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentGhostCoor[0] &&
      col === stateVars.currentGhostCoor[1] + 1
    );
  });
  if (checkRight) {
    dirArr.push(ghostRight);
  }

  return dirArr;
}

export function generateGhostAtParticularPoint(x, y, direction) {
  clearInterval(stateVars.ghostInterval);
  removeGhostFromState();
  removeGhostFromDOM();
  stateVars.currentGhostCoor[0] = x;
  stateVars.currentGhostCoor[1] = y;
  stateVars.ghostDirection = direction;
  addGhostToState();
  addGhostToDOM();
  updateGhostAnimationDirection();
}
