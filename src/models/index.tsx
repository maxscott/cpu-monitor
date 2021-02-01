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

export class Alert {
  start: Point
  end: Nullable<Point>

  constructor(start: Point) {
    this.start = start;
    this.end = null;
  }

  close(end: Point) {
    this.end = end;
    return this;
  }
}

export type Nullable<T> = T | null;

export type StateObject = {
  // Moving average state
  movingAverage: Array<Nullable<Point>>,
  movingWindow: Array<Point>,
  movingSum: number,
  // Main data series state
  rawData: Array<Nullable<Point>>,
  // Alert state
  resolvedAlerts: Array<Alert>,
  openAlert: Nullable<Alert>
};
