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

const findPath = setInterval(() => {
  followPath();
}, 100);

let movesSinceChoice = 0;

const getRandomNextNeighbour = (pathSegment) => {
  const nonWallDirections = [0, 1, 2, 3].filter(
    (d) =>
      !pathSegment.endUnit.edges[d].active &&
      pathSegment.endUnit.edges[d] !== false
  );
  const backwardsDirection =
    pathSegment.getBackwardsDirection && pathSegment.getBackwardsDirection();

  const forwardDirections = nonWallDirections.filter(
    (d) => d !== backwardsDirection
  );
  const unusedDirections = forwardDirections.filter(
    (d) => d !== !pathSegment.endUnit.usedDirections.includes(d)
  );

  let result =
    unusedDirections[Math.floor(Math.random() * unusedDirections.length)];

  if (unusedDirections.length === 0) {
    result = forwardDirections[0];
  }
  if (forwardDirections.length === 0) {
    result = backwardsDirection;
  }

  pathSegment.endUnit.usedDirections.push(result);

  return result;
};

const followPath = () => {
  if (maze.path.complete) return clearInterval(findPath);

  const lastSegment = maze.path.last();

  const walls = lastSegment.endUnit.countWalls();
  const hasChoice = walls === 1;
  const deadEnd = walls === 3;

  if (hasChoice) movesSinceChoice = 0;

  // if (deadEnd) console.log('dead end');

  const next = getRandomNextNeighbour(lastSegment);
  maze.path.travel(next);

  movesSinceChoice++;
};

document.body.append(canvas);
