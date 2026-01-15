import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";

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
      docElems.pathCells[0].getBoundingClientRect().width * 0.88
    );
  docElems.pathCells[0] &&
    ghostSVG.setAttribute(
      "height",
      docElems.pathCells[0].getBoundingClientRect().height * 0.88
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
  randomGhostDirection();
}

function ghostPathFindingLogic() {
  const dirArr = getAvailableDirectionsGhost();
  // The ghost will continue moving forward unless it hits a wall or finds an alternative path
  switch (stateVars.ghostDirection) {
    case "Up":
      if (
        dirArr.includes(ghostRight) ||
        dirArr.includes(ghostLeft) ||
        !dirArr.includes(ghostUp)
      ) {
        clearInterval(stateVars.ghostInterval);
        randomGhostDirection();
      }

      break;
    case "Down":
      if (
        dirArr.includes(ghostRight) ||
        dirArr.includes(ghostLeft) ||
        !dirArr.includes(ghostDown)
      ) {
        clearInterval(stateVars.ghostInterval);
        randomGhostDirection();
      }

      break;
    case "Left":
      if (
        dirArr.includes(ghostUp) ||
        dirArr.includes(ghostDown) ||
        !dirArr.includes(ghostLeft)
      ) {
        clearInterval(stateVars.ghostInterval);
        randomGhostDirection();
      }

      break;
    case "Right":
      if (
        dirArr.includes(ghostUp) ||
        dirArr.includes(ghostDown) ||
        !dirArr.includes(ghostRight)
      ) {
        clearInterval(stateVars.ghostInterval);
        randomGhostDirection();
      }

      break;
  }
}

// updateGhostArrayAndDOM() is used to move the ghost along the path cells available to it
function updateGhostArrayAndDOM() {
  removeGhostFromState();

  removeGhostFromDOM();

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
  // If food is in the new cell without a ghost, remove 'food' from state array and DOM and update score
  if (!stateVars.gameOver) {
    updatedGhostCell.push("ghost");
    updateGhostAnimationDirection();
    addGhostToDOM();

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

    updateGhostArrayAndDOM();
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

    updateGhostArrayAndDOM();
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

    updateGhostArrayAndDOM();
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

    updateGhostArrayAndDOM();
  } else {
  }
}
// Randomly assign an available direction for the ghost to move in a fixed interval
export function randomGhostDirection() {
  clearInterval(stateVars.ghostInterval);
  const dirArr = getAvailableDirectionsGhost();
  const ranDir = dirArr[Math.floor(Math.random() * dirArr.length)];
  stateVars.ghostInterval = setInterval(ranDir, 100);
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
