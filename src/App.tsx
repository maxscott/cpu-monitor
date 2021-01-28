import { useState, useEffect } from 'react';
import Chart from './Chart';
import { Point, Nullable } from './Point';
import { PointService, MovingAverageService } from './Services';

const config = {
	pollInterval: 2000,
	averageWindowSize: 3
};

function App() {
	const maService = new MovingAverageService(config.averageWindowSize);

	const [ movingAverage, setMovingAverage ] = useState(Array<Nullable<Point>>(60).fill(null));
	const [ movingWindow, setMovingWindow ] = useState(Array<Point>());
	const [ movingSum, setMovingSum ] = useState(0);
	const [ rawData, setRawData ] = useState(Array<Nullable<Point>>(60).fill(null));

	function tick() {
		PointService.fetchPoint().then(point => {

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
