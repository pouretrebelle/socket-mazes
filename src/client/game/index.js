import Maze from 'shared/Maze';

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

document.body.append(canvas);
