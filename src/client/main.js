import './style.sass';
import './assets/favicon.png';

import Maze from 'shared/Maze';

let canvas = document.createElement('canvas');
canvas.width = 1000;
canvas.height = 1000;
document.body.append(canvas);
let c = canvas.getContext('2d');

let maze = new Maze({ c: c });

c.translate(50, 50);
maze.draw();
