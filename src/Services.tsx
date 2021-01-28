import { Point, Alert, Nullable } from './Models';

export class PointService {
  url: string

  constructor(url: string) {
    this.url = url;
  }

  async fetchPoint(): Promise<Point> {
		return fetch(this.url)
			.then(res => res.json())
			.then(result => Point.create(result["cpu"]));
  }
}

export class AlertService {
  threshold: number

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  process(openAlert: Nullable<Alert>, point: Point): Nullable<Alert> {
    if (point.y > this.threshold) {
      if (openAlert) {

        // still in the alert state
        // return the open alert
        return openAlert;
      } else {

        // newly in an alert state
        // return the new open alert
        return new Alert(point);
      }
    } else {
      if (openAlert) {

        // close and return the alert
        return openAlert.close(point)
      } else {

        // no existing or created alert
        return null;
      }
    }
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
