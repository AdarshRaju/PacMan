export const mainGridContainer = document.getElementById("mainGridContainer");
export const loadGridPattern = document.getElementById("loadGridPattern");
export const pathCells = document.getElementsByClassName("pathCell");
export const pacman = document.getElementsByClassName("pacman");
export const scoreValue = document.getElementById("scoreValue");
export const highScoreValue = document.getElementById("highScoreValue");
export const ghostSVG = document.getElementById("ghostSVG");
export const bigGhostsDisplay = document.getElementById("bigGhostsDisplay");
export function ghosts(ghostNumber) {
  return document.querySelectorAll(`.ghosts${ghostNumber}`);
}
