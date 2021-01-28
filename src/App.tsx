import { useState, useEffect } from 'react';
import moment from 'moment';
import Chart from './Chart';

function App() {
	// TODO configurable value
	const windowSize = 3;

	const [rawData, setRawData] = useState(Array(60).fill(null));
	const [movingAverage, setMovingAverage] = useState(Array(windowSize).fill(null));
	const [movingWindow, setMovingWindow] = useState([]);
	const [movingSum, setMovingSum] = useState(0);

	function tick() {
		// shallow copy state
		const newData = [...rawData];

		// fetch new data
		fetch("http://localhost:3001/cpu")
			.then(res => res.json())
			.then(result => {

				// Prepare the cpu data
				let cpuValue = result["cpu"];
				cpuValue = Math.floor(cpuValue*100)/100;
				const newPoint =  {
					x: moment().toDate(),
					y: cpuValue
				};

				// evict old data/padding and add new data to copy
				newData.shift()
				newData.push(newPoint);

				// set copy to state, triggering rerender
				setRawData(newData);
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
