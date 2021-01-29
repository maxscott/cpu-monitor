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
			<Header />

			<div className="container m-auto mt-8">
				<Chart mainSeries={rawData} averageSeries={movingAverage} />
			</div>

			<div className="container mx-auto mt-8">
				{
					openAlert
					? <Card 
							color="red"
							header="Alert Opened"
							body={"Alert began at " + openAlert.start.x.toString()}/>
					:	<Card color="red" header="No Open Alerts" />
				}

				<br />

				{ resolvedAlerts && <AlertTable data={resolvedAlerts} /> }

			</div>
    </div>
  );
}

function AlertTable({ data }: { data: Array<Alert> }) {
	return (
		<>
			<h1 className="text-center text-xl">Resolved Alerts</h1>
			<table className="shadow-lg bg-white table-fixed">
				<thead>
					<tr>
						<th className="w-1/4 bg-blue-100 border text-left px-6 py-2">#</th>
						<th className="w-1/4 bg-blue-100 border text-left px-6 py-2">Start</th>
						<th className="w-1/4 bg-blue-100 border text-left px-6 py-2">End</th>
					</tr>
				</thead>

				<tbody>
					{data.map((a,i) => <AlertListItem data={a} i={i+1} />)}
				</tbody>
			</table>
		</>
	)
}

function AlertListItem({ data, i }: { data: Alert, i: number }) {
	return (<tr>
		<td className="border px-6 py-2">{i}</td>
		<td className="border px-6 py-2">{data.start.x.toString()}</td>
		<td className="border px-6 py-2">{data.end?.x?.toString()}</td>
	</tr>)
}

function Card({
	header,
	body,
	color
}: {
	header: string,
	body?: string, 
	color: "red" | "gray"
}) {
	return (
		<div className={`bg-${color}-100 w-2/3 mx-auto h-32 flex p-6 rounded-lg shadow-xl`}>
			<div className="pt-1">
				<h4 className={`text-xl text-${color}-900 leading-tight`}>{header}</h4>
				<span className="text-base text-gray-600 leading-normal inline-block">{body}</span>
			</div>
		</div>
	)
}

function Header() {
	return (
		<header className="w-screen bg-gradient-to-r from-purple-800 to-blue-500 shadow-lg">
			<div className="py-1 text-center">
				<span className="text-white font-sans font-semibold">CPU Monitoring is here! 🎉</span>
			</div>
		</header>
	)
}

export default App;
