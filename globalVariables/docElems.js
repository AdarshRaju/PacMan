export const mainGridContainer = document.getElementById("mainGridContainer");
export const scoresContainer = document.getElementById("scoresContainer");
export const loadGridPattern = document.getElementById("loadGridPattern");
export const pathCells = document.getElementsByClassName("pathCell");
export const pacman = document.getElementsByClassName("pacman");
export const scoreValue = document.getElementById("scoreValue");
export const highScoreValue = document.getElementById("highScoreValue");
export const ghostSVG = document.getElementById("ghostSVG");
export const bigGhostsDisplay = document.getElementById("bigGhostsDisplay");
export const foodCells = document.getElementsByClassName("food");
export const powerUpCells = document.getElementsByClassName("powerUp");
export function ghosts(ghostNumber) {
  return document.querySelectorAll(`.ghosts${ghostNumber}`);
  // return document.getElementsByClassName(`ghosts${ghostNumber}`);
}
export const pacmanLOSSound = new Audio(
  new URL("../sounds/jump-and-fight.mp3", import.meta.url),
);
export const ghostSwallowSound = new Audio(
  new URL("../sounds/getting-a-bonus.mp3", import.meta.url),
);
export const newHighScoreSound = new Audio(
  new URL("../sounds/newHighScore.mp3", import.meta.url),
);
export const allFoodFinishedSound = new Audio(
  new URL("../sounds/allFood-achievement-bell-600.wav", import.meta.url),
);

export const startUpSound = new Audio(
  new URL("../sounds/pacman_beginning.wav", import.meta.url),
);
