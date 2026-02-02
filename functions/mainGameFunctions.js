import * as docElems from "../globalVariables/docElems.js";
import stateVars from "../globalVariables/stateVars.js";
import * as pacmanLogic from "./pacmanLogic.js";
import * as ghosts from "./ghostsLogic.js";

// generation of HTML + CSS based main grid
export function createMainGrid() {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("rows");
  for (let j = 0; j < stateVars.gridsize; j++) {
    const colDiv = document.createElement("div");
    colDiv.classList.add("columns");
    colDiv.classList.add("cells");
    rowDiv.appendChild(colDiv);
  }

  for (let i = 0; i < stateVars.gridsize; i++) {
    const cloneRoWDiv = rowDiv.cloneNode(true);
    docElems.mainGridContainer.appendChild(cloneRoWDiv);
  }
}

// generation of js based false-only array for the grid size
export function generateFalseOnlyGrid() {
  stateVars.mainGridArray = [];
  for (let i = 0; i < stateVars.gridsize; i++) {
    let tempArr = [];
    for (let j = 0; j < stateVars.gridsize; j++) {
      tempArr.push(false);
    }
    stateVars.mainGridArray.push(tempArr);
  }
}

// function to reset js game states as well as grid DOM elements
export function resetBoard() {
  // Reset all the state to 'false'
  generateFalseOnlyGrid();
  stateVars.pathArray = [...stateVars.mainGridArray];
  // Reset all the class to initial state

  stateVars.gameOver = false;
  stateVars.poweredUp = false;
  clearInterval(stateVars.pacmanInterval);
  stateVars.ghostInterval.forEach((ghostInt) => clearInterval(ghostInt));

  stateVars.pacmanInterval = null;
  stateVars.ghostInterval = [];
  stateVars.currentGhostCoor = [];
  stateVars.currentPacmanCoor = [];
  stateVars.currentPowerUpCoor = [];
  stateVars.ghostHexedStates = [];
  docElems.mainGridContainer.innerHTML = "";
  docElems.bigGhostsDisplay.innerHTML = "";
  stateVars.score = 0;
  docElems.scoreValue.innerHTML = "0";
}

// The grid file contents in pathCoord should be in [[row#,col#],[...],...] format
export function populatePathStateArrayandDOM(pathCoord) {
  pathCoord.forEach((pathItem) => {
    stateVars.pathArray[pathItem[0]][pathItem[1]] = ["path"];
  });

  stateVars.pathArray.forEach((rowItem, rowIndex) => {
    rowItem.forEach((colItem, colIndex) => {
      if (colItem) {
        docElems.mainGridContainer.children[rowIndex].children[
          colIndex
        ].classList.add("pathCell");
      }
    });
  });
}

// populateGhostCageCoords() is used to specify the pathcells that are allocated for use as ghost cage cells
export function populateGhostCageCoords() {
  for (let i = 12; i < 13; i++) {
    for (let j = 10; j < 15; j++) {
      stateVars.ghostCageCoords.push([i, j]);
    }
  }

  stateVars.filteredpathCoord = stateVars.pathCoord.filter(([row, col]) => {
    return !stateVars.ghostCageCoords.some(([cageRow, cageCol]) => {
      return row === cageRow && col === cageCol;
    });
  });
}

export function handleGateLogic(rowNum, colNum) {
  docElems.mainGridContainer.children[rowNum].children[colNum].classList.add(
    "gateCell",
  );
  setTimeout(() => {
    docElems.mainGridContainer.children[rowNum].children[
      colNum
    ].classList.remove("gateCell");
    stateVars.pathCoord.push([rowNum, colNum]);
    stateVars.pathArray[rowNum][colNum] = ["path"];

    docElems.mainGridContainer.children[rowNum].children[colNum].classList.add(
      "pathCell",
    );
  }, 5000);
}

export function handleKeyPress(e) {
  e.preventDefault();
  clearInterval(stateVars.pacmanInterval);
  let pacmanSpeed = stateVars.poweredUp
    ? stateVars.pacmanPoweredUpSpeed
    : stateVars.pacmanSpeed;

  switch (e.key) {
    case "ArrowUp":
      stateVars.pacmanInterval = setInterval(pacmanLogic.pacmanUp, pacmanSpeed);

      break;
    case "ArrowDown":
      stateVars.pacmanInterval = setInterval(
        pacmanLogic.pacmanDown,
        pacmanSpeed,
      );

      break;
    case "ArrowLeft":
      stateVars.pacmanInterval = setInterval(
        pacmanLogic.pacmanLeft,
        pacmanSpeed,
      );

      break;
    case "ArrowRight":
      stateVars.pacmanInterval = setInterval(
        pacmanLogic.pacmanRight,
        pacmanSpeed,
      );

      break;
  }
}

export function handlePacmanMovementReStart() {
  switch (stateVars.pacmanDirection) {
    case "Up":
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      break;
    case "Down":
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" }),
      );
      break;
    case "Right":
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight" }),
      );
      break;
    case "Left":
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft" }),
      );
      break;
  }
}

export function handleGamePause() {
  stateVars.paused = true;
  stateVars.pacmanAudio?.source.stop();
  stateVars.pacmanAudio = null;
  clearInterval(stateVars.pacmanInterval);

  stateVars.ghostInterval.forEach((ghostInt) => {
    if (ghostInt !== null) {
      clearInterval(ghostInt);
    }
  });
}

export function handleGameUnPause() {
  stateVars.paused = false;
  stateVars.pacmanAudio = loadAudioThroughAudioContext(
    pacmanSoundBufferDecoded,
    { loop: true },
  );

  for (let i = 0; i < stateVars.noOfGhosts; i++) {
    ghosts.ghostPathFindingLogic(i);
  }
}

export async function playStartUpMusic() {
  docElems.startUpSound.play();
  await new Promise((r) => (docElems.startUpSound.onended = r));
}

const ctx = new AudioContext();

async function loadBuffer(url) {
  const response = await fetch(url);
  const rawBuffer = await response.arrayBuffer();
  return await ctx.decodeAudioData(rawBuffer);
}

export function loadAudioThroughAudioContext(
  bufferDecoded,
  { loop = false, volume = 1 } = {},
) {
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();

  source.buffer = bufferDecoded;
  source.loop = loop;

  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(ctx.destination);

  source.start();

  return { source, gain };
}

export const pacmanSoundBufferDecoded = await loadBuffer(
  new URL("../sounds/PAC-MAN_3s.wav", import.meta.url),
);

export const pacmanGameOverBufferDecoded = await loadBuffer(
  new URL("../sounds/Pacman_GameOver.mp3", import.meta.url),
);

export const pacmanLOSSoundBufferDecoded = await loadBuffer(
  new URL("../sounds/jump-and-fight.mp3", import.meta.url),
);

export const bonusSoundBufferDecoded = await loadBuffer(
  new URL("../sounds/getting-a-bonus.mp3", import.meta.url),
);

// export const startUpSoundBufferDecoded = await loadBuffer(
//   new URL("../sounds/pacman_beginning.wav", import.meta.url),
// );
