const CANVAS_SIZE = [500, 500];
const SNAKE_START = [
  [8, 7],
  [8, 8]
];
const APPLE_START = [8, 3];
const SCALE = 40;
const SPEED = 120;
const DIRECTIONS = {
  38: [0, -1], //snake goes up
  40: [0, 1], //snake goes down
  37: [-1, 0], //snake goes left
  39: [1, 0] //snake goes right
};

export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
};