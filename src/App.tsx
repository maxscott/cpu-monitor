import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

function App() {
	// Container for chart data
	const [rawData, setRawData] = useState(new Array(56).fill(null).concat([]));

	const { data, options } =  {
		data: {
			labels: rawData.map(a => !a ? "" : moment(a.x).format("HH:MM:ss")),
			datasets: [{
				label: 'CPU Usage',
				data: rawData,
				borderWidth: 1,
				backgroundColor: "rgba(0, 0, 255, 0.25)"
			}]
		},
		options: {
			animation: {
				duration: 0
			},
			elements: {
				line: {
					tension: 0
				},
				point: {
					radius: 0
				}
			},
			xAxes: [{
				type: 'time',
				ticks: {
					autoSkip: true,
					maxTicksLimit: 20,
					min: 0,
					max: 1,
				}
			}],
			scales: {
				yAxes: [{
					ticks: {
						max: 1,
						min: 0,
						stepSize: 0.1
					}
				}]
			},
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
		const interval = setInterval(tick, 2000);
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
				<Line
					data={data}
					options={options}/>
			</div>
    </div>
  );
}

export default App;
