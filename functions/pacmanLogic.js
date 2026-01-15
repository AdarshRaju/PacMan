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

function removePacmanFromState() {
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

function removePacmanFromDOM() {
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
  removePacmanFromState();

  removePacmanFromDOM();

  // Set the new pacman coordinate based on direction
  switch (stateVars.pacmanDirection) {
    case "Up":
      stateVars.currentPacmanCoor = [
        stateVars.currentPacmanCoor[0] - 1,
        stateVars.currentPacmanCoor[1],
      ];
      break;
    case "Down":
      stateVars.currentPacmanCoor = [
        stateVars.currentPacmanCoor[0] + 1,
        stateVars.currentPacmanCoor[1],
      ];
      break;
    case "Left":
      stateVars.currentPacmanCoor = [
        stateVars.currentPacmanCoor[0],
        stateVars.currentPacmanCoor[1] - 1,
      ];
      break;
    case "Right":
      stateVars.currentPacmanCoor = [
        stateVars.currentPacmanCoor[0],
        stateVars.currentPacmanCoor[1] + 1,
      ];
      break;
  }

  let updatedPacmanCell =
    stateVars.pathArray[stateVars.currentPacmanCoor[0]][
      stateVars.currentPacmanCoor[1]
    ];
  // If food is in the new cell without a ghost, remove 'food' from state array and DOM and update score
  if (!stateVars.gameOver) {
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

export function pacmanUp() {
  const checkUp = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentPacmanCoor[0] - 1 &&
      col === stateVars.currentPacmanCoor[1]
    );
  });

  if (checkUp) {
    stateVars.pacmanDirection = "Up";

    updatePacmanArrayAndDOM();

    docElems.pacman[0].style.animationName = "pacman-up";
  } else {
  }
}

export function pacmanDown() {
  const checkDown = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentPacmanCoor[0] + 1 &&
      col === stateVars.currentPacmanCoor[1]
    );
  });

  if (checkDown) {
    stateVars.pacmanDirection = "Down";

    updatePacmanArrayAndDOM();
    docElems.pacman[0].style.animationName = "pacman-down";
  } else {
  }
}

export function pacmanLeft() {
  const checkLeft = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentPacmanCoor[0] &&
      col === stateVars.currentPacmanCoor[1] - 1
    );
  });

  if (checkLeft) {
    stateVars.pacmanDirection = "Left";

    updatePacmanArrayAndDOM();
    docElems.pacman[0].style.animationName = "pacman-left";
  } else {
  }
}

export function pacmanRight() {
  const checkRight = stateVars.pathCoord.some(([row, col]) => {
    return (
      row === stateVars.currentPacmanCoor[0] &&
      col === stateVars.currentPacmanCoor[1] + 1
    );
  });

  if (checkRight) {
    stateVars.pacmanDirection = "Right";

    updatePacmanArrayAndDOM();
    docElems.pacman[0].style.animationName = "pacman-right";
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
