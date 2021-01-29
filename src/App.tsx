import { useState, useEffect } from 'react';
import Chart from './Chart';
import { Point, Alert, Nullable } from './Models';
import { PointService, AlertService, MovingAverageService } from './Services';

const config = {
	pollInterval: 2000,
	averageWindowSize: 3,
	threshold: .18,
	minutesOverThreshold: 1,
	cpuUrl: "http://localhost:3001/cpu"
};

// Service objects
const maService = new MovingAverageService(config.averageWindowSize);
const pointService = new PointService(config.cpuUrl);
const alertService = new AlertService(config.threshold, config.minutesOverThreshold);

function App() {
	// Moving average state
	const [ movingAverage, setMovingAverage ] = useState(Array<Nullable<Point>>(60).fill(null));
	const [ movingWindow, setMovingWindow ] = useState(Array<Point>());
	const [ movingSum, setMovingSum ] = useState(0);

	// Main data series state
	const [ rawData, setRawData ] = useState(Array<Nullable<Point>>(60).fill(null));

	// Alert state
	const [ resolvedAlerts, setResolvedAlerts ] = useState(Array<Alert>());
	const [ openAlert, setOpenAlert ] = useState<Nullable<Alert>>(null);

	function tick() {
		pointService.fetchPoint().then(point => {

			// set new data, evicting oldest value
			setRawData([...rawData.slice(1), point]);

			// Update moving window, sum, and average
			const [
				newMovingSum,
				newMovingWindow,
				newMovingAverage
			] = maService.process(movingSum, movingWindow, movingAverage, point);

			setMovingSum(newMovingSum);
			setMovingWindow(newMovingWindow);
			setMovingAverage(newMovingAverage)

			const tickAlert: Nullable<Alert> = alertService.process(openAlert, point);

			if (tickAlert && tickAlert.end) {

				// Alert is resolved
				console.debug({ resolved: tickAlert });
				setOpenAlert(null);
				setResolvedAlerts([...resolvedAlerts, tickAlert]);
			}
			else if (tickAlert) {
				// Alert is new
				if (!openAlert) {
					console.debug({ opened: tickAlert });
				}

				setOpenAlert(tickAlert);
			}
		});
	}

	useEffect(() => {
		const interval = setInterval(() => tick(), config.pollInterval);
		return () => clearInterval(interval);
	});

  return (
    <div className="h-screen bg-white">
      <header className="w-screen h-6 bg-gradient-to-r from-purple-800 to-blue-500 shadow-lg">
				<div className="text-center">
					<span className="subpixel-antialiased text-white font-sans font-semibold text-xs">CPU Monitoring is here! 🎉</span>
				</div>
      </header>
			<div className="container">
				<Chart mainSeries={rawData} averageSeries={movingAverage} />
			</div>

			<div className="container mx-10">
				<h4>Open Alert</h4>
				{
					openAlert && <span>{openAlert.start.x.toString()} {openAlert.start.y}</span>
				}

				<br />

				<h1 className="text-center">Resolved Alerts</h1>

				<table className="shadow-lg bg-white table-auto">
					<thead>
						<tr>
							<th className="bg-blue-100 border text-left px-6 py-2 w-50">#</th>
							<th className="bg-blue-100 border text-left px-6 py-2 w-100">Start</th>
							<th className="bg-blue-100 border text-left px-6 py-2 w-100">End</th>
						</tr>
					</thead>

					<tbody>
						{resolvedAlerts.map((a,i) => <AlertListItem data={a} i={i+1} />)}
					</tbody>
				</table>
			</div>
    </div>
  );
}

function AlertListItem({ data, i }: { data: Alert, i: number }) {
	return (<tr>
		<td className="border px-6 py-2">{i}</td>
		<td className="border px-6 py-2">{data.start.x.toString()}</td>
		<td className="border px-6 py-2">{data.end?.x?.toString()}</td>
	</tr>)
}

export default App;
