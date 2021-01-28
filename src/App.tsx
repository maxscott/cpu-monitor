import { useState, useEffect } from 'react';
import Chart from './Chart';
import { Point } from './Point';
type Nullable<T> = T | null;

function App() {
	const windowSize = 5;

	const [ movingAverage, setMovingAverage ] = useState(Array<Nullable<Point>>(60).fill(null));
	const [ movingWindow, setMovingWindow ] = useState(Array<Point>());
	const [ movingSum, setMovingSum ] = useState(0);
	const [ rawData, setRawData ] = useState(Array<Nullable<Point>>(60).fill(null));

	function tick() {

		// fetch new data
		fetch("http://localhost:3001/cpu")
			.then(res => res.json())
			.then(result => {

				const newPoint = Point.create(result["cpu"]);

				// TODO hoist out of main logic
				// shallow copy state
				// evict old data/padding and add new data to copy
				const newData = [...rawData];
				newData.shift()
				newData.push(newPoint);
				setRawData(newData);

				// Update moving window, sum, and average
				let movingSumTemp = movingSum;
				let movingWindowTmp = movingWindow;
				let movingAverageTmp = movingAverage;

			  movingWindowTmp.push(newPoint);
				movingSumTemp += newPoint.y;
				if (movingWindowTmp.length > windowSize) {
					movingSumTemp -= movingWindowTmp.shift()?.y || 0;
				}
				setMovingSum(movingSumTemp);
				setMovingWindow([...movingWindowTmp]);

				if (movingWindowTmp.length === windowSize) {
					movingAverageTmp.shift();
					const val = Math.round(movingSumTemp / windowSize * 100)/100;
					movingAverageTmp.push(Point.create(val));
				}
				setMovingAverage([...movingAverageTmp])
			});
	}

	useEffect(() => {
		const interval = setInterval(() => tick(), 2000);
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
