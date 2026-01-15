import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";

function addGhostToDOM() {
  const ghostSVG = docElems.ghostSVG.cloneNode(true);
  ghostSVG.classList.add("ghosts");

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
  docElems.mainGridContainer.children[stateVars.currentGhostCoor[0]].children[
    stateVars.currentGhostCoor[1]
  ].appendChild(ghostSVG);
}

function removeGhostFromDOM() {
  document.querySelector(".ghosts")?.remove();
}

// populateGhostinArrayandDOM() is for the initial placement of ghost in the board
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

  let randomCell =
    stateVars.pathArray[stateVars.currentGhostCoor[0]][
      stateVars.currentGhostCoor[1]
    ];

  randomCell.push("ghost");

  addGhostToDOM();
  randomGhostDirection();
}

// updateGhostArrayAndDOM() is used to move the ghost along the path cells available to it
function updateGhostArrayAndDOM(prevGhostArray) {
  // Remove ghost from state array using indexOf() and splice()
  const ghostInd =
    stateVars.pathArray[prevGhostArray[0]][prevGhostArray[1]].indexOf("ghost");
  if (ghostInd > -1) {
    stateVars.pathArray[prevGhostArray[0]][prevGhostArray[1]].splice(
      ghostInd,
      1
    );
  }

  // Remove ghost from DOM
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

    addGhostToDOM();
    const dirArr = getAvailableDirectionsGhost();
    switch (stateVars.ghostDirection) {
      case "Up":
        if (dirArr.includes(ghostRight) || dirArr.includes(ghostLeft)) {
          clearInterval(stateVars.ghostInterval);
          randomGhostDirection();
        } else if (!dirArr.includes(ghostUp)) {
          clearInterval(stateVars.ghostInterval);
          // There will be only one directon remaining - the opposite direction
          randomGhostDirection();
        }
        break;
      case "Down":
        if (dirArr.includes(ghostRight) || dirArr.includes(ghostLeft)) {
          clearInterval(stateVars.ghostInterval);
          randomGhostDirection();
        } else if (!dirArr.includes(ghostDown)) {
          clearInterval(stateVars.ghostInterval);
          // There will be only one directon remaining - the opposite direction
          randomGhostDirection();
        }
        break;
      case "Left":
        if (dirArr.includes(ghostUp) || dirArr.includes(ghostDown)) {
          clearInterval(stateVars.ghostInterval);
          randomGhostDirection();
        } else if (!dirArr.includes(ghostLeft)) {
          clearInterval(stateVars.ghostInterval);
          // There will be only one directon remaining - the opposite direction
          randomGhostDirection();
        }
        break;
      case "Right":
        if (dirArr.includes(ghostUp) || dirArr.includes(ghostDown)) {
          clearInterval(stateVars.ghostInterval);
          randomGhostDirection();
        } else if (!dirArr.includes(ghostRight)) {
          clearInterval(stateVars.ghostInterval);
          // There will be only one directon remaining - the opposite direction
          randomGhostDirection();
        }
        break;
    }
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

    updateGhostArrayAndDOM(stateVars.currentGhostCoor);
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

    updateGhostArrayAndDOM(stateVars.currentGhostCoor);
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

    updateGhostArrayAndDOM(stateVars.currentGhostCoor);
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

    updateGhostArrayAndDOM(stateVars.currentGhostCoor);
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
