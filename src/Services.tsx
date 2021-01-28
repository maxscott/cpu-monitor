import { Point, Nullable } from './Models';

export class PointService {
  static async fetchPoint(): Promise<Point> {
		return fetch("http://localhost:3001/cpu")
			.then(res => res.json())
			.then(result => Point.create(result["cpu"]));
  }
}

export class MovingAverageService {
  windowSize: number

  constructor(windowSize = 5) {
    this.windowSize = windowSize;
  }

  process(
    movingSum: number,
    movingWindow: Array<Point>,
    movingAverage: Array<Nullable<Point>>,
    point: Point
  ): [number, Array<Point>, Array<Nullable<Point>>] {
    movingWindow.push(point);
    movingSum += point.y;

    if (movingWindow.length > this.windowSize) {
      movingSum -= movingWindow.shift()?.y || 0;
    }

    if (movingWindow.length === this.windowSize) {
      movingAverage.shift();
      const val = Math.round(movingSum / this.windowSize * 100)/100;
      movingAverage.push(Point.create(val));
    }

    return [movingSum, movingWindow, movingAverage];
  }
}
