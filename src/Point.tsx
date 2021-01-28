export class Point {
  x: Date;
  y: number;

  private constructor(x: Date, y: number) {
    this.x = x;
    this.y = y;
  }

  static create(y: number, x = new Date()) {
    return new Point(x, Math.floor(y * 100) / 100);
  }
}
