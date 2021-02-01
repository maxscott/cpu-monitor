import { useState } from 'react';
import { Point, Alert, Nullable, StateObject } from '../models';
import Chart from '../components/Chart';
import Card from '../components/Card';
import Header from '../components/Header';
import AlertTable from '../components/AlertTable';
import useTick from '../hooks/UseTick';

function App() {
  const [ state, setState ] = useState<StateObject>({
    movingAverage: Array<Nullable<Point>>(60).fill(null),
    movingWindow: Array<Point>(),
    movingSum: 0,
    rawData: Array<Nullable<Point>>(60).fill(null),
    resolvedAlerts: Array<Alert>(),
    openAlert: null
  });

  useTick(state, setState);

  return (
    <div className="h-screen bg-white">
      <Header />

      <div className="container m-auto mt-8">
        <Chart mainSeries={state.rawData} averageSeries={state.movingAverage} />
      </div>

      <div className="container mx-auto mt-8">
        {
          state.openAlert
            ? <Card
              color="red"
              header="Alert Opened"
              body={"Alert began at " + state.openAlert.start.x.toString()}/>
            : <Card color="red" header="No Open Alerts" />
        }

        <br />

        { state.resolvedAlerts && <AlertTable data={state.resolvedAlerts} /> }

      </div>
    </div>
  );
}

export default App;
