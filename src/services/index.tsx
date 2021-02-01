import { Point, Alert, Nullable } from '../models';
import config from '../config';

export async function fetchPoint() {
  const res = await fetch(config.cpuUrl);
  const json = await res.json();
  return Point.create(json["cpu"]);
}

export function processAlert(openAlert: Nullable<Alert>, point: Point): Nullable<Alert> {
  if (point.y > config.threshold) {
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

export function processAverage(
  movingSum: number,
  movingWindow: Array<Point>,
  movingAverage: Array<Nullable<Point>>,
  point: Point
): [number, Array<Point>, Array<Nullable<Point>>] {
  movingWindow.push(point);
  movingSum += point.y;

  if (movingWindow.length > config.averageWindowSize) {
    movingSum -= movingWindow.shift()?.y || 0;
  }

  if (movingWindow.length === config.averageWindowSize) {
    movingAverage.shift();
    const val = Math.round(movingSum / config.averageWindowSize * 100)/100;
    movingAverage.push(Point.create(val));
  }

  return [movingSum, movingWindow, movingAverage];
}
