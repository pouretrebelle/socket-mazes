import MazeUnit from './MazeUnit';
import MazeEdge from './MazeEdge';
import MazePath from './MazePath';

class Maze {
  constructor(c) {
    this.c = c;

    this.pixelRatio = (window && window.devicePixelRatio) || 1;

    // the parts we can't change
    this.unitsX = 30;
    this.unitsY = 20;

    // positioning
    this.width = 1000;
    this.height = 700;
    this.marginLeft = 50;
    this.marginTop = 50;

    // pixel-ratio adjusted values
    this.wallWidth = 4;
    this.wallBorderRadius = 10;

    this.wallColor = '#000';
    this.backgroundColor = '#fff';

    this.size = this.width / this.unitsX;
    this.entranceY = Math.floor(Math.random() * this.unitsY);
    this.exitY = Math.floor(Math.random() * this.unitsY);

    // initialise units and edges as arrays of arrays
    this.units = Array.from({ length: this.unitsX + 1 }, () => []);
    this.edges = Array.from({ length: this.unitsX * 2 + 3 }, () => []);

    // make a load of walls
    this.setupWalls();

    // make a load of units that reference those walls
    this.setupUnits();

    // use algorithm to carve walls
    this.huntAndKill();

    // setup maze path
    this.path = new MazePath(this);
  }

  updateDimensions({ width, height, margin = 0 }) {
    this.width = width;
    this.height = height;

    this.c.canvas.width = width * this.pixelRatio;
    this.c.canvas.style.width = `${width}px`;
    this.c.canvas.height = height * this.pixelRatio;
    this.c.canvas.style.height = `${height}px`;

    const unitsRatio = this.unitsX / this.unitsY;
    const verticalGap =
      (width - margin * 2) / (height - margin * 2) < unitsRatio;

    if (verticalGap) {
      this.marginLeft = margin;
      this.marginTop = (height - (width - margin * 2) / unitsRatio) / 2;
      this.size = ((width - margin * 2) / this.unitsX) * this.pixelRatio;
    } else {
      this.marginTop = margin;
      this.marginLeft = (width - (height - margin * 2) * unitsRatio) / 2;
      this.size = ((height - margin * 2) / this.unitsY) * this.pixelRatio;
    }

    this.wallWidth = this.size * 0.15;
    this.wallBorderRadius = this.size * 0.35;
  }

  // Carving methods
  //===================================

  setupWalls() {
    // initialise 2D array of edges
    for (let x = 0; x <= this.unitsX * 2 + 1; x++) {
      for (let y = 0; y <= this.unitsY; y++) {
        this.edges[x].push(new MazeEdge(x, y, this));
      }
    }
  }

  setupUnits() {
    // initialise 2D array of units
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        this.units[x].push(new MazeUnit(x, y, this));
      }
    }
    // neighbouring needs to be done after they're all initialised
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        this.units[x][y].initialiseNeighbours(x, y);
      }
    }
  }

  regenerate() {
    this.entranceY = Math.floor(Math.random() * this.unitsY);
    this.exitY = Math.floor(Math.random() * this.unitsY);

    this.units.forEach((unit) => (unit.usedDirections = []));

    for (let x = 0; x <= this.unitsX * 2 + 1; x++) {
      for (let y = 0; y <= this.unitsY; y++) {
        this.edges[x][y].active = true;
      }
    }

    // reset the exit and entrances
    this.edges[1][this.entranceY].active = false;
    this.edges[this.unitsX * 2 + 1][this.exitY].active = false;

    this.huntAndKill();
    this.path.reset();
    this.draw();
  }

  // Carving algorithms
  //===================================

  huntAndKill() {
    let startUnit = this.units[Math.round(this.unitsX / 2)][
      Math.round(this.unitsY / 2)
    ];
    while (startUnit != false) {
      this.kill(startUnit);
      startUnit = this.hunt();
    }

    // reset activity of units
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        this.units[x][y].active = false;
      }
    }
  }

  kill(tile) {
    let curUnit = tile;
    curUnit.activate();
    // remove an active edge
    let prev = curUnit.getActiveNeighbour();
    let prevEdge = curUnit.edges[prev];
    if (prevEdge) prevEdge.deactivate();
    // find a next tile
    let next = curUnit.getRandomInactiveNeighbour();
    let nextUni = curUnit.neighbours[next];
    while (nextUni != undefined) {
      nextUni.activate();
      curUnit.edges[next].deactivate();
      curUnit = nextUni;
      next = curUnit.getRandomInactiveNeighbour();
      nextUni = curUnit.neighbours[next];
    }
  }

  hunt() {
    for (let x = 0; x < this.unitsX; x++) {
      for (let y = 0; y < this.unitsY; y++) {
        let unit = this.units[x][y];
        let maxNeighbours = 4;
        if (x == 0 || x == this.unitsX - 1) maxNeighbours--;
        if (y == 0 || y == this.unitsY - 1) maxNeighbours--;
        if (!unit.active && unit.countInactiveNeighbours() < maxNeighbours) {
          return unit;
        }
      }
    }
    return false;
  }

  // Drawing methods
  //===================================

  draw() {
    const c = this.c;

    c.fillStyle = this.backgroundColor;
    c.fillRect(
      0,
      0,
      this.width * this.pixelRatio,
      this.height * this.pixelRatio
    );

    c.save();
    c.translate(
      this.marginLeft * this.pixelRatio,
      this.marginTop * this.pixelRatio
    );

    for (let x = 0; x <= this.unitsX * 2 + 1; x++) {
      for (let y = 0; y <= this.unitsY; y++) {
        this.edges[x][y].draw(c);
      }
    }

    // draw the path
    this.path.draw(c);

    c.restore();
  }
}

export default Maze;
