import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";
import * as pacman from "./pacmanLogic.js";

function addGhostToState(ghostNumber) {
  let newGhostCell =
    stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0]][
      stateVars.currentGhostCoor[ghostNumber][1]
    ];

  newGhostCell.push(`ghost${ghostNumber}`);
}

function addGhostToBigDisplayDOM(ghostNumber) {
  const ghostSVGDisplay = docElems.ghostSVG.cloneNode(true);
  ghostSVGDisplay.classList.add(`ghosts${ghostNumber}`);
  ghostSVGDisplay.style.display = "block";
  switch (ghostNumber) {
    case 0:
      ghostSVGDisplay.style.fill = "orange";
      break;
    case 1:
      ghostSVGDisplay.style.fill = "green";
      break;
    case 2:
      ghostSVGDisplay.style.fill = "blue";
      break;
    case 3:
      ghostSVGDisplay.style.fill = "purple";
      break;
  }

  docElems.bigGhostsDisplay.appendChild(ghostSVGDisplay);
}

function addGhostToBoardDOM(ghostNumber) {
  const ghostSVGDisplay = docElems.ghostSVG.cloneNode(true);
  ghostSVGDisplay.classList.add(`ghosts${ghostNumber}`);
  ghostSVGDisplay.style.display = "block";
  switch (ghostNumber) {
    case 0:
      ghostSVGDisplay.style.fill = "orange";
      break;
    case 1:
      ghostSVGDisplay.style.fill = "green";
      break;
    case 2:
      ghostSVGDisplay.style.fill = "blue";
      break;
    case 3:
      ghostSVGDisplay.style.fill = "purple";
      break;
  }

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

function removeGhostFromState(ghostNumber) {
  const ghostInd = stateVars.pathArray[
    stateVars.currentGhostCoor[ghostNumber][0]
  ][stateVars.currentGhostCoor[ghostNumber][1]].indexOf(`ghost${ghostNumber}`);
  if (ghostInd > -1) {
    stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0]][
      stateVars.currentGhostCoor[ghostNumber][1]
    ].splice(ghostInd, 1);
  }
}

function removeGhostFromDOM(ghostNumber) {
  document.querySelector(`#ghostInBoard${ghostNumber}`).remove();
}

