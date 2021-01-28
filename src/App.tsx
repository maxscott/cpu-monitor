import { useState, useEffect } from 'react';
import Chart from './Chart';
import { Point, Alert, Nullable } from './Models';
import { PointService, AlertService, MovingAverageService } from './Services';

const config = {
	pollInterval: 2000,
	averageWindowSize: 3,
	threshold: .2,
	cpuUrl: "http://localhost:3001/cpu"
};

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

	// Service objects
	const maService = new MovingAverageService(config.averageWindowSize);
	const pointService = new PointService(config.cpuUrl);
	const alertService = new AlertService(config.threshold);

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

			// const tickAlert: Nullable<Alert> = alertService.process(openAlert, point);

			// if (tickAlert && tickAlert.end) {

			// 	// Alert is resolved
			// 	setOpenAlert(null);
			// 	setResolvedAlerts([...resolvedAlerts, tickAlert]);
			// }
			// else if (alert) {

			// 	// Alert is still open
			// 	if (openAlert) {
			// 		// alert === openAlert...
			// 	} else {
			// 		alert(
			// 	}
			// 	setOpenAlert(alert);
			// }
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
    </div>
  );
}

export default App;
