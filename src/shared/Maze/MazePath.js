import MazePathSegment from './MazePathSegment';

class MazePath {
  constructor(maze) {
    this.maze = maze;
    this.complete = false;
    this.pathColor = '#df7f26';
    this.originalPathColor = this.pathColor;
    this.segments = [];

    console.log(this.maze.units[0][0]);
  }

  addToPath({ unit, edge, color = this.pathColor }) {
    this.active = false;

    let last = this.last();
    let segment = new MazePathSegment({
      startUnit: last.endUnit,
      startEdge: last.endEdge,
      endUnit: unit,
      endEdge: edge,
      color: color,
      maze: this.maze,
    });
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
      return this.segments[this.segments.length - 1];
    }

    // otherwise return the entrance and fake start edge
    return {
      endUnit: this.maze.units[0][this.maze.entranceY],
      endEdge: {
        middle: {
          x: 0,
          y: this.maze.entranceY + 0.5,
        },
      },
    };
  }

  travel(direction, color) {
    // don't move if the path is complete
    if (this.complete) return;

    // get the end of the line
    let current = this.last().endUnit;
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
    if (current != this.last().endUnit) {
      this.addToPath({
        unit: current,
        edge: current.edges[(direction + 2) % 4], // where we came from
        color: color,
      });
    }

    // if the current unit is the last one on the grid the maze is complete!
    if (
      current.x == this.maze.unitsX - 1 &&
      current.y == this.maze.exitY &&
      direction == 1
    ) {
      this.complete = true;

      // add final path
      this.addToPath({
        unit: current,
        edge: {
          middle: {
            x: current.x + 1,
            y: current.y + 0.5,
          },
        },
        color: color,
      });
    }

    this.maze.draw();
  }

  reset() {
    this.complete = false;
    this.pathColor = this.originalPathColor;
    this.segments = [];
  }

  draw(c) {
    const m = this.maze;
    const pathWidth = m.size * 0.15;
    const pathHeadSize = m.size * 0.4;

    c.fillStyle = this.pathColor;
    c.strokeStyle = this.pathColor;
    c.lineWidth = pathWidth;

    // draw end of path if it's finished
    if (this.complete) {
      // set the colour to the last segment
      c.fillStyle = this.segments[this.segments.length - 1].color;
      c.fillRect(
        m.unitsX * m.size,
        (0.5 + m.exitY) * m.size - pathWidth * 0.5,
        m.marginLeft * m.pixelRatio,
        pathWidth
      );
    }

    // draw each segment of path
    const segmentCount = this.segments.length;
    for (let i = 0; i < this.segments.length; i++) {
      const opacity = Math.max(0.2, 1 - i * 0.005); // fade out as you go
      c.globalAlpha = opacity;
      this.segments[segmentCount - 1 - i].draw(c, pathWidth);
    }

    // draw start of path
    // at same alpha as last drawn segment
    c.fillRect(
      -m.marginLeft * m.pixelRatio,
      (0.5 + m.entranceY) * m.size - pathWidth * 0.5,
      m.marginLeft * m.pixelRatio,
      pathWidth
    );

    // reset alpha
    c.globalAlpha = 1;

    // draw ball at the end of path
    if (!this.complete) {
      let last = this.last();

      c.beginPath();
      c.moveTo(last.endEdge.middle.x * m.size, last.endEdge.middle.y * m.size);
      c.lineTo(
        (last.endUnit.x + 0.5) * m.size,
        (last.endUnit.y + 0.5) * m.size
      );
      c.stroke();

      c.beginPath();
      c.arc(
        (last.endUnit.x + 0.5) * m.size,
        (last.endUnit.y + 0.5) * m.size,
        pathHeadSize * 0.5,
        0,
        2 * Math.PI
      );
      c.fill();
    }
  }
}

export default MazePath;
