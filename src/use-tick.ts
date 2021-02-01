import { Dispatch, SetStateAction, useEffect } from 'react';
import { Alert, Nullable, StateObject } from './Models';
import { fetchPoint, processAlert, processAverage } from './Services';
import config from './config';

export default function useTick(
  state: StateObject,
  setState: Dispatch<SetStateAction<StateObject>>
) {
  async function tick(state: any, setState: any) {
    const point = await fetchPoint();

    // Update moving window, sum, and average
    const [
      newMovingSum,
      newMovingWindow,
      newMovingAverage
    ] = processAverage(state.movingSum, state.movingWindow, state.movingAverage, point);

    const tmpState = {
      ...state,
      rawData: [...state.rawData.slice(1), point],  // set new data, evicting oldest value
      movingSum: newMovingSum,
      movingWindow: newMovingWindow,
      movingAverage: newMovingAverage
    };

    const tickAlert: Nullable<Alert> = processAlert(state.openAlert, point);

    // Resolving an alert
    if (tickAlert && tickAlert.end) {
      setState({
        ...tmpState,
        openAlert: null,
        resolvedAlerts: [...state.resolvedAlerts, tickAlert]
      });
    }
    // Start/continue an alert
    else if (tickAlert) {
      if (!state.openAlert) {
        console.debug({ opened: tickAlert });
      }

      setState({
        ...tmpState,
        openAlert: tickAlert
      });
    }
    // Business as usual
    else {
      setState({
        ...tmpState,
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => tick(state, setState), config.pollInterval);
    return () => clearInterval(interval);
  });
}
