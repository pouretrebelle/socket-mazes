import Maze from 'shared/Maze';
const KEY_CODES = {
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
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
  }
});

document.body.append(canvas);
