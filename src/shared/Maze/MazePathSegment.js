class MazePathSegment {
  constructor({ startUnit, startEdge, endUnit, endEdge, color, maze }) {
    this.maze = maze;
    this.startUnit = startUnit;
    this.startEdge = startEdge;
    this.endUnit = endUnit;
    this.endEdge = endEdge;
    this.color = color;
  }

  draw(c, pathWidth) {
    const m = this.maze;

    c.strokeStyle = this.color;
    c.beginPath();
    c.moveTo(
      this.startEdge.middle.x * m.size,
      this.startEdge.middle.y * m.size
    );
    c.quadraticCurveTo(
      (this.startUnit.x + 0.5) * m.size,
      (this.startUnit.y + 0.5) * m.size,
      this.endEdge.middle.x * m.size,
      this.endEdge.middle.y * m.size
    );
    c.stroke();
  }
}

export default MazePathSegment;
