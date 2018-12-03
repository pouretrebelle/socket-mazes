import MazePathSegment from './MazePathSegment';

class MazePath {
  constructor(maze) {
    this.maze = maze;
    this.complete = false;
    this.pathColor = '#6f767b';
    this.originalPathColor = this.pathColor;
    this.segments = [];

    this.addToPath(0, this.maze.entranceY);
  }

  addToPath(x, y, color = this.pathColor) {
    this.active = false;

    let next = this.maze.units[x][y];
    let segment = new MazePathSegment(this.last(), next, color, this.maze);
    this.segments.push(segment);

    // if it's the first addition, change the path color
    if (this.segments.length == 2) {
      this.pathColor = this.segments[1].color;
    }
  }

  last() {
    // if there are segments
    if (this.segments.length > 0) {
      // return the 'end' of the last one
      return this.segments[this.segments.length - 1].end;
    }
    // otherwise return the origin
    return this.maze.units[0][this.maze.entranceY];
  }

  travel(direction, color) {
    // don't move if the path is complete
    if (this.complete) return;

    // get the end of the line
    let current = this.last();
    let hitJunction = false;

    // move until you hit a wall
    while (
      current.neighbours[direction] &&
      !current.edges[direction].active &&
      !hitJunction
    ) {
      current = current.neighbours[direction];

      // if the new unit has fewer than 2 edges then you've hit a junction and should stop moving
      if (current.countWalls() != 2) {
        hitJunction = true;
      }

      // stop if the new unit is at the cusp of the exit
      if (current.x == this.maze.unitsX - 1 && current.y == this.maze.exitY) {
        hitJunction = true;
      }
    }

    // if it has moved, add it to the path
    if (current != this.last()) {
      this.addToPath(current.x, current.y, color);
    }

    // if the current unit is the last one on the grid the maze is complete!
    if (
      current.x == this.maze.unitsX - 1 &&
      current.y == this.maze.exitY &&
      direction == 1
    ) {
      this.complete = true;
    }

    this.maze.draw();
  }

  reset() {
    this.complete = false;
    this.pathColor = this.originalPathColor;
    this.segments = [];
    this.addToPath(0, this.maze.entranceY);
  }

  draw(c) {
    const m = this.maze;
    const pathWidth = m.size * 0.15;
    const pathHeadSize = m.size * 0.4;

    c.fillStyle = this.pathColor;
    c.lineWidth = pathWidth;

    // draw start of path
    c.fillRect(
      -m.marginLeft * m.pixelRatio,
      (0.5 + m.entranceY) * m.size - pathWidth * 0.5,
      0.5 * m.size + m.marginLeft * m.pixelRatio,
      pathWidth
    );

    // draw end of path if it's finished
    if (this.complete) {
      // set the colour to the last segment
      c.fillStyle = this.segments[this.segments.length - 1].color;
      c.fillRect(
        (m.unitsX - 0.5) * m.size,
        (0.5 + m.exitY) * m.size - pathWidth * 0.5,
        0.5 * m.size + m.marginLeft * m.pixelRatio,
        pathWidth
      );
    }

    // draw each segment of path
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].draw(c, pathWidth);
    }

    // draw ball at the end of path
    if (!this.complete) {
      let end = this.last();
      c.beginPath();
      c.arc(
        (end.x + 0.5) * m.size,
        (end.y + 0.5) * m.size,
        pathHeadSize * 0.5,
        0,
        2 * Math.PI
      );
      c.fill();
    }
  }
}

export default MazePath;
