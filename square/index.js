'use strict';

import Maze from './Maze';

const Canvas = require('canvas');
let canvas = new Canvas(1000, 1000);
let c = canvas.getContext('2d');

let maze = new Maze(c, 900, 30, 30, 6, 14, '#000', '#fff');

c.translate(50, 50);
maze.draw();

const fs = require('fs');
fs.writeFile('mazes/square.png', canvas.toBuffer(), () => {});
