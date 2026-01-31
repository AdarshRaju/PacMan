export default {
  // The gridsize is the number of cells in each direction (x and y) of the game board
  gridsize: 25,
  // pacmanSpeed is the speed at which pacman moves through the grid in ms
  pacmanSpeed: 100,
  // pacmanPoweredUpSpeed is the speed at which pacman moves through the grid in ms while powered up
  pacmanPoweredUpSpeed: 70,
  // pacmanPoweredUpTime is how long pac man is powered up in ms
  pacmanPoweredUpTime: 5000,
  // ghostNormalSpeed is the speed at which ghost moves through the grid when pacman is not in sight
  ghostNormalSpeed: 500,
  // ghostLOSSpeed is the speed at which ghost moves through the grid when pacman is in sight
  ghostLOSSpeed: 100,
  // noOfGhosts is the no of ghosts in the board
  noOfGhosts: 4,
  // mainGridArray will have initially have false only values in a gridsize*gridsize 2D nested array
  mainGridArray: [],
  // noOfPowerUps is the no of power ups that will be generated in the board
  noOfPowerUps: 3,
  // pathArray will have the ["path", "food", "pacman", "ghost#"] items added at the coordinates received for grid design
  pathArray: [],
  // pathCoord is the value of the path cells in [row#, col#] format
  pathCoord: [],
  // pacmanDirection is used to keep track of which direction pacman is facing
  pacmanDirection: "right",
  // ghostDirection is used to keep track of which direction ghost is facing
  ghostDirection: [],
  // currentPacmanCoor is used to keep track of pacman in [row#, col#] format in the board
  currentPacmanCoor: [],
  // currentGhostCoor is used to keep track of ghost in [row#, col#] format in the board
  currentGhostCoor: [],
  // currentPowerUpCoor is used to keep track of power ups in [row#, col#] format in the board
  currentPowerUpCoor: [],
  // score increases by 1 each time pacman eats a food
  score: 0,
  // highScore is tracked through a local file written to the disc
  highScore: 0,
  // gameOver state is reached by eating all the food or touching a ghost
  gameOver: true,
  // pacmanInterval is used for assigning a setInterval function to the movement of pacman along a straight path
  pacmanInterval: null,
  // ghostInterval is used for assigning a setInterval function to the movement of ghost along a straight path
  ghostInterval: [],
  // If pacman is in the general line of sight of ghost in ghost's direction of travel
  pacmanInSight: [],
  //pacmanAudio is used to deal with the main looping sound without gaps in between using web audio API
  pacmanAudio: null,
  // poweredUp state determines whether pacman is in the powered up state
  poweredUp: false,
  // pacmanPoweredUpSetTimeOut is used for storing a setTimeOut instance for when pacman gets a power up
  pacmanPoweredUpSetTimeOut: null,
  // ghostHexedStates is used to store the true or false values of whether ghosts are in the hexed state or not
  ghostHexedStates: [],
};
