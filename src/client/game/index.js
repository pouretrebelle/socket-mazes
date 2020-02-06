import Maze from 'shared/Maze';
const KEY_CODES = {
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  SPACE: 32,
};

const canvas = document.createElement('canvas');
const c = canvas.getContext('2d');

const maze = new Maze(c);

const updateMazeDimensions = () => {
  maze.updateDimensions({
    width: window.innerWidth,
    height: window.innerHeight,
    margin: 50,
  });
  maze.draw();
};

updateMazeDimensions();
window.addEventListener('resize', updateMazeDimensions);

window.addEventListener('keydown', (e) => {
  switch (event.keyCode) {
    case KEY_CODES.ARROW_UP:
      maze.path.travel(0);
      break;

    case KEY_CODES.ARROW_RIGHT:
      maze.path.travel(1);
      break;

    case KEY_CODES.ARROW_DOWN:
      maze.path.travel(2);
      break;

    case KEY_CODES.ARROW_LEFT:
      maze.path.travel(3);
      break;

    case KEY_CODES.SPACE:
      maze.regenerate();
      break;
  }
});

setInterval(() => {
  followPath();
}, 20);

let movesSinceChoice = 0;

const getRandomNextNeighbour = (pathSegment) => {
  const directions = [0, 1, 2, 3].filter(
    (i) =>
      !pathSegment.endUnit.edges[i].active &&
      pathSegment.endUnit.edges[i] !== false
  );
  const backwardsDirection =
    pathSegment.getBackwardsDirection && pathSegment.getBackwardsDirection();

  const availibleDirections = directions.filter(
    (d) => d !== backwardsDirection
  );

  // dead end?
  if (availibleDirections.length === 0) {
    return backwardsDirection;
  }

  return availibleDirections[
    Math.floor(Math.random() * availibleDirections.length)
  ];
};

const followPath = () => {
  // console.log(movesSinceChoice)
  const lastSegment = maze.path.last();

  const walls = lastSegment.endUnit.countWalls();
  const hasChoice = walls === 1;
  const deadEnd = walls === 3;

  if (hasChoice) movesSinceChoice = 0;

  // if (deadEnd) console.log('dead end')

  const next = getRandomNextNeighbour(lastSegment);
  maze.path.travel(next);

  movesSinceChoice++;
};

document.body.append(canvas);
