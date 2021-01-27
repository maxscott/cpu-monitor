import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

function App() {
	// Container for chart data
	const now = moment();
	const [rawData, setRawData] = useState(new Array(56).fill(null).concat([
		{
			x: now.add(0, 'seconds').toDate(),
			y: 1
		}, {
			x: now.add(10, 'seconds').toDate(),
			y: 4
		}, {
			x: now.add(20, 'seconds').toDate(),
			y: 3
		}, {
			x: now.add(30, 'seconds').toDate(),
			y: 7
		},
	]));

	const { data, options } =  {
		data: {
			labels: rawData.map(a => !a ? "" : moment(a.x).format("HH:MM:ss")),
			datasets: [{
				label: 'CPU Usage',
				data: rawData,
				borderWidth: 1
			}]
		},
		options: {
			xAxes: [{
				type: 'time',
				ticks: {
					autoSkip: true,
					maxTicksLimit: 20
				}
			}],
			layout: {
				padding: {
					left: 40,
					right: 40,
					top: 20,
					bottom: 20
				}
			}
		}
	}

	function tick() {
		// shallow copy state
		const newData = [...rawData];

		// fetch new data
		const randValue = Math.floor(Math.random()*7);
		const newPoint =  {
			x: moment().toDate(),
			y: randValue < 4 ? 2 : randValue 
		};

		// evict old data from copy
		newData.shift()

		// add new data to copy
		newData.push(newPoint);

		// set copy to state, triggering rerender
		setRawData(newData);
	}

	useEffect(() => {
		const interval = setInterval(tick, 10000);
		return () => clearInterval(interval);
	});

	console.log("RENDER");

  return (
    <div className="h-screen bg-white">
      <header className="w-screen h-6 bg-gradient-to-r from-purple-800 to-blue-500 shadow-lg">
				<div className="text-center">
					<span className="subpixel-antialiased text-white font-sans font-semibold text-xs">CPU Monitoring is here! 🎉</span>
				</div>
      </header>
			<div className="container">
				<Line
					data={data}
					options={options}/>
				<button
					className="bg-blue-400 text-white rounded-lg w-10"
					onClick={tick}
					>Tick</button>
			</div>
    </div>
  );
}

export default App;
