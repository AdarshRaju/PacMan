export default {
  // The gridsize is the number of cells in each direction (x and y) of the game board
  gridsize: 25,
  // mainGridArray will have false only values in a gridsize*gridsize 2D nested array
  mainGridArray: [],
  // pathArray will have the ["path"] item added at the coordinates received for grid design
  pathArray: [],
  // pathCoord is the value of the path cells in [row#, col#] format
  pathCoord: [],
  // pacmanDirection is used to keep track of which direction pacman is facing
  pacmanDirection: "right",
  // ghostDirection is used to keep track of which direction ghost is facing
  ghostDirection: "right",
  // currentPacmanCoor is used to keep track of pacman in [row#, col#] format in the board
  currentPacmanCoor: [],
  // currentGhostCoor is used to keep track of ghost in [row#, col#] format in the board
  currentGhostCoor: [],
  // score increases by 1 each time pacman eats a food
  score: 0,
  // gameOver state is reached by eating all the food or touching a ghost
  gameOver: true,
  // pacmanInterval is the speed of movement of pacman along a straight path
  pacmanInterval: null,
  // ghostInterval is the speed of movement of ghost along a straight path
  ghostInterval: null,
  // If pacman is lin the general line of sight of ghost in ghost's direction of travel
  pacmanInSight: false,
};