// updateGhostAnimationDirection changes the way the ghost's eyes are aligned (indicates movement direction)
function updateGhostAnimationDirection(ghostNumber) {
  switch (stateVars.ghostDirection[ghostNumber]) {
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
  // filteredArray returns only the coordinates not occupied by pacman or other ghosts
  let filteredArray = stateVars.pathCoord.filter(([row, col]) => {
    return !(
      (row === stateVars.currentPacmanCoor[0] &&
        col === stateVars.currentPacmanCoor[1]) ||
      stateVars.currentGhostCoor[ghostNumber]?.some(
        ([ghostNumRow, ghostNumCol]) => {
          return row === ghostNumRow && col === ghostNumCol;
        },
      )
    );
  });

  let randomIndex = Math.floor(Math.random() * filteredArray.length);
  stateVars.currentGhostCoor[ghostNumber] = filteredArray[randomIndex];

  addGhostToState(ghostNumber);

  addGhostToBigDisplayDOM(ghostNumber);
  addGhostToBoardDOM(ghostNumber);
  setRandomGhostDirection(ghostNumber);
  requestAnimationFrame(() => updateGhostArrayAndDOM(ghostNumber));
}

function setGhostSpeed(ghostNumber) {
  if (!stateVars.pacmanInSight[ghostNumber]) {
    stateVars.ghostInterval[ghostNumber] = setInterval(
      updateGhostArrayAndDOM,

      stateVars.ghostNormalSpeed,
      ghostNumber,
    );
  } else {
    stateVars.ghostInterval[ghostNumber] = setInterval(
      updateGhostArrayAndDOM,

      stateVars.ghostLOSSpeed,
      ghostNumber,
    );
  }
}
function ghostPathFindingLogic(ghostNumber) {
  clearInterval(stateVars.ghostInterval[ghostNumber]);
  const dirArr = getAvailableDirectionsGhost(ghostNumber);
  // The ghost will continue moving forward unless it hits a wall or finds an alternative path
  switch (stateVars.ghostDirection[ghostNumber]) {
    case "Up":
      if (
        (dirArr.includes(ghostRight) ||
          dirArr.includes(ghostLeft) ||
          !dirArr.includes(ghostUp)) &&
        !stateVars.pacmanInSight[ghostNumber]
      ) {
        setRandomGhostDirection(ghostNumber);

        stateVars.ghostInterval[ghostNumber] = setInterval(
          updateGhostArrayAndDOM,

          stateVars.ghostNormalSpeed,
          ghostNumber,
        );
      } else {
        ghostUp(ghostNumber);

        setGhostSpeed(ghostNumber);
      }

      break;
    case "Down":
      if (
        (dirArr.includes(ghostRight) ||
          dirArr.includes(ghostLeft) ||
          !dirArr.includes(ghostDown)) &&
        !stateVars.pacmanInSight[ghostNumber]
      ) {
        setRandomGhostDirection(ghostNumber);

        stateVars.ghostInterval[ghostNumber] = setInterval(
          updateGhostArrayAndDOM,

          stateVars.ghostNormalSpeed,
          ghostNumber,
        );
      } else {
        ghostDown(ghostNumber);

        setGhostSpeed(ghostNumber);
      }
      break;
    case "Left":
      if (
        (dirArr.includes(ghostUp) ||
          dirArr.includes(ghostDown) ||
          !dirArr.includes(ghostLeft)) &&
        !stateVars.pacmanInSight[ghostNumber]
      ) {
        setRandomGhostDirection(ghostNumber);

        stateVars.ghostInterval[ghostNumber] = setInterval(
          updateGhostArrayAndDOM,

          stateVars.ghostNormalSpeed,
          ghostNumber,
        );
      } else {
        ghostLeft(ghostNumber);

        setGhostSpeed(ghostNumber);
      }

      break;
    case "Right":
      if (
        (dirArr.includes(ghostUp) ||
          dirArr.includes(ghostDown) ||
          !dirArr.includes(ghostRight)) &&
        !stateVars.pacmanInSight[ghostNumber]
      ) {
        setRandomGhostDirection(ghostNumber);

        stateVars.ghostInterval[ghostNumber] = setInterval(
          updateGhostArrayAndDOM,

          stateVars.ghostNormalSpeed,
          ghostNumber,
        );
      } else {
        ghostRight(ghostNumber);

        setGhostSpeed(ghostNumber);
      }

      break;
  }
}

// If pacman is in the direct line of sight of a ghost, it will start moving faster
export function checkForGhostLineOfSight(ghostNumber) {
  if (
    stateVars.currentGhostCoor[ghostNumber][0] ===
    stateVars.currentPacmanCoor[0]
  ) {
    switch (stateVars.ghostDirection[ghostNumber]) {
      case "Right":
        if (
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
  if (!stateVars.gameOver) {
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
      stateVars.gameOver = true;
      clearInterval(stateVars.pacmanInterval);
      clearInterval(stateVars.ghostInterval[ghostNumber]);
      stateVars.currentGhostCoor[ghostNumber] = prevGhostCoor;
      pacman.removePacmanFromState();
      pacman.removePacmanFromDOM();
      stateVars.pathArray[stateVars.currentPacmanCoor[0]][
        stateVars.currentPacmanCoor[1]
      ].push("pacmanGameOver");
      pacman.addPacmanGameOverToDOM();
    }
    updatedGhostCell.push(`ghost${ghostNumber}`);

    addGhostToBoardDOM(ghostNumber);
    requestAnimationFrame(() => updateGhostAnimationDirection(ghostNumber));

    checkForGhostLineOfSight(ghostNumber);
    ghostPathFindingLogic(ghostNumber);
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
  // const checkUpForPath = stateVars.pathCoord.some(([row, col]) => {
  //   return (
  //     row === stateVars.currentGhostCoor[ghostNumber][0] - 1 &&
  //     col === stateVars.currentGhostCoor[ghostNumber][1]
  //   );
  // });

  // const checkUpGhostinNextCell = stateVars.pathArray[
  //   stateVars.currentGhostCoor[ghostNumber][0] - 1
  // ][stateVars.currentGhostCoor[ghostNumber][1]].some((item) =>
  //   item.includes("ghost"),
  // );

  // if (checkUpGhostinNextCell) {
  //   console.log(
  //     "stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0] - 1][stateVars.currentGhostCoor[ghostNumber][1]] returned is: ",
  //     stateVars.pathArray[stateVars.currentGhostCoor[ghostNumber][0] - 1][
  //       stateVars.currentGhostCoor[ghostNumber][1]
  //     ],
  //   );
  // }

  // const checkUp = checkUpForPath && !checkUpGhostinNextCell;
  // let checkUpForPath = checkUpForPath(ghostNumber);
  // let checkUpGhostinNextCell = checkUpGhostinNextCell(ghostNumber);

  const checkUp =
    checkUpForPath(ghostNumber) && !checkUpGhostInNextCell(ghostNumber);
  // if (checkUpForPath(ghostNumber) && !checkUpGhostInNextCell(ghostNumber)) {
  if (checkUp) {
    stateVars.ghostDirection[ghostNumber] = "Up";
  } else {
    // if (checkUpForPath && checkUpGhostinNextCell) {
    //   stateVars.ghostDirection[ghostNumber] = "Down";
    // }
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
  // const checkDownForPath = stateVars.pathCoord.some(([row, col]) => {
  //   return (
  //     row === stateVars.currentGhostCoor[ghostNumber][0] + 1 &&
  //     col === stateVars.currentGhostCoor[ghostNumber][1]
  //   );
  // });

  // const checkDownGhostInNextCell = stateVars.pathArray[
  //   stateVars.currentGhostCoor[ghostNumber][0] + 1
  // ][stateVars.currentGhostCoor[ghostNumber][1]].some((item) =>
  //   item.includes("ghost"),
  // );

  // const checkDown = checkDownForPath && !checkDownGhostInNextCell;
  const checkDown =
    checkDownForPath(ghostNumber) && !checkDownGhostInNextCell(ghostNumber);
  // if (checkDownForPath(ghostNumber) && !checkDownGhostInNextCell(ghostNumber)) {
  if (checkDown) {
    stateVars.ghostDirection[ghostNumber] = "Down";
  } else {
    // if (checkDownForPath && checkDownGhostInNextCell) {
    //   stateVars.ghostDirection[ghostNumber] = "Up";
    // }
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
  // const checkLeftForPath = stateVars.pathCoord.some(([row, col]) => {
  //   return (
  //     row === stateVars.currentGhostCoor[ghostNumber][0] &&
  //     col === stateVars.currentGhostCoor[ghostNumber][1] - 1
  //   );
  // });

  // const checkLeftGhostInNextCell = stateVars.pathArray[
  //   stateVars.currentGhostCoor[ghostNumber][0]
  // ][stateVars.currentGhostCoor[ghostNumber][1] - 1].some((item) =>
  //   item.includes("ghost"),
  // );

  // if (checkLeftForPath(ghostNumber) && checkLeftGhostInNextCell(ghostNumber)) {
  //   console.log("checkLeftGhostInNextCell passed");
  // }
  const checkLeft =
    checkLeftForPath(ghostNumber) && !checkLeftGhostInNextCell(ghostNumber);
  // const checkLeft = checkLeftForPath && !checkLeftGhostInNextCell;
  // if (checkLeftForPath(ghostNumber) && checkLeftGhostInNextCell(ghostNumber)) {
  if (checkLeft) {
    stateVars.ghostDirection[ghostNumber] = "Left";
  } else {
    // if (checkLeftForPath && checkLeftGhostInNextCell) {
    //   stateVars.ghostDirection[ghostNumber] = "Right";
    // }
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
  // const checkRightForPath = stateVars.pathCoord.some(([row, col]) => {
  //   return (
  //     row === stateVars.currentGhostCoor[ghostNumber][0] &&
  //     col === stateVars.currentGhostCoor[ghostNumber][1] + 1
  //   );
  // });

  // const checkRightGhostInNextCell = stateVars.pathArray[
  //   stateVars.currentGhostCoor[ghostNumber][0]
  // ][stateVars.currentGhostCoor[ghostNumber][1] + 1].some((item) =>
  //   item.includes("ghost"),
  // );
  const checkRight =
    checkRightForPath(ghostNumber) && !checkRightGhostInNextCell(ghostNumber);
  // if (checkRightGhostInNextCell) {
  //   console.log("checkRightGhostInNextCell passed");
  // }
  // const checkRight = checkRightForPath && !checkRightGhostInNextCell;
  if (
    checkRight
    // checkRightForPath(ghostNumber) &&
    // !checkRightGhostInNextCell(ghostNumber)
  ) {
    stateVars.ghostDirection[ghostNumber] = "Right";
  } else {
    // if (checkRightForPath && checkRightGhostInNextCell) {
    //   stateVars.ghostDirection[ghostNumber] = "Left";
    // }
  }
}
// Randomly assign an available direction to the ghostDirection state variable for a particular ghost
export function setRandomGhostDirection(ghostNumber) {
  clearInterval(stateVars.ghostInterval[ghostNumber]);
  const dirArr = getAvailableDirectionsGhost(ghostNumber);
  // console.log("dirArr from setRandomDir is: ", dirArr);
  const ranDir = dirArr[Math.floor(Math.random() * dirArr.length)];

  ranDir(ghostNumber);
}

// getAvailableDirectionsGhost() is used to get the available path directions for a ghost
export function getAvailableDirectionsGhost(ghostNumber) {
  const dirArr = [];
  // const checkUp = stateVars.pathCoord.some(([row, col]) => {
  //   return (
  //     row === stateVars.currentGhostCoor[ghostNumber][0] - 1 &&
  //     col === stateVars.currentGhostCoor[ghostNumber][1]
  //   );
  // });

  const checkUp =
    checkUpForPath(ghostNumber) && !checkUpGhostInNextCell(ghostNumber);
  // checkUpForPath(ghostNumber) && !checkUpGhostInNextCell(ghostNumber);

  if (checkUp) {
    dirArr.push(ghostUp);
  }

  // const checkDown = stateVars.pathCoord.some(([row, col]) => {
  //   return (
  //     row === stateVars.currentGhostCoor[ghostNumber][0] + 1 &&
  //     col === stateVars.currentGhostCoor[ghostNumber][1]
  //   );
  // });

  const checkDown =
    checkDownForPath(ghostNumber) && !checkDownGhostInNextCell(ghostNumber);
  // checkDownForPath(ghostNumber) && !checkDownGhostInNextCell(ghostNumber);
  if (checkDown) {
    dirArr.push(ghostDown);
  }

  // const checkLeft = stateVars.pathCoord.some(([row, col]) => {
  //   return (
  //     row === stateVars.currentGhostCoor[ghostNumber][0] &&
  //     col === stateVars.currentGhostCoor[ghostNumber][1] - 1
  //   );
  // });
  const checkLeft =
    checkLeftForPath(ghostNumber) && !checkLeftGhostInNextCell(ghostNumber);
  // checkLeftForPath(ghostNumber) && !checkLeftGhostInNextCell(ghostNumber);
  if (checkLeft) {
    dirArr.push(ghostLeft);
  }

  // const checkRight = stateVars.pathCoord.some(([row, col]) => {
  //   return (
  //     row === stateVars.currentGhostCoor[ghostNumber][0] &&
  //     col === stateVars.currentGhostCoor[ghostNumber][1] + 1
  //   );
  // });

  const checkRight =
    checkRightForPath(ghostNumber) && !checkRightGhostInNextCell(ghostNumber);
  // checkRightForPath(ghostNumber) && !checkRightGhostInNextCell(ghostNumber);
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

  // Comment out the line below to have the ghost freeze at a particular coordinate point
  // updateGhostArrayAndDOM(ghostNumber);
}
