import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";

function addPacmanToDOM() {
  const pacmanDiv = document.createElement("div");
  // const pacmanDiv = docElems.ghostSVG.cloneNode(true);
  // pacmanDiv.style.display = "block";
  // pacmanDiv.style.fill = "red";
  pacmanDiv.classList.add("pacman");
  // console.log("current pacman coord is: ", stateVars.currentPacmanCoor);
  docElems.mainGridContainer.children[stateVars.currentPacmanCoor[0]].children[
    stateVars.currentPacmanCoor[1]
  ].appendChild(pacmanDiv);
}

function removePacmanFromDOM() {
  document.querySelector(".pacman")?.remove();
}

export function populatePacmaninArrayandDOM() {
  // console.log(
  //   "stateVars.pathCoord before adding pacman is:",
  //   stateVars.pathCoord
  // );
  const randomIndex = Math.floor(Math.random() * stateVars.pathCoord.length);
  // console.log("randomIndex generated is: ", randomIndex);
  stateVars.currentPacmanCoor = stateVars.pathCoord[randomIndex];

  let randomCell =
    stateVars.pathArray[stateVars.currentPacmanCoor[0]][
      stateVars.currentPacmanCoor[1]
    ];
  // console.log(
  //   "stateVars.currentPacmanCoor returned is: ",
  //   stateVars.currentPacmanCoor
  // );
  randomCell.push("pacman");
  // console.log(
  //   "stateVars.pathArray after pacman is added is: ",
  //   stateVars.pathArray
  // );

  addPacmanToDOM();
}

function updatePacmanArrayAndDOM(prevPacmanArray) {
  // Remove pacman from state array and DOM
  const pacInd =
    stateVars.pathArray[prevPacmanArray[0]][prevPacmanArray[1]].indexOf(
      "pacman"
    );
  if (pacInd > -1) {
    stateVars.pathArray[prevPacmanArray[0]][prevPacmanArray[1]].splice(
      pacInd,
      1
    );
  }

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

  // console.log("currentPacmanCoor is: ", stateVars.currentPacmanCoor);
  // console.log(
  //   "currentPacmanCoor[0] - 1 is: ",
  //   stateVars.currentPacmanCoor[0] - 1
  // );
  // console.log("checkUp value returned is: ", checkUp);
  if (checkUp) {
    // const prevPacmanDirection = stateVars.pacmanDirection;
    stateVars.pacmanDirection = "Up";
    // if (prevPacmanDirection === stateVars.pacmanDirection) {
    //   stateVars.dirAlreadySet = true;
    // } else {
    //   stateVars.dirAlreadySet = false;
    // }

    // console.log("Up check passed");
    updatePacmanArrayAndDOM(stateVars.currentPacmanCoor);
    // if (!stateVars.dirAlreadySet) {
    docElems.pacman[0].style.animationName = "pacman-up";
    // }
  } else {
    // console.log("Up check failed");
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

    // console.log("Down check passed");
    updatePacmanArrayAndDOM(stateVars.currentPacmanCoor);
    docElems.pacman[0].style.animationName = "pacman-down";
  } else {
    // console.log("Down check failed");
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

    // console.log("Left check passed");
    updatePacmanArrayAndDOM(stateVars.currentPacmanCoor);
    docElems.pacman[0].style.animationName = "pacman-left";
  } else {
    // console.log("Left check failed");
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

    // console.log("Right check passed");
    updatePacmanArrayAndDOM(stateVars.currentPacmanCoor);
    docElems.pacman[0].style.animationName = "pacman-right";
  } else {
    // console.log("Right check failed");
  }
}
