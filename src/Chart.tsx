import { Line } from 'react-chartjs-2';
import options from './chartOptions';
import moment from 'moment';

function Chart({
  mainSeries,
  averageSeries
}: {
  mainSeries: any,
  averageSeries: any
}) {

	const data = {
		labels: mainSeries.map((a: any) => !a ? "" : moment(a.x).format("HH:MM:ss")),
		datasets: [
			{
				label: 'CPU',
				data: mainSeries,
				borderWidth: 1,
				backgroundColor: "rgba(0, 0, 255, 0.25)"
			}, {
				label: 'CPU Average',
				data: averageSeries,
				borderWidth: 2,
				borderColor: "rgba(255, 0, 0, 0.5)",
				backgroundColor: "rgba(0, 0, 0, 0)"
			}
		]
	}

	return <Line data={data} options={options}/>
}

export default Chart;
